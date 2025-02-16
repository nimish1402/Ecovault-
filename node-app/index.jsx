// Packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const multer = require('multer');

// Creating an instance of express
const app = express();

// Serving static files(to help show images in the frontend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Using the cors middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the React frontend
    methods: ['GET', 'POST'],       // Specify allowed HTTP methods
    credentials: true               // Allow credentials (optional)
}));

// Using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Port number
const port = 4000;

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})
const upload = multer({ storage: storage });

// Connecting to the database
mongoose.connect('mongodb://localhost:27017/Ecomm')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));


// Creating model (table) for storing the username and password
const Users = mongoose.model('Users', {
    username: String, 
    mobile: String,
    email: String,
    password: String,
    likedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}]
});
const Products = mongoose.model('Products', { 
    pname: String, 
    pdesc: String, 
    price: String, 
    category:String, 
    pimage: String,
    pimage2: String,
    addedBy:  mongoose.Schema.Types.ObjectId
});



// Default route
app.get('/', (req, res) => {
    res.send('Hello World');
});



// Add product route
app.post('/add-product', upload.fields([{name: 'pimage'},{name:'pimage2'}]),(req, res) => {


    const pname = req.body.pname;
    const pdesc = req.body.pdesc;
    const price = req.body.price;
    const category = req.body.category;
    const pimage = req.files.pimage[0].path;
    const pimage2 = req.files.pimage2[0].path;
    const addedBy = req.body.userId;

    const products = new Products({pname, pdesc, price, category, pimage, pimage2, addedBy })
    
    products.save()
        .then(() =>{
            res.send({message: 'Product saved successfully!'});
        })
        .catch(() => {
            res.send({ message: 'Server error' });
        })

});

// get products url 
app.get('/get-products', (req, res)=>{
    
    Products.find()
        .then((result) => {
            console.log(result, "products data")
            res.send({message: 'user data found', products: result})
        })
        .catch((err) => {
            res.send({ message: 'Server error' });
        })
});

// get categories page  
app.get('/get-category', (req, res)=>{
    
    const catName = req.query.catName;
    
    Products.find({category: catName})
        .then((result) => {
            console.log(result, "products data")
            res.send({message: 'user data found', products: result})
        })
        .catch((err) => {
            res.send({ message: 'Server error' });
        })
});


// liked products url 
app.post('/liked-products', (req, res)=>{
    Users.findOne({_id: req.body.userId}).populate('likedProducts')
        .then((result) => {
            res.send({message: 'fetched likded products', products: result.likedProducts})
        })
        .catch((err) =>{
            res.send({message: 'Server error'})
        })
})
// user details API 
app.get('/get-user/:uId', (req, res)=>{
    const _userId = req.params.uId;

    Users.findOne({_id: _userId})
        .then((result) => {
            res.send({
                message: 'User found', user:{
                    username:result.username, 
                    email: result.email, 
                    mobile: result.mobile
                }
            })
        })
        
        .catch(() => {
            res.send({message: 'Server error'})
        })
    })

// product details url
app.get('/get-product/:pId', (req, res) => {
    console.log(req.params);

    Products.findOne({_id: req.params.pId})
        .then((result) => {
            res.send({message: 'Product found', product: result})
        })
        .catch(() => {
            res.send({message: 'Server error'})
        })
})

// search API
app.get('/search', (req, res) => {

    let search = req.query.search;
    
    Products.find({
        // mongodb query(array)
        $or : [
            {pname: {$regex: search, $options: 'i'}},
            {pdesc: {$regex: search, $options: 'i'}},
            {category: {$regex: search, $options: 'i'}}
        ]
    })
        .then((results) => {
            res.send({message: 'Product found', product: results})
        })
        .catch(() => {
            res.send({message: 'Server error'})
        })
})


    
// Signup route
app.post('/signup', (req, res) => {
    console.log(req.body); // Logging the request body
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const mobile = req.body.mobile;

    // Creating a new user instance
    const user = new Users({ username: username, password: password, email:email, mobile:mobile });

    // Saving the user data to the database
    user.save()
        .then(() => {
            res.send({ message: 'User saved successfully!' });
        })
        .catch(() => {
            res.status(500).send({ message: 'Server error' });
        });
});


// Login route
app.post('/login', (req, res) => {
    console.log(req.body); 
    const username = req.body.username;
    const password = req.body.password;

    // Creating a new user instance
    Users.findOne({username : username})

        .then((result) => {
            console.log(result, "user data");
            if(!result){
                res.send({message: "User not found"});
            }
            else{
                if(result.password == password){
                    const token = jwt.sign({
                        data: result
                    }, 'MYKEY', { expiresIn: '1h' });
                    
                    res.send({ message: "User found" , token: token, userId: result._id});
                }
                if(result.password != password){
                    res.send({ message: "Incorrect Password" })
                }
            }
            
        })
        .catch(() => {
            res.status(500).send({ message: 'Server error' });
        });
});

// liked products route
app.post('/liked-product', (req, res) =>{
    let productId = req.body.productId;
    let userId =req.body.userId;
    
    Users.updateOne({_id: userId}, {$addToSet: {likedProducts: productId}})
        .then(() =>{
            res.send({message: 'Product liked'});
        })
        .catch(() => {
            res.send({message: 'Server error'});
        })
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// 32

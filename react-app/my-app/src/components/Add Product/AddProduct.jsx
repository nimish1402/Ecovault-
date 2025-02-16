// import './Home.css ';
import Header from '../Header/Header.jsx';
import { useNavigate, Link } from 'react-router-dom';
import {useEffect , useState} from 'react';
import axios from 'axios';
import categories from '../categories/CategoriesList.js';

function AddProduct() {

    const navigate = useNavigate();
    const [pname, setpname] = useState('');
    const [pdesc, setpdesc] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [pimage, setpimage] = useState('');
    const [pimage2, setpimage2] = useState('');
    

    useEffect(() =>{
        if(!localStorage.getItem('token')){
            navigate('/Login');
        }
        
    },[])

    const handleApi = () => {
        const formData = new FormData();
        formData.append('pname', pname)
        formData.append('pdesc', pdesc)
        formData.append('price', price)
        formData.append('category', category)
        formData.append('pimage', pimage)
        formData.append('pimage2', pimage2)
        
        formData.append('userId', localStorage.getItem('userId'))
        
        const url = 'http://localhost:4000/add-product';

        axios.post(url, formData)
            .then((res) => {
                console.log(res.data);
                if(res.data.message){
                    alert(res.data.message);
                    navigate('/');
                }
            })
            .catch(()=>{
                alert('server error');
            })
    }
    

    return (
        <div>
            <Header />
            <div className = "p-3">
                <h2>Add Product here</h2>

                <label>Product Name</label>
                <input className = "form-control"type="text" value = {pname} 
                    onChange = {(e) => {setpname(e.target.value)}}/>

                <label>Product Description</label>
                <input className = "form-control"type="text" value = {pdesc}
                    onChange = {(e) => {setpdesc(e.target.value)}}/>

                <label>Product Price</label>
                <input className = "form-control"type="text" value = {price} 
                    onChange = {(e) => {setprice(e.target.value)}}/>

                <label>Product Category</label>
                <select className = "form-control" value = {category}
                    onChange = {(e) => {setcategory(e.target.value)}}>
                    <option>Motors</option>
                    <option>Home Appliances</option>
                    <option>Clothing</option>
                    <option>Mobile</option>
                    <option>Others</option>
                    {
                        categories && categories.length > 0 &&
                        categories.map((item, index) =>{
                            return(
                                <option key = {'option' + index}>{item}</option>
                            )
                        })
                    }
                </select>

                <label>Product Image1</label>
                <input className = "form-control"type="file" 
                    onChange = {(e) => {
                        setpimage(e.target.files[0]);
                        
                    }}/>
                <label>Product Image2</label>
                <input className = "form-control"type="file" 
                    onChange = {(e) => {
                        setpimage2(e.target.files[0]);
                        
                    }}/>
                

                
                <button onClick = {handleApi} className = "btn btn-primary mt-4">Submit</button>
            </div>
        </div>
    )
}

export default AddProduct
// 49:06
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Header from '../Header/Header';

function ProductDetail() {
    
    const [product, setproduct] = useState();
    const [user, setUser] = useState();
    const p = useParams();

    useEffect(() => {
        const url = 'http://localhost:4000/get-product/' + p.productId;
        axios.get(url)
            .then((res) => {
                console.log(res)
                if(res.data.product){
                    setproduct(res.data.product)
                }
            })
            .catch((err) => {
                console.log(err);
            })  
    }, []);

    const handleContact = (addedBy) => {
        console.log('id', addedBy)
        const url = 'http://localhost:4000/get-user/' + addedBy;
        axios.get(url)
            .then((res) => {
                if(res.data.user){
                    setUser(res.data.user)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (<>
            <Header />
            <h4>PRODUCT DETAILS</h4>
            
            <div >
                {product && <div className ="d-flex justify-content-between flex-wrap">
                    <div>
                        <img width = '400px' height= "300px" src={'http://localhost:4000/' + product.pimage} alt="" />
                        {product.pimage2 && <img width = '400px' height= "300px" src={'http://localhost:4000/' + product.pimage2} alt="" />}
                        
                        
                    </div>
                    <div>
                        <h4 className = "m-2 price-text"> ₹ {product.price}</h4>
                        <h4 className = "m-2 price-text"> {product.pname}</h4>
                        <p className = "m-2 ">{product.category}</p>
                        <p className = "m-2 text-success">{product.pdesc}</p>
                        { product.addedBy && 
                            <button onClick = {()=>handleContact(product.addedBy)}>
                                Show Contact Details
                            </button>
                        }
                            { user && user.username && <h3> {user.username}</h3> }
                            { user && user.username && <h6> {user.email}</h6> }
                            { user && user.username && <h6> {user.mobile}</h6> }
                    </div>
                </div>}
            </div>
        </>
    );
}

export default ProductDetail;
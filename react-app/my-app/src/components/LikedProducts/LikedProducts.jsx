// import '../Home/Home.css'
import '../Home/Home.css';
import Header from '../Header/Header.jsx';
import { useNavigate, Link, data } from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Categories from '../categories/Categories.jsx';

import { FaHeart,FaRegHeart } from "react-icons/fa";

function LikedProducts() {

    const navigate = useNavigate();

    const[products, setproducts] = useState([]);
    const[catproducts, setcatproducts] = useState([]);
    const[search, setsearch] = useState('');
    

    // useEffect(() =>{
    //     if(!localStorage.getItem('token')){
    //         navigate('/Login');
    //     }
        
    // },[])

    useEffect(() =>{
        const url = 'http://localhost:4000/liked-products';
        let data = {userId: localStorage.getItem('userId')};
        axios.post(url, data)
            .then((res) => {
                console.log(res);
                if(res.data.products){
                    setproducts(res.data.products);
                }
            })
            .catch((err) =>{
                console.log(err);
                alert('Internal erver error');
            })
    },[])

    const handleSearch = (value) =>{
        setsearch(value);
    }
    const handleClick = () =>{
        console.log('products', products);

        let filteredProducts = products.filter((item) =>{
            if(item.pname.toLowerCase().includes(search.toLowerCase()) || 
                item.pdesc.toLowerCase().includes(search.toLowerCase()) || 
                item.category.toLowerCase().includes(search.toLowerCase())){
                    return item;
            }
        })
        setcatproducts(filteredProducts)

    }

    const handleCategory = (value) => {
       
        
        let filteredProducts = products.filter((item) =>{
            if(item.category == value){
                    return item;
            }
        })
        setcatproducts(filteredProducts)
    }

    const handleLike = (productId) => {
        let userId = localStorage.getItem('userId');
        console.log('userId', 'productId',productId, userId);
        
        const url = 'http://localhost:4000/liked-product';
        const data = {userId, productId};
        axios.post(url, data)
            .then((res)=>{
                if(res.data.message){
                    alert('Liked');
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    }

    return (
        <div>
            <Header search = {search} handleSearch={handleSearch} handleClick = {handleClick}/>
            
            <Categories handleCategory = {handleCategory}/>

            
            <h6>Filtered results</h6>
            <div className = "d-flex justify-content-center flex-wrap">
                {catproducts && catproducts.length > 0 &&
                    catproducts.map((item, index) =>{
                        return (
                            <div key={item._id} className = "card m-3" >
                                <div onClick = {() => handleLike(item._id)} className='icon-container'>
                                    <FaHeart className='H-icons' />
                                </div>
                                <img width="300px" src={'http://localhost:4000/' + item.pimage} alt="img" />
                                <p className = "m-2 ">{item.pname} | {item.category}</p>
                                <h4 className = "m-2 text-danger">{item.price}</h4>
                                <p className = "m-2 text-success">{item.pdesc}</p>
                                
                            </div>    
                        )
                    })}
            </div>
            <h6>All results</h6>
            <div className = "d-flex justify-content-center flex-wrap">
                {products && products.length > 0 &&
                    products.map((item, index) =>{
                        return (
                            <div key={item._id} className = "card m-3" >
                                 <div onClick = {() => handleLike(item._id)} className='icon-container'>
                                    <FaHeart className='H-icons'  />
                                </div>
                                <img width="300px" src={'http://localhost:4000/' + item.pimage} alt="img" />
                                <p className = "m-2 ">{item.pname} | {item.category}</p>
                                <h4 className = "m-2 text-danger">{item.price}</h4>
                                <p className = "m-2 text-success">{item.pdesc}</p>
                                
                            </div>    
                        )
                    })}
            </div>

            
        </div>
    )
}

export default LikedProducts

// 24:
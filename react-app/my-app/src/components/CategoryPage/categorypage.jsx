import './categorypage.css'
import Header from '../Header/Header.jsx';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Categories from '../categories/Categories.jsx';

import { FaHeart,FaRegHeart } from "react-icons/fa";

function CategoryPage() {

    const navigate = useNavigate();
    const params = useParams();
    console.log(params);

    const[products, setproducts] = useState([]);
    const[catproducts, setcatproducts] = useState([]);
    const[search, setsearch] = useState('');
    const[issearch, setissearch] = useState(false);

    // useEffect(() =>{
    //     if(!localStorage.getItem('token')){
    //         navigate('/Login');
    //     }
        
    // },[])

    useEffect(() => {
        if (!params.catName) return;
        
        const url = `http://localhost:4000/get-category?catName=${params.catName}`;
        axios.get(url)
            .then((res) => {
                console.log(res);
                if (res.data.products) {
                    setproducts(res.data.products);
                    setcatproducts(res.data.products); // Ensure UI updates with new products
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Internal server error');
            });
    }, [params.catName]);

    const handleSearch = (value) =>{
        setsearch(value);
    }

    const handleClick = () =>{
        const url = "http://localhost:4000/search?search=" + search; 
        axios.get(url)
            .then((res) => {
                setcatproducts(res.data.product);  // Only update `catproducts`
                setissearch(true);
            })
            .catch((err) => {
                alert('server error');
            });
    };

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

    // product details page 
    const handleProduct = (id) =>{
        navigate('/product/' + id);
    }

    return (
    <div>
        <Header search={search} handleSearch={handleSearch} handleClick={handleClick} />
        <Categories handleCategory={handleCategory} />

        {/* Display search results if a search is performed */}
        {issearch ? (
            <div>
                {catproducts.length > 0 ? (
                    <>
                        <h6>
                            Search results
                            <button className = "clear-btn" onClick={()=> setissearch(false)}>Clear</button>
                        </h6>
                        <div className="d-flex justify-content-center flex-wrap">
                            {catproducts.map((item) => (
                                <div onClick={() => handleProduct(item._id)} key={item._id} className="card m-3">
                                    <div onClick={() => handleLike(item._id)} className="icon-container">
                                        <FaHeart className="H-icons" />
                                    </div>
                                    <img width="300px" height="200px" src={'http://localhost:4000/' + item.pimage} alt="img" />
                                    <h4 className="m-2 price-text">₹ {item.price}</h4>
                                    <p className="m-2">{item.pname} | {item.category}</p>
                                    <p className="m-2 text-success">{item.pdesc}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <h6>No results found</h6>
                )}
            </div>
        ) : (
            // Display default products when not searching
            <div className="d-flex justify-content-center flex-wrap">
                {products.length > 0 &&
                    products.map((item) => (
                        <div onClick={() => handleProduct(item._id)} key={item._id} className="card m-3">
                            <div onClick={() => handleLike(item._id)} className="icon-container">
                                <FaHeart className="H-icons" />
                            </div>
                            <img width="300px" height="200px" src={'http://localhost:4000/' + item.pimage} alt="img" />
                            <h4 className="m-2 price-text">₹ {item.price}</h4>
                            <p className="m-2">{item.pname} | {item.category}</p>
                            <p className="m-2 text-success">{item.pdesc}</p>
                        </div>
                    ))}
            </div>
        )}
    </div>

    )
}

export default CategoryPage;

// 21:54
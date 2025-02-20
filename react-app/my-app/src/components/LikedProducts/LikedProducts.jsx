import '../Home/Home.css';
import Header from '../Header/Header.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Categories from '../categories/Categories.jsx';

import { FaHeart, FaRegHeart } from "react-icons/fa";

function LikedProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [catProducts, setCatProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [likedProducts, setLikedProducts] = useState(new Set()); 

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/Login');
        }
    }, []);

    useEffect(() => {
        const fetchLikedProducts = async () => {
            try {
                const url = 'http://localhost:4000/liked-products';
                let data = { userId: localStorage.getItem('userId') };
                const res = await axios.post(url, data);
                
                if (res.data.products) {
                    setProducts(res.data.products);

                    const likedSet = new Set(res.data.products.map(p => p._id));
                    setLikedProducts(likedSet);
                }
            } catch (err) {
                console.error(err);
                alert('Internal server error');
            }
        };

        fetchLikedProducts();
    }, []);

    const handleLike = async (productId) => {
        let userId = localStorage.getItem('userId');
        const url = 'http://localhost:4000/liked-product';
        const data = { userId, productId };

        try {
            const res = await axios.post(url, data);

            if (res.data.message) {
                setLikedProducts(prev => {
                    const newLikes = new Set(prev);
                    if (newLikes.has(productId)) {
                        newLikes.delete(productId);
                    } else {
                        newLikes.add(productId);
                    }
                    return newLikes;
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Header search={search} handleSearch={setSearch} handleClick={() => {
                setCatProducts(products.filter(item =>
                    item.pname.toLowerCase().includes(search.toLowerCase()) ||
                    item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
                    item.category.toLowerCase().includes(search.toLowerCase())
                ));
            }} />
            <Categories handleCategory={(value) => {
                setCatProducts(products.filter(item => item.category === value));
            }} />

            <h6>All Results</h6>
            <div className="d-flex justify-content-center flex-wrap">
                {products.length > 0 && products.map(item => (
                    <div key={item._id} className="card m-3 position-relative">
                        <div 
                            onClick={() => handleLike(item._id)} 
                            className="icon-container"
                        >
                            {likedProducts.has(item._id) ? <FaHeart className="H-icons" /> : <FaRegHeart className="H-icons" />}
                        </div>
                        <img width="300px" src={'http://localhost:4000/' + item.pimage} alt="img" />
                        <p className="m-2">{item.pname} | {item.category}</p>
                        <h4 className="m-2 text-danger">{item.price}</h4>
                        <p className="m-2 text-success">{item.pdesc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LikedProducts;

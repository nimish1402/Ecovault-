import { Link, useNavigate } from 'react-router-dom';
import './Header.css'
import { BsSearch } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { useState } from 'react';

function Header (props){
    
    const [loc, setloc] = useState();
    const navigate = useNavigate();

    const handleLogout = () =>{
        localStorage.removeItem('token');
        navigate('/Login');
    }

    let locations = [
        {
            "latitude": 28.6139,
            "longitude": 77.2090,
            "placeName": "New Delhi, Delhi"
        },
        {
            "latitude": 19.0760,
            "longitude": 72.8777,
            "placeName": "Mumbai, Maharashtra"
        }, 
        {
            "latitude": 23.0791653,
            "longitude":76.8605537,
            "placeName": "Bhopal, Madhya Pradesh"
        }
    ]
    return(
        <div className='header-container  d-flex justify-content-between'>
            
            <div className="header">
                <Link className='links ' to ="/"> EcoVault</Link>
                
                {/* geolocation */}
                <select value = {loc} onChange={(e)=>{
                    localStorage.setItem('user-loc',e.target.value)
                    setloc(e.target.value)
                }}>
                    {
                        locations.map((item, index) => {
                            return (
                                <option value={`${item.latitude}, ${item.longitude}`}>
                                    {item.placeName}
                                </option>
                            )
                        })
                    }
                </select>

                {/* search bar  */}
                <input className = 'Search' type="text" value ={props && props.search} 
                    onChange={(e) =>{
                        props.handleSearch && props.handleSearch(e.target.value)
                    }}
                />
                <button className = 'Search-btn' onClick={() => props.handleClick && props.handleClick()}> <BsSearch /></button>
                {/* <span className='mt-3'>HEADER DIVISION</span>    */}
            </div>
            
            <div>
                
                { !!localStorage.getItem('token') && 
                <Link to='/add-product'>
                    <button className='logout-btn'>Add Product</button>
                </Link>}

                { !!localStorage.getItem('token') && 
                <Link to='/liked-products'>
                    <button className='logout-btn'><FaHeart /></button>
                </Link>}

                {/* if not logged in shows the login button if logged in shows the logout button  */}
                {!localStorage.getItem('token') ?
                    <Link className='links' to ="/Login"> Login</Link> :
                    <button className='logout-btn' onClick={handleLogout}>LOGOUT</button>}
            </div>
        </div>
    )
}

export default Header;
// 29:39
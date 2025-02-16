import Header from '../Header/Header.jsx';
// import './Login.css';
import { Link, useNavigate} from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const HandleApi = () => {
        console.log({username:username , password:password});
        // url will be the whatsoevery port the backend is running on 
        const url ='http://localhost:4000/login';
        const data = {username, password};
        axios.post(url, data)
            .then((res)=>{
                
                if(res.data.message){

                    if(res.data.token){
                        // token saved to the local storage 
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('userId', res.data.userId);
                        navigate('/');
                    }

                    alert(res.data.message);
                }
            })
            .catch((err)=>{
                console.log(err);
                alert('Server Error');
            })
    }
        

    return(
        <div >
            <Header />
            <br/>
            <div className='p-3 m-3'>
                Username:
                <input className = "form-control" type="text" value={username}
                onChange={(e)=>{
                    setusername(e.target.value)
                }} 
                />
                <br/>

                Password:
                <input className = "form-control" type="text" value = {password}
                    onChange={(e)=>{
                        setpassword(e.target.value)
                    }} 
                />
                <br/>

                <button className='btn btn-primary m-3' onClick = {HandleApi}> Login </button>
                <Link to = "/Signup">Signup</Link>
            </div>
            
        </div>
    )
}

export default Login;


import Header from '../Header/Header.jsx';
import { Link } from 'react-router-dom';
import {useState} from 'react';
import axios from 'axios';

function Signup(){
   
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [mobile, setmobile] = useState('');
    const [email, setemail] = useState('');
    
    // function to print username and password after pressing submit button
    const HandleApi = () => {
        // url will be the whatsoevery port the backend is running on 
        const url ='http://localhost:4000/signup';
        const data = {username, password, mobile, email}
        axios.post(url, data)
        .then((res)=>{
            console.log(res.data);
            if(res.data.message){
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
            <div className = "p-3 m-3">
                Enter Username:
                <input className = "form-control" type="text" value={username} 
                    onChange={(e)=>{
                        setusername(e.target.value)
                    }}
                />
                <br/>
                Enter Phone No:
                <input className = "form-control" type="text" value={mobile} 
                    onChange={(e)=>{
                        setmobile(e.target.value)
                    }}
                />
                <br/>
                Email:
                <input className = "form-control" type="text" value={email} 
                    onChange={(e)=>{
                        setemail(e.target.value)
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

                <button className = "btn btn-primary m-3"onClick = {HandleApi}> SignUp </button>
                <Link to="/Login">Login</Link>
            </div>
                          
        </div>
    )
}

export default Signup;
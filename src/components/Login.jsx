import { useState} from "react"
import axios from 'axios'
import {motion} from 'framer-motion'
import '../styles/form.css'

const Login = (props) => {
    const [cin,setcin] = useState("JB514304")
    const [password,setpassword] = useState('123456')
    
    const handleBtn = (e) => {
        e.preventDefault()
        axios.post(`https://notes.devlop.tech/api/login`,{"cin" : cin,
            "password" : password
        })
        .then(res => {   
            console.log(res);
            localStorage.setItem('firstName',res.data.user.first_name)
            localStorage.setItem('lastName',res.data.user.last_name)
            localStorage.setItem('token',res.data.token)
            props.setisConnected(true)
        })
    }



    const handleCin = (e) => {
        setcin(e.target.value);
    }

    const handlePw = (e) => {
        setpassword(e.target.value)
    }


    return(
        <motion.div 
            className="formContainer"
            initial={{ y : 50 , opacity : 0 }}
            animate={{ y : 0 , opacity : 1 }}
            transition={{ duration : 1 }}
            >
            <form>
                <h2>ENTER YOUR ACCOUNT</h2>
                <label>CIN</label>
                <input type="text" value={cin} placeholder="entrez votre cin" onChange={handleCin} />
                <br />
                <label>PASSWORD</label>
                <input type="password" value={password} placeholder="entrez votre password" onChange={handlePw} />
                <br />
                <button className="login" onClick={handleBtn}>LOGIN</button>
            </form>
        </motion.div>
    )
}

export default Login
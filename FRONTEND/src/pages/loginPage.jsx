import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function loginUser(e){
        e.preventDefault();
        try{
        const loginData = {
            email,
            password
        };

        console.log(loginData);

        const response = await axios.post(
            "http://localhost:3000/auth/login",
            loginData,
            {
                withCredentials: true
            }
        );

        navigate('/dashboard');
    }
    catch(error){
        alert(error.response.data.message);
    }

    }

    return (
        <div className="mainframe min-h-screen flex justify-center items-center p-5">
            <div className="register_wrapper w-full max-w-md p-8 rounded-xl">
                <h1 className="register_title text-5xl text-center mb-8">
                    WELCOME BACK
                </h1>
                <form
                    onSubmit={loginUser}
                    className="flex flex-col gap-6"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="auth_input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="auth_input"
                    />

                    <button className="create_acc_btn mt-5">
                        LOGIN
                    </button>
                </form>

                <p className="login_text mt-8 text-center">
                    Don't have an account?
                    <Link 
                        to="/register"
                        className="cursor-pointer underline text-cyan-400 ml-2"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage;
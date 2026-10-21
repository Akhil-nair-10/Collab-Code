import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const RegisterPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function registerUser(e){
        e.preventDefault();
        try {
            const userData = {
                username,
                email,
                password
            };
            const response = await axios.post(
                "http://localhost:3000/auth/register",
                userData,
                {
                    withCredentials: true
                }
            );
            console.log(response.data);
            navigate('/dashboard');
        }
        catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            }
            else {
                alert("Unable to connect to the server.");
            }
        }
    }

    return (

        <div className="mainframe min-h-screen flex justify-center items-center p-5">
            <div className="register_wrapper w-full max-w-md p-8 rounded-xl">
                <h1 className="register_title text-5xl text-center mb-8">
                    JOIN COLLAB CODE
                </h1>
                <form 
                    onSubmit={registerUser}
                    className="flex flex-col gap-6"
                >
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        className="auth_input"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="auth_input"
                    />
                    <input
                        type="password"
                        placeholder="Create Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="auth_input"
                    />
                    <button className="create_acc_btn mt-5">
                        CREATE ACCOUNT
                    </button>
                </form>

                <p className="login_text mt-8 text-center">
                    Already have an account?
                    <span className="cursor-pointer text-yellow-300 ml-2">
                        <Link to="/" className="cursor-pointer underline text-cyan-400 ml-2">
                            Login
                        </Link>
                    </span>
                </p>
            </div>
        </div>
    )
}


export default RegisterPage
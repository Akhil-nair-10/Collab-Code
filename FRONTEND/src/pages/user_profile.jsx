import React, { useEffect } from 'react'
import { useState } from 'react';
import { FaPen } from "react-icons/fa";
import axios from 'axios';
import avatars from "../utils/avatars.js";
import { useNavigate } from 'react-router-dom';

const User_profile = () => {

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [user, setUser] = useState(null);
    const [PasswordModal, setPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    
    const navigate = useNavigate();

    function handleMouseMove(e) {
        setMousePos({
            x: e.clientX,
            y: e.clientY
        });
    }

    async function logoutUser() {
    try {
        const response = await axios.post(
            "http://localhost:3000/auth/logout",
            {},
            {
                withCredentials: true
            }
        );
        alert(response.data.message);
        navigate("/");
    }
    catch (error) {
        console.log(error);
    }
    }

    async function deleteAccount() {
    const confirmation = window.confirm(
        "Are you sure you want to delete your account?"
    );
    if (!confirmation) return;
    try {
        const response = await axios.delete(
            "http://localhost:3000/auth/delete",
            {
                withCredentials: true
            }
        );
        alert(response.data.message);
        navigate("/register");
    }
    catch (error) {
        console.log(error);
    }
    }

    async function changePWD() {
        try {
        const response = await axios.put(
            "http://localhost:3000/auth/changePWD",
            {
            currentPassword,
            newPassword
            },
            {
                withCredentials: true
            }
        );
        alert(response.data.message);
        setPasswordModal(false);
    }
    catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
    }

    async function changeAvatar(profile_pic) {
    try {
        const response = await axios.put(
            "http://localhost:3000/auth/changeAvt",
            {
                profile_pic
            },
            {
                withCredentials: true
            }
        );
        alert(response.data.message);
        setUser({
            ...user,
            profile_pic
        });
        setShowAvatarModal(false);
    }
    catch (error) {
        console.log(error);
    }
    }

useEffect(() => {
    async function getLoggedInUser() {
        try {
            const response = await axios.get(
                "http://localhost:3000/auth/fetchMe",
                {
                    withCredentials: true
                }
            );
            setUser(response.data.user);
        }
        catch (error) {
            console.log(error);
        }
    }
    getLoggedInUser();
}, []);

    return (

        <div
            className='mainframe h-screen w-screen flex flex-col'
            onMouseMove={handleMouseMove}
            style={{
                background: `radial-gradient(
                    circle at ${mousePos.x}px ${mousePos.y}px,
                    rgba(147,51,234,.25),
                    #28093d 0%,
                    #08020d 70%
                )`
            }}
        >
            {/* Header */}
            <div className='h-[12%] flex justify-center items-center border-b-2 border-gray-500'>
                <h1 className='profile_header font-extrabold text-5xl lg:text-6xl text-yellow-300'>
                    USER PROFILE
                </h1>
            </div>

            {/* Body */}
            <div className='flex flex-1 flex-col lg:flex-row'>

                {/* LEFT */}
                <div className='lg:w-1/3 flex flex-col justify-center items-center border-r-2 border-gray-500'>
                    <div className='relative'>
                        <div className='w-72 h-72 rounded-full border-4 border-gray-300 bg-zinc-800'><img src={avatars[(user?.profile_pic || 1) - 1]} alt="profile" className="w-full h-full rounded-full object-cover"/></div>
                        <button className='absolute bottom-5 right-5 w-12 h-12 rounded-full bg-yellow-300 text-black flex justify-center items-center hover:scale-110 duration-200 cursor-pointer' onClick={() => setShowAvatarModal(true)}>
                            <FaPen size={15} />
                        </button>
                    </div>
                    <h2 className='text-white text-3xl font-bold mt-8'>
                        {user?.username}
                    </h2>
                    <p className='text-gray-400 text-xl mt-2'>
                        {user?.email}
                    </p>
                </div>

                {/* RIGHT */}
                <div className='lg:w-2/3 flex flex-col justify-center items-center gap-20'>
                    <div className='text-center'>
                        <p className='text-gray-400 text-xl'>
                            MEMBER SINCE
                        </p>
                        <h2 className='text-white text-3xl mt-3'>
                            {new Date(user?.created_at).toLocaleDateString()}
                        </h2>
                    </div>
                    <div className='flex flex-wrap justify-center gap-8'>
                        <button className='create_acc_btn' onClick={() => setPasswordModal(true)}>
                            Change Password
                        </button>
                        <button className='create_acc_btn' onClick={logoutUser}>
                            Logout
                        </button>
                        <button className='dele_acc_btn' onClick={deleteAccount}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
            {
                PasswordModal && (
                    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                        <div className="bg-zinc-900 border-2 border-yellow-400 rounded-xl w-420px p-8">
                            <h2 className="text-yellow-300 text-3xl font-bold text-center mb-8">
                                Change Password
                            </h2>
                        <div className="flex flex-col gap-5">
                    <input
                        type="password"
                        placeholder="Current Password"
                        className="auth_input"
                        value={currentPassword}
                        onChange={(e)=>setCurrentPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        className="auth_input"
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                    />
                    <button className="create_acc_btn mt-3" onClick={changePWD}>
                        Change Password
                    </button>
                    <button onClick={() => setPasswordModal(false)} className="text-gray-300 hover:text-white mt-2">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        )
    }

    {
    showAvatarModal && (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
        <div className="bg-zinc-900 border-2 border-yellow-400 rounded-xl p-8">
        <h2 className="text-yellow-300 text-3xl font-bold text-center mb-8">
            Choose Avatar
        </h2>
        <div className="grid grid-cols-4 gap-5">
            {avatars.map((avatar, index) => (
                <img
                    key={index}
                    src={avatar}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border-2 border-transparent hover:border-yellow-400 cursor-pointer duration-200 hover:scale-110"
                    onClick={() => changeAvatar(index + 1)}
                />
            ))}

        </div>

        <button
            onClick={() => setShowAvatarModal(false)}
            className="mt-8 w-full text-gray-300 hover:text-white"
        >
            Cancel
        </button>

    </div>

</div>

)
}

    </div>
    )
}

export default User_profile;
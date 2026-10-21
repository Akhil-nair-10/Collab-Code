import React from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import avatars from "../utils/avatars.js";

const Main_dashboard = () => {

    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [mousePos, setMousePos] = useState({x: 0, y: 0});

    //just that mouse movement capturing part
    function handleMouseMove(e){
    setMousePos({
        x: e.clientX,
        y: e.clientY
    });
    }

    async function createRoom() {
        try {
            const response = await axios.post(
                "http://localhost:3000/room/create_room",
                {},
            {
                withCredentials: true
            }
            );
            const { roomId } = response.data;
            navigate(`/session?roomId=${roomId}`);
        } catch (error) {
            console.error("Failed to create room:", error);
            alert("Unable to create room.");
        }
    }
    
    async function joinRoom() {

        if (!roomId.trim()) {
            alert("Please enter a Room ID.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/room/join_room",
                {
                    roomId,
                },
                {
                    withCredentials:true
                }
            );

            if (response.data.success) {
                navigate(`/session?roomId=${roomId}`);
            }

        } catch (error) {
            console.error(error);
            alert("Unable to join room.");
        }
    }

useEffect(() => {
    async function getLoggedInUser() {
        try {
            const response = await axios.get(
                "http://localhost:3000/auth/me",
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
    <div className='mainframe flex lg:flex-row flex-col p-4 h-screen' onMouseMove={handleMouseMove} 
    style={{
        background: `radial-gradient(
            circle at ${mousePos.x}px ${mousePos.y}px,
            #581c87,
            #08020d 90%
        )`
    }}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="fixed top-6 right-6 flex flex-col gap-2 cursor-pointer z-50">
            <span className={`hamburger_line ${isMenuOpen ? "line1" : ""}`}></span>
            <span className={`hamburger_line ${isMenuOpen ? "line2" : ""}`}></span>
            <span className={`hamburger_line ${isMenuOpen ? "line3" : ""}`}></span>
        </button>
    <div className={`fixed top-0 right-0 h-screen w-72 bg-zinc-900 border-l-2 border-yellow-400 transition-all duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6">
            <div className="flex flex-col items-center mt-12">
                <div className="w-28 h-28 border-2 border-yellow-400 rounded-full bg-yellow-300"><img src={avatars[(user?.profile_pic || 1) - 1]} alt="profile" className="w-full h-full rounded-full object-cover"/></div>
                    <h2 className="text-yellow-300 text-2xl font-bold mt-5">
                        {user?.username}
                    </h2>
                    <p className="text-gray-300">
                        {user?.email}
                    </p>
                    <button className="create_acc_btn mt-8 w-full" onClick={()=>{navigate('/profile')}}>
                        Profile Settings
                    </button>
                </div>
            </div>
        </div>
        <div className='web_header text-yellow-300 lg:h-full lg:w-2/5 flex flex-col justify-center lg:ml-10'>
            <h1 className='font-extrabold text-6xl lg:text-8xl'>COLLAB CODE</h1>
            <h3>A session based real time collaborative code compiler for students and teachers</h3>
        </div>
        <div className='h-full lg:w-3/5 w-full flex flex-col'>
            <div className='link_and_join_wrapper h-1/2 flex justify-center lg:ml-20 lg:items-end items-center gap-4 lg:gap-10 lg:flex-row flex-col'>
                <input type='text' className='session_input bg-purple-400 lg:h-1/5 h-2/5 mt-5 lg:w-3/6 border-2 text-2xl rounded-lg' placeholder='Enter the link' value={roomId} onChange={(e) => setRoomId(e.target.value)}/>
                <button className='join_btn bg-yellow-300 rounded-lg' onClick={joinRoom}>JOIN</button>
            </div>
            <div className='h-1/2 w-full flex justify-center items-center'>
                <button className='create_session_btn rounded-lg lg:w-1/3' onClick={createRoom}>Create a Session</button>
            </div>
        </div>
    </div>
  )
}

export default Main_dashboard

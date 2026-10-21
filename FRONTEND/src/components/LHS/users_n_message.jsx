import React, { useState } from 'react'
import avatars from "../../utils/avatars.js";

const Users_n_message = ({roomData, socket, messages}) => {

    const [message, setMessage] = useState("");
    const [openMenu, setOpenMenu] = useState(null);

    if(!roomData){
        return<h1>Loading...</h1>
    }


    const sendMessage = () => {

    if (!message.trim()) {
        return;
    }

    if (!socket) {
        return;
    }

    socket.emit(
        "send-message",
        {
            roomId: roomData.roomId,
            message: message
        }
    );

    setMessage("");

};

  return(
    <div className='infos_bg h-screen lg:w-1/4 w-full flex items-center flex-col gap-2 m-0 p-2'>
        <div className='admin_div h-1/7 w-full px-3 flex flex-col justify-start gap-1 border-2 border-white'>
            <h2 className='connected_users_txt flex justify-center items-center font-extrabold text-2xl text-center text-yellow-400'>Admin</h2>
            <hr/>
            <div className='admin_block bg-purple-800 flex justify-start items-center gap-2 border-purple-500 border-2 p-1 w-full h-1/2 mb-1'>
            <img
                src={avatars[(roomData?.admin?.profile_pic || 1) - 1]}
                alt="Host"
                className="w-10 h-10 rounded-full object-cover"
            />
            <p className='text-center mt-2 text-yellow-300 rounded-lg font-bold h-full'>
                {roomData.admin.username}
            </p>
            </div>
        </div>
        <div className='admin_div border-2 border-white h-2/7 w-full bg-slate-500 px-3 flex flex-col'>
            <h2 className='connected_users_txt font-extrabold text-2xl text-center text-yellow-400'>Connected Users</h2>
            <hr/>
            {
                roomData.participants.map((user, index) => (
                    <div key={index} className="relative">
                        <div
                            className='users_block text-left px-2 mt-2 bg-purple-700 text-cyan-400 border-2 border-purple-500 flex justify-between font-medium items-center py-1'>
                            <div className='flex justify-center items-center gap-1'>
                            <img
                                src={avatars[(user.profile_pic || 1) - 1]}
                                alt={user.username}
                                className="w-7 h-7 rounded-full object-cover"
                            />
                            {user.username}
                            </div>
                            <button className='cursor-pointer' onClick={() => {
                                if (openMenu === index) {
                                    setOpenMenu(null);
                                } else {
                                    setOpenMenu(index);
                                }
                            }}>...</button>
                        </div>
                        {openMenu === index && (
                            <div
                                className="absolute right-0 top-full z-50 w-40 bg-[#2b004e] border border-purple-400 rounded-md shadow-lg"
                            >
                                <button
                                    className="block w-full text-left px-3 py-2 hover:bg-purple-800 cursor-pointer"
                                    onClick={() => {
                                        console.log(
                                            "Kick user:",
                                            user.username
                                        );
                                        setOpenMenu(null);
                                    }}
                                >
                                    Kick User
                                </button>
                                <button
                                    className="block w-full text-left px-3 py-2 hover:bg-purple-800 cursor-pointer"
                                    onClick={() => {
                                        console.log(
                                            "Transfer host to:",
                                            user.username
                                        );
                                        setOpenMenu(null);
                                    }}
                                >
                                    Transfer Host
                                </button>
                            </div>
                        )}
                    </div>
                ))
            }
        </div>
        <div className='message_div h-4/7 w-full bg-white px-3 flex flex-col border-purple-600 border-2'>
            <h2 className='connected_users_txt font-extrabold text-2xl text-center'>Chat Window</h2>
            <hr/>
            <div className='message_area h-7/9 overflow-auto'>
                <div className='flex justify-start flex-col'>
                    {
                        messages.map(
                            (msg, index) => (
                                <div key={index}>
                                    <strong>
                                        {msg.username}
                                    </strong>
                                    <p>
                                        {msg.message}
                                    </p>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <div type='text' className='h-1/9 rounded-lg flex'>
            <input type='text' className='message_input bg-gray-400 border w-full px-2' placeholder='Message...' value={message} onChange={(e)=>{setMessage(e.target.value)}} onKeyDown={(e) => {if (e.key === "Enter"){sendMessage();}}}></input>
            <button className='h-full w-12 bg-teal-500 font-bold text-2xl flex items-center justify-center border cursor-pointer hover:bg-teal-700' onClick={sendMessage}>⩥</button>
            </div>
        </div>
    </div>
  )
}

export default Users_n_message

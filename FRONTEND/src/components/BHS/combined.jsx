import React from "react";
import Users_n_message from "../LHS/users_n_message";
import Code_editor from "../RHS/code_editor";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const Combined = () => {

  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [roomData, setRoomData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  /* GET ROOM DATA */

  useEffect(() => {

    async function getRoom() {
      try {
        const response = await axios.get(
          `http://localhost:3000/room/${roomId}`
        );

        setRoomData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (roomId) {
      getRoom();
    }

  }, [roomId]);

  /* GET LOGGED-IN USER */

  useEffect(() => {

    async function getLoggedInUser() {
      try {
        const response = await axios.get(
          "http://localhost:3000/auth/me",
          { withCredentials: true }
        );

        setCurrentUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    }

    getLoggedInUser();

  }, []);

  /* SOCKET CONNECTION */

  useEffect(() => {

    if (!roomId) {
      return;
    }

    const newSocket = io(
      "http://localhost:3000",
      { withCredentials: true }
    );

    setSocket(newSocket);

    /* JOIN ROOM */

    newSocket.emit("join-room", roomId);

    /* PARTICIPANT JOINED */

    newSocket.on("participant-joined", (user) => {

      setRoomData((previousRoomData) => {

        if (!previousRoomData) {
          return previousRoomData;
        }

        return {
          ...previousRoomData,
          participants: [
            ...previousRoomData.participants,
            user
          ]
        };

      });

    });

    /* PARTICIPANT LEFT */

    newSocket.on("participant-left", ({ userId }) => {

      setRoomData((previousRoomData) => {

        if (!previousRoomData) {
          return previousRoomData;
        }

        return {
          ...previousRoomData,
          participants: previousRoomData.participants.filter(
            user => user.userId !== userId
          )
        };

      });

    });

    /* HOST LEAVE / HOST TRANSFER */

    newSocket.on("leave-room-update", (data) => {

      setRoomData((previousRoomData) => {

        if (!previousRoomData) {
          return previousRoomData;
        }

        /* HOST CHANGED */

        if (data.hostChanged) {

          return {
            ...previousRoomData,
            admin: {
              userId: data.newHost.userId,
              username: data.newHost.username,
              profile_pic: data.newHost.profile_pic
            },
            participants: data.participants
          };

        }

        /* SESSION ENDED */

        if (data.sessionEnded) {
          return previousRoomData;
        }

        /* NORMAL PARTICIPANT LEFT */

        return {
          ...previousRoomData,
          participants: data.participants
        };

      });

    });

    /* RECEIVE MESSAGE */

    newSocket.on("receive-message", (message) => {

      setMessages((previousMessages) => [
        ...previousMessages,
        message
      ]);

    });

    /* ROOM ERROR */

    newSocket.on("room-error", (error) => {

      console.error(
        "Room socket error:",
        error.message
      );

    });

    /* CLEANUP */

    return () => {
      newSocket.disconnect();
    };

  }, [roomId]);

  /* DETERMINE CURRENT USER ID */

  const currentUserId =
    currentUser?.id ||
    currentUser?._id ||
    currentUser?.userId;

  /* DETERMINE WHETHER CURRENT USER IS HOST */

  const isHost = Boolean(
    currentUserId &&
    roomData?.admin?.userId &&
    currentUserId === roomData.admin.userId
  );

  /* DEBUGGING */

  console.log("CURRENT USER:", currentUser);
  console.log("CURRENT USER ID:", currentUserId);
  console.log("ROOM ADMIN:", roomData?.admin);
  console.log("IS HOST:", isHost);

  return (
    <div className="combined_bg h-screen w-full flex lg:flex-row items-center bg-black flex-col-reverse">

      <Users_n_message
        roomData={roomData}
        socket={socket}
        messages={messages}
      />

      <Code_editor
        roomId={roomId}
        socket={socket}
        isHost={isHost}
        initialReadOnly={roomData?.readOnly}
      />

    </div>
  );

};

export default Combined;
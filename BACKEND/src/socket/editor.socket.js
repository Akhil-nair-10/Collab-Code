import { YSocketIO } from "y-socket.io/dist/server";
import { rooms } from "../store/room.store.js";

function editorSocket(io) {

  const ysocketio = new YSocketIO(io);
  ysocketio.initialize();

  io.on("connection", (socket) => {

    /* JOIN ROOM */

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });

    /* RUN OUTPUT */

    socket.on("run-output", ({ roomId, output, language }) => {
      socket.to(roomId).emit("run-output", {
        output,
        language
      });
    });

    /* LANGUAGE CHANGE */

    socket.on("language-change", ({ roomId, language }) => {
      socket.to(roomId).emit("language-change", {
        language
      });
    });

    /*
     * TOGGLE READ ONLY
     * Only the host is allowed to change this.
     */

    socket.on("toggle-read-only", (roomId) => {

      const room = rooms.get(roomId);

      if (!room) {
        return;
      }

      /*
       * Get the authenticated user's ID.
       * Depending on your auth middleware,
       * the ID might be stored as id, _id, or userId.
       */

      const socketUserId =
        socket.user?.id ||
        socket.user?._id ||
        socket.user?.userId;

      /*
       * SECURITY CHECK
       * If the logged-in user is not the host,
       * reject the request.
       */

      if (!socketUserId || room.host.userId !== socketUserId) {
        socket.emit("read-only-denied");
        return;
      }

      /* HOST PASSED THE CHECK */

      room.readOnly = !room.readOnly;

      /* TELL EVERYONE IN THE ROOM */

      io.to(roomId).emit("read-only-changed", {
        readOnly: room.readOnly
      });

    });

  });

}

export default editorSocket;
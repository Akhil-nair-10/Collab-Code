# Collab Code

**A collaborative coding environment for writing, sharing, and executing code in session-based workspaces.**

Collab Code is a web application designed to make collaborative programming easier by bringing code editing, session-based collaboration, and code execution into one workspace. It combines a browser-based editor with real-time synchronization technologies to support shared coding sessions.

## 📸 Screenshots

<!-- Replace the paths below with your actual screenshot filenames. -->

### Dashboard
<img width="1535" height="818" alt="Screenshot 2026-10-21 151604" src="https://github.com/user-attachments/assets/1bf655a8-9faa-426f-b64e-2e4e890e1dcd" />

### Collaborative Coding Workspace
<img width="1535" height="815" alt="Screenshot 2026-10-21 151755" src="https://github.com/user-attachments/assets/13e9cd35-d58a-4bcd-bd7a-a4f423ecd4d2" />

### Participant can join but cannot access host permissions
<img width="1535" height="822" alt="Screenshot 2026-10-21 152038" src="https://github.com/user-attachments/assets/bff8092e-6869-47a0-90b2-a102512a6619" />

### After trying to click the Read-Only button as participant 
<img width="1535" height="818" alt="Screenshot 2026-10-21 152122" src="https://github.com/user-attachments/assets/3025b2ec-b3d4-41bd-997b-bcd1ff2a8a00" />

### After Host made the editor state to Read-Only the host can still access but participants can't 
<img width="530" height="196" alt="Screenshot 2026-10-21 152338" src="https://github.com/user-attachments/assets/35cbb64b-c7c1-48b3-a35f-ef9ddcc059e0" />

### If host leaves the session then the oldest participant becomes new host and if the last host leaves then the session terminates 
<img width="1535" height="817" alt="Screenshot 2026-10-21 152440" src="https://github.com/user-attachments/assets/a94f5ab2-b590-4a08-937a-7368289f10f1" />

### Also basic Profile Management 
<img width="1535" height="817" alt="Screenshot 2026-10-21 152518" src="https://github.com/user-attachments/assets/92fa4d10-fd60-4389-9965-d500733b820a" />


## ✨ Features

- **Session-Based Workspaces** — Create and join coding sessions for collaborative programming.
- **Monaco Code Editor** — Edit code using Monaco Editor, the editor technology behind Visual Studio Code.
- **Real-Time Code Synchronization** — Share code changes across connected participants using Socket.IO and Yjs.
- **Code Execution** — Execute supported programming languages through an integrated compiler workflow.
- **Authentication** — User authentication and protected application routes.
- **Backend API** — A Node.js and Express backend for application logic and communication between the frontend and backend.
- **Collaborative Architecture** — A session-oriented structure that brings editing and collaboration into a shared coding environment.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript |
| Code Editor | Monaco Editor |
| Real-Time Communication | Socket.IO |
| Collaborative State | Yjs |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT, HTTP cookies |
| Code Execution | OneCompiler API |
| HTTP Requests | Axios |

## 🏗️ Architecture

Collab Code separates the frontend, backend, and code execution workflow.

```text
                 ┌────────────────────────┐
                 │      React Frontend    │
                 │                        │
                 │  Dashboard & Sessions  │
                 │  Monaco Code Editor   │
                 └───────────┬────────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
       ┌───────▼────────┐         ┌────────▼────────┐
       │ REST API       │         │ Real-Time Layer │
       │ Express.js     │         │ Socket.IO + Yjs │
       └───────┬────────┘         └────────┬────────┘
               │                           │
       ┌───────▼────────┐                   │
       │  PostgreSQL    │                   │
       │ Persistent Data│                   │
       └────────────────┘                   │
                                            │
                              ┌─────────────▼─────────┐
                              │ Collaborative Editing │
                              │ Across Connected Users│
                              └───────────────────────┘

                 Code Execution Workflow
                            │
                            ▼
                   ┌─────────────────┐
                   │ OneCompiler API │
                   └─────────────────┘
```

### How it works

1. A user authenticates and accesses the application.
2. Users create or join a coding session.
3. The Monaco Editor provides the code-editing interface.
4. Socket.IO handles real-time communication, while Yjs manages collaborative document state.
5. The backend handles application requests and persistent data.
6. Code submitted for execution is sent through the compiler integration, and the resulting output is presented in the workspace.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- PostgreSQL
- A OneCompiler API key, if required by your current compiler integration

### 1. Clone the repository

```bash
git clone https://github.com/Akhil-nair-10/Collab-Code.git
cd Collab-Code
```

### 2. Configure the backend

Open a terminal in the backend directory:

```bash
cd BACKEND
npm install
```

Create a `.env` file in the backend directory and configure the environment variables required by the application.

Typical configuration may include:

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
ONECOMPILER_API_KEY=your_api_key
```

**Important:** These are illustrative variable names. Check the backend source code and existing environment configuration to confirm the exact names, required values, and port used by your implementation.

Ensure PostgreSQL is running and the database is configured before starting the backend.

Start the backend using the development script defined in its `package.json`. For example:

```bash
npm run dev
```

### 3. Configure the frontend

Open a separate terminal:

```bash
cd Collab-Code/FRONTEND
npm install
```

Configure the frontend environment variables according to the API URL configuration used in your source code.

For example, a Vite application may use:

```env
VITE_API_URL=http://localhost:3000
```

Use the actual variable name expected by your frontend; the example above is not a confirmed repository setting.

Start the frontend using its available development script. For example:

```bash
npm run dev
```

### 4. Open the application

Open the local URL printed by the frontend development server in your browser.

Keep both the frontend and backend running while using the application.

> The commands and environment examples above are a setup template. Confirm the actual npm scripts, ports, database initialization requirements, and environment variable names in the repository before publishing these instructions as verified setup steps.

## 🧠 Engineering Highlights

### Real-Time Collaboration

The project explores real-time application architecture through Socket.IO and Yjs. These technologies address communication between connected clients and the synchronization of shared document state.

### Collaborative Code Editing

Monaco Editor provides a dedicated programming interface, while the collaboration layer is responsible for keeping shared editing state consistent between participants.

### Session-Based Design

Coding sessions provide a structure for organizing participants and their shared workspace rather than treating each editor as an isolated instance.

### Backend Integration

The Express.js backend connects the frontend with application services, authentication, persistent storage, and the compiler integration.

## 🔧 Challenges and Learnings

- Integrating a code editor into a multi-user application.
- Managing synchronization of shared document state across clients.
- Coordinating frontend state with backend APIs and real-time events.
- Designing session-based collaboration flows.
- Integrating an external code execution service into the development workflow.

## 🔮 Future Improvements

Potential improvements include:

- More granular host and participant permissions.
- Read-only participant mode and session access controls.
- Improved error handling for compiler requests and connection failures.
- Expanded testing for concurrent edits and session lifecycle events.
- Better handling of disconnected users and reconnection scenarios.

*These are potential enhancements, not claims about currently implemented functionality.*

## 👨‍💻 Author

**Akhil Nair**

- GitHub: [@Akhil-nair-10](https://github.com/Akhil-nair-10)
- Project Repository: [Collab-Code](https://github.com/Akhil-nair-10/Collab-Code)

---

*Collab Code is a project exploring collaborative web development, real-time communication, shared code editing, and backend integration.*

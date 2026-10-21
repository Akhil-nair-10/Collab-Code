import React from "react";
import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { MonacoBinding } from "y-monaco";

const Code_editor = ({ roomId, socket, isHost, initialReadOnly }) => {

  const [code, setCode] = useState("// your code goes here");
  const [activeTab, setActiveTab] = useState("editor");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("javascript");
  const [readOnly, setReadOnly] = useState(false);

  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);

  useEffect(() => {
    if (typeof initialReadOnly === "boolean") {
      setReadOnly(initialReadOnly);
    }
  }, [initialReadOnly]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("run-output", ({ output, language }) => {
      setOutput(output);
      setLang(language);
      setActiveTab("output");
    });

    socket.on("language-change", ({ language }) => {
      setLang(language);
    });

    socket.on("read-only-changed", ({ readOnly }) => {
      setReadOnly(readOnly);
    });

    socket.on("read-only-denied", () => {
      alert("Only the host can change Read Only mode.");
    });

    return () => {
      socket.off("run-output");
      socket.off("language-change");
      socket.off("read-only-changed");
      socket.off("read-only-denied");
    };
  }, [socket]);

  const isLocked = readOnly && !isHost;

  const toggleReadOnly = () => {
    if (!socket) {
      return;
    }

    socket.emit("toggle-read-only", roomId);
  };

  const runMyCode = async () => {
    try {
      setIsRunning(true);
      setError("");
      setOutput("");

      const response = await axios.post(
        "http://localhost:3000/compiler/run",
        {
          language: lang,
          sourceCode: code
        }
      );

      setOutput(response.data.output);

      if (socket) {
        socket.emit("run-output", {
          roomId,
          output: response.data.output,
          language: lang
        });
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setIsRunning(false);
      setActiveTab("output");
    }
  };

  const endSession = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/room/${roomId}/end`,
        { withCredentials: true }
      );

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Unable to end session."
      );
    }
  };

  const leaveSession = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/room/${roomId}/leave`,
        { withCredentials: true }
      );

      if (socket) {
        socket.emit("leave-room-update", {
          roomId,
          ...response.data
        });
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Unable to leave session."
      );
    }
  };

  const handleEditorMount = (editor, monaco) => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new SocketIOProvider(
      "http://localhost:3000",
      roomId,
      ydoc,
      { autoConnect: true }
    );

    providerRef.current = provider;

    const ytext = ydoc.getText("monaco");

    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    bindingRef.current = binding;

    editor.onDidChangeModelContent(() => {
      setCode(editor.getValue());
    });
  };

  return (
    <div className="session_bg h-screen lg:w-3/4 w-full overflow-hidden p-2 flex flex-col">

      <div className="navbar flex justify-between items-center h-10 w-full pr-3 border border-white">

        <div className="flex justify-center items-center h-10 w-1/3">
          <button className={`editor_tab h-full w-1/2 cursor-pointer border ${activeTab === "editor" ? "bg-black text-white border-b-transparent" : "bg-transparent text-white"}`} onClick={() => setActiveTab("editor")}>Editor</button>

          <button className={`output_tab h-full w-1/2 cursor-pointer border ${activeTab === "output" ? "bg-black text-white border-b-transparent" : "bg-transparent text-white"}`} onClick={() => setActiveTab("output")}>Output</button>
        </div>

        <select
          className="lang_options bg-[#1c0030] text-white h-8 border"
          value={lang}
          disabled={isLocked}
          onChange={(e) => {
            const newLang = e.target.value;
            setLang(newLang);

            if (socket) {
              socket.emit("language-change", {
                roomId,
                language: newLang
              });
            }
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="csharp">C#</option>
        </select>

        <button className="run_btn h-8 lg:w-20 cursor-pointer" onClick={runMyCode} disabled={isRunning || isLocked}>RUN</button>
      </div>

      <div className="session_bg lg:h-full h-screen w-full overflow-hidden border-l-2 border-r-2 border-white">
        {activeTab === "editor" ? (
          <Editor
            height="100%"
            language={lang}
            value={code}
            theme="hc-black"
            options={{ readOnly: isLocked }}
            onMount={handleEditorMount}
          />
        ) : (
          <pre className="h-full w-full bg-black text-yellow-400 px-4">
            {error || output || "Run your code to see the output..."}
          </pre>
        )}
      </div>

      <div className="flex h-15 w-full justify-end items-center gap-5 px-10 border-2 border-white">

        <div className="flex bg-amber-200 justify-center items-center">
          <button className="read_only_btn flex h-10 justify-center items-center w-30" onClick={toggleReadOnly}>
            {readOnly ? "🔒 Read Only" : "🔓 Read Only"}
          </button>
        </div>

        <button className="leave_btn flex h-10 justify-center items-center w-20" onClick={leaveSession}>Leave</button>

        <button className="end_btn flex h-10 justify-center items-center w-20" onClick={endSession}>END</button>
      </div>

    </div>
  );
};

export default Code_editor;
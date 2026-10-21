import axios from "axios";

const compilerMap = {
    javascript: "typescript-deno",
    python: "python-3.14",
    java: "openjdk-25",
    cpp: "g++-15",
    c: "gcc-15",
    rust: "rust-1.93",
    go: "go-1.26",
    csharp: "dotnet-csharp-9"
};

async function runCode(req, res) {

    try {

        const { language, sourceCode } = req.body;

        const compiler = compilerMap[language];

        if (!compiler) {
            return res.status(400).json({
                error: `Language "${language}" is not supported`
            });
        }

        const response = await axios.post(

            "https://api.onlinecompiler.io/api/run-code-sync/",

            {
                compiler,
                code: sourceCode
            },

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": process.env.ONLINECOMPILER_API_KEY
                },
                timeout: 35000
            }
        );

        res.json({
            output: response.data.output || response.data.error || "No output",
            executionTime: response.data.time,
            memoryUsed: response.data.memory
        });

    } catch (err) {

        console.log(err.response?.data || err.message);

        if (err.response?.status === 429) {
            return res.status(429).json({
                error: "Server is busy right now — please try again in a moment"
            });
        }

        res.status(500).json({
            error: "Compilation Failed"
        });
    }
}

export default {
    runCode
};
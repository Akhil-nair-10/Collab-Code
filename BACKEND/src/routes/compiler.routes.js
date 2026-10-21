import express from "express";
import compilerController from '../controllers/compiler.controller.js';

const router = express.Router();

router.post("/run", compilerController.runCode);

export default router;
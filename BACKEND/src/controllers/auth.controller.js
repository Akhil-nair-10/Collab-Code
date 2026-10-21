import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

async function registerMe(req, res) {
    try {
        const { username, email, password } = req.body;
        
        //just to check if user exists or not
        const existingUser = await pool.query(
        `SELECT *
        FROM user_accs
        WHERE email = $1
        OR username = $2`,
        [email, username]
        );

        //if exists then to throw an error 
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            });
        }

        //password hashing code
        const hashedPassword = await bcrypt.hash(password, 10);

        //random number roll for pfp
        const randomAvatar = Math.floor(Math.random() * 8) + 1;

        //store in db
        const newUser = await pool.query(
        `INSERT INTO user_accs(username, email, password, profile_pic)
        VALUES($1, $2, $3, $4)
        RETURNING *`,
        [username, email, hashedPassword, randomAvatar]
        );

        //jwt creation
        const token = jwt.sign(
            {
                id: newUser.rows[0].id          //0 index is of the row returned by the sql query and nothing to do with the id in the table 
            },
            process.env.JWT_SECRET
        );

        // Success Response
        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: newUser.rows[0].id,
                username: newUser.rows[0].username,
                email: newUser.rows[0].email
            }
        });

        
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function loginMe(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await pool.query(
            `SELECT *
            FROM user_accs
            WHERE email = $1`,
            [email]
        );

        if (existingUser.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No such user exists, Please Register"
            });
        }

        const user = existingUser.rows[0];

        // Compare Password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET
        );

        // Store JWT in Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        // Success Response
        return res.status(200).json({
            success: true,
            message: "Login Successful.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

async function findMeLite(req, res) {
    try {
        const user = await pool.query(
            `SELECT id, username, email, profile_pic
            FROM user_accs
            WHERE id = $1`,
            [req.user.id]
        );
        console.log(user.rows);
        return res.status(200).json({
            success: true,
            user: user.rows[0]
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function findMe(req, res) {
    try {
        const user = await pool.query(
            `SELECT id, username, email, created_at, profile_pic
            FROM user_accs
            WHERE id = $1`,
            [req.user.id]
        );
        console.log(user.rows);
        return res.status(200).json({
            success: true,
            user: user.rows[0]
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function logoutMe(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function deleteMe(req, res) {
    try {
        await pool.query(
            `DELETE FROM user_accs
            WHERE id = $1`,
            [req.user.id]
        );
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get logged in user
        const existingUser = await pool.query(
            `SELECT *
            FROM user_accs
            WHERE id = $1`,
            [req.user.id]
        );
        const user = existingUser.rows[0];

        // Compare current password
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Update database
        await pool.query(
            `UPDATE user_accs
            SET password = $1
            WHERE id = $2`,
            [hashedPassword, req.user.id]
        );
        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function changeAvatar(req, res) {
    try {
        const { profile_pic } = req.body;
        await pool.query(
            `UPDATE user_accs
            SET profile_pic = $1
            WHERE id = $2`,
            [profile_pic, req.user.id]
        );
        return res.status(200).json({
            success: true,
            message: "Avatar Updated Successfully."
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

async function checkAuth(req, res) {
    try {
        return res.status(200).json({
            success: true,
            message: "User authenticated."
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export default {
    registerMe,
    loginMe,
    findMeLite,
    findMe,
    logoutMe,
    deleteMe,
    changePassword,
    changeAvatar,
    checkAuth
}
import express from "express";
import dotenv from "dotenv";

import Song from "./models/song.js"
import { connectDB } from "./db/conn.js";
import songRoutes from "./routes/song.js";
import userRoutes from "./routes/users.js"

import User from "./models/users.js";
import RevokedToken from "./models/revokedTokens.js";

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'https://code.jquery.com'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            fontSrc: ["'self'", "data:"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(express.json());

const globalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000
});

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000
});

const strictLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000
});

app.use(globalLimiter);

app.use("/songs", strictLimiter, songRoutes);
app.use("/", userRoutes);

import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend-react/build')));

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    try {
        const revoked = await RevokedToken.exists({ token });
        if(revoked) {
            return res.status(401).json({ success: false, message: 'Token revoked'});
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ success: false, message: 'Invalid token'});
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Authentication failed'});
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required'});
    }
    next();
};

app.post('/logout', async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.decode(token);
            if (decoded && decoded.exp) {
                await RevokedToken.create({
                    token,
                    expiresAt: new Date(decoded.exp * 1000)
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ success: false, message: 'Logout failed'});
        }
    } else {
        return res.status(404).json({ success: false, message: 'No token provided'});
    }

    res.json({ success: true, message: 'Logged out successfully' })
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

app.get('/admin', authenticateToken, adminOnly, (req, res) => {
    res.json({ success: true, message: 'Welcome to admin panel'});
});

app.get("/check", (req, res) => {
    res.send("Server is on...")
})

app.get("/songs", async (req, res) => {
    const {id} = req.params;

    try {
        const songs = await Song.find({});
        res.status(200).json( {success: true, data: songs} );
    } catch(error) {
        console.log(error);
        res.status(500).json( {success: false, message: "Server error"});
    }
})

app.get("/songs/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const song = await Song.findById(id);
        res.status(200).json( {success: true, data: song} );
    } catch(error) {
        console.log(error);
        res.status(500).json( {success: false, message: "Server error"});
    }
})

app.post("/songs", async (req, res) => {
    const { title, author, length, cover } = req.body;

    if (!title || !author) {
        return res.status(400).json({ success: false, message: "Required fields missing..." });
    }

    const newSong = new Song({ title, author, length, cover });

    try {
        await newSong.save();
        res.status(201).json({ success: true, data: newSong });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error while creating new song" });
    }
});

app.put("/songs/:id", async (req, res) => {
    const {id} = req.params;
    const song = req.body;

    if(!song.title || !song.author) {
        return res.status(400).json( {success: false, message: "Required fields missing..."});
    }

    try {
        const updatedSong = await Song.findByIdAndUpdate(id, song);
        res.status(200).json( {success: true, data: updatedSong} );
    } catch(error) {
        console.log(error);
        res.status(500).json( {success: false, message: "Error while creating new song"});
    }
})

app.delete("/songs/:id", async (req, res) => {
    const {id} = req.params;

    try {
        await Song.findByIdAndDelete(id);
        res.status(200).json( {success: true, message: "Song deleted"} );
    } catch(error) {
        console.log(error);
        res.status(404).json( {success: false, message: "Song not found"} );
    }
})

app.listen(5000, () => {
    connectDB();
    console.log('Server listening on port 5000');
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-react/build/index.html'));
})
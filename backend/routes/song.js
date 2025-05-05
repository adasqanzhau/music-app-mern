import express from "express";

import Song from "../models/song.js";

import { authenticateToken, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const {id} = req.params;

    try {
        const songs = await Song.find({});
        res.status(200).json( {success: true, data: songs} );
    } catch (error) {
        console.log(error);
        res.status(500).json( {success: false, message: "Server error"} );
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.q || '';
    const regex = new RegExp(query, 'i');

    try {
        const songs = await Song.find({ title: regex });
        res.status(200).json({ success: true, data: songs });
    } catch {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error searching songs' })
    }
}); 

router.get("/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const song = await Song.findById(id);
        res.status(200).json({ success: true, data: song });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/", authenticateToken, adminOnly, async (req, res) => {
    const song = req.body;

    if (!song.title || !song.author) {
        return res.status(400).json({ success: false, message: "Required fields missing" });
    }    

    const newSong = new Song(song);

    try {
        await newSong.save();
        res.status(201).json({ success: true, data: newSong });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error while creating new song" });
    }
});

router.put("/:id", authenticateToken, adminOnly, async (req, res) => {
    const { id } = req.params;
    const song = req.body;

    if (!song.title || !song.author) {
        return res.status(400).json({ success: false, message: "Required fields missing" });
    }    

    try {
        const updatedSong = await Song.findByIdAndUpdate(id, song);
        res.status(200).json({ success: true, data: updatedSong });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error while updating song" });
    }
});

router.delete("/:id", authenticateToken, adminOnly, async (req, res) => {
    const { id } = req.params;

    try {
        await Song.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Song deleted" });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false, message: "Song not found" });
    }
});

export default router;

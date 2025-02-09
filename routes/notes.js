const router = require('express').Router();
const { isLength } = require('validator');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//get all notes (login required)
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.status(200).send(notes);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

//add a note (login required)
router.post("/addnote", fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            user: req.user.id
        })
        const savedNote = await note.save();
        res.status(200).send(savedNote);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Update a note (login required)
router.put("/updatenote/:id", fetchuser, [
    body('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('description').optional().isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body;
        const newNote = {};

        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // Find the note by ID
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // Check if the logged-in user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // Update the note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.status(200).json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//delete a note (login required)
router.delete("/deletenote/:id", fetchuser, async (req, res) => {    
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }    
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.status(200).send("Note deleted successfully");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router
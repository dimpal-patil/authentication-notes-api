const Note = require("../models/note-models");

const createNote = async (req, res) => {
    try {
        const note = await Note.create({
            title: req.body.title,
            content: req.body.content,
            user: req.user._id
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user._id
        });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateNote = async (req, res) => {
    try {
        // Find the note first
        const note = await Note.findById(req.params.id);

        // Check if note exists
        if (!note) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        // Check if the logged-in user owns the note
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "User is not authorized to update this note."
            });
        }

        // User owns the note, so update it
        note.title = req.body.title;
        note.content = req.body.content;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        // Find the note first
        const note = await Note.findById(req.params.id);

        // Check if note exists
        if (!note) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        // Check if logged-in user owns the note
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "User is not authorized to delete this note."
            });
        }

        // Delete the note
        await Note.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Note deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getNote = async (req, res) => {
    try {
        // Find the note by ID
        const note = await Note.findById(req.params.id);

        // Check if note exists
        if (!note) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        // Check if logged-in user owns the note
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "User is not authorized to view this note."
            });
        }

        // Return the note
        res.status(200).json(note);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
};
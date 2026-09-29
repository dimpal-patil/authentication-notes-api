const express = require("express");
const router = express.Router();

const noteController = require('../controllers/note-controller')
const verifyAuthentication = require("../middleware/verifyAuthentication");

router.post("/", verifyAuthentication , noteController.createNote);
router.get("/", verifyAuthentication, noteController.getNotes);
router.get("/:id", verifyAuthentication, noteController.getNote);
router.put("/:id", verifyAuthentication, noteController.updateNote);
router.delete("/:id", verifyAuthentication, noteController.deleteNote);

module.exports = router;
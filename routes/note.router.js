const express = require("express");
const noteModel = require("../models/node.model");
const auth = require("../middleware/auth.middleware");
const noteRouter = express.Router();

// Auth middleware for private Routes
noteRouter.use(auth);

// Read
noteRouter.get("/", async (req, res) => {
  try {
    const notes = await noteModel.find({ userID: req.body.userID });
    res.send(notes);
  } catch (err) {
    res.json({ error: err });
  }
});

// Create
noteRouter.post("/create", async (req, res) => {
  try {
    const note = new noteModel(req.body);
    await note.save();
    res.json({ msg: "new note has been added", note: req.body });
  } catch (err) {
    res.json({ error: err });
  }
});

// Update
noteRouter.patch("/update/:noteID", async (req, res) => {
  const userIDinUserDoc = req.body.userID;
  const { noteID } = req.params;
  try {
    const note = await noteModel.findOne({ _id: noteID });
    const userIDinNoteDoc = note.userID;
    // console.log(userIDinNoteDoc, userIDinUserDoc);
    if (userIDinUserDoc === userIDinNoteDoc) {
      await noteModel.findByIdAndUpdate({ _id: noteID }, req.body);
      res.json({ msg: `${note.title} has been updated.` });
    } else {
      res.json({ msg: "Not Authrized.!" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

// Delete
noteRouter.delete("/delete/:noteID", async (req, res) => {
  const userIDinUserDoc = req.body.userID;
  const { noteID } = req.params;
  try {
    const note = await noteModel.findOne({ _id: noteID });
    const userIDinNoteDoc = note.userID;
    // console.log(userIDinNoteDoc, userIDinUserDoc);
    if (userIDinUserDoc === userIDinNoteDoc) {
      await noteModel.findByIdAndDelete({ _id: noteID });
      res.json({ msg: `${note.title} has been deleted.` });
    } else {
      res.json({ msg: "Not Authrized.!" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = noteRouter;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT;

// Update this line to use the environment variable
const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB', err));

const noteSchema = new mongoose.Schema({
    content: String,
    timestamp: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

app.use(cors());
app.use(express.json());

// Schedule the deletion of notes at 01:18 AM GMT every day
cron.schedule('0 0 * * *', () => {
    Note.deleteMany({})
        .then(() => console.log('All notes deleted successfully at 01:18 AM GMT'))
        .catch((err) => console.error('Error deleting notes:', err));
});

// Endpoint to get all notes
app.get('/notes', async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

// Endpoint to add a new note
app.post('/notes', async (req, res) => {
    const newNote = new Note({
        content: req.body.content,
    });

    await newNote.save();
    res.status(201).json(newNote);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


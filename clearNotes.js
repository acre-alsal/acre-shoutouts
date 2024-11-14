const mongoose = require('mongoose');
require('dotenv').config();

const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas for clearing notes');
    clearNotes();
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

async function clearNotes() {
    try {
        const Note = mongoose.model('Note', new mongoose.Schema({ content: String, timestamp: Date }));
        await Note.deleteMany({}); // Deletes all notes
        console.log('All notes have been cleared');
        process.exit(0); // Exit the script
    } catch (error) {
        console.error('Error while clearing notes:', error);
        process.exit(1);
    }
}

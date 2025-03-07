const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-reminder')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dateTime: { type: Date, required: true },
  location: String,
  reminder: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    console.log('Creating new event:', req.body);
    const event = new Event(req.body);
    const savedEvent = await event.save();
    console.log('Event created successfully:', savedEvent._id);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ 
      message: 'Error creating event', 
      error: error.message 
    });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    console.log('Attempting to delete event with ID:', req.params.id);
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      console.log('Event not found:', req.params.id);
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('Event deleted successfully:', req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      message: 'Error deleting event', 
      error: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 
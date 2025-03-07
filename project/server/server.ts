import express from 'express';
import cors from 'cors';
import './db/mongoose';
import { Event } from './models/event.model';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
});

// Create event
app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error });
  }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error updating event', error });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 
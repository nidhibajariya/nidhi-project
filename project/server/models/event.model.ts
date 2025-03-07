import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  dateTime: {
    type: Date,
    required: true
  },
  location: String,
  reminder: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Event = mongoose.model('Event', eventSchema); 
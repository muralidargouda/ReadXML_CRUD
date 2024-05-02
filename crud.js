const express = require('express');
const mongoose = require('mongoose');
// const { parseString } = require('xml2js');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Schema for MongoDB documents
const contactSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  phone: String
});

// Model for the MongoDB collection
const Contact = mongoose.model('Contact', contactSchema);

// Middleware to parse the JSON
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/contactsdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Creating a new contact
app.post('/contacts', async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// To get all contacts
app.get('/contacts', async (req, res) => {
  try {
    const allContacts = await Contact.find({});
    res.json(allContacts);
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Updating a contact by ID
app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Deleting a contact by ID
app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Contact.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server starts
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

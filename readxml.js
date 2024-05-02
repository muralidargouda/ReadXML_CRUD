const express = require('express');
const mongoose = require('mongoose');
const { parseString } = require('xml2js');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Schema for your MongoDB documents
const contactSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  phone: String
});

// Model for the MongoDB collection
const Contact = mongoose.model('Contact', contactSchema);

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/contactsdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Reading the XML file
    const xmlData = fs.readFileSync('contacts.xml', 'utf-8');
    // Parsing XML to JSON
    parseString(xmlData, async (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return;
      }

      try {
        // Mapping XML data to array of Contact documents
        const contacts = result.contacts.contact.map(contact => ({
          name: contact.name[0],
          lastName: contact.lastName[0],
          phone: contact.phone[0]
        }));

        // Inserting Contact documents into MongoDB using Mongoose
        const insertedContacts = await Contact.insertMany(contacts);
        console.log(`${insertedContacts.length} documents inserted`);
      } catch (error) {
        console.error('Error inserting contacts into MongoDB:', error);
      }
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Server starts
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

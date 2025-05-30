const Contact = require('../models/Contact');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Check if all fields are provided
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }
    
    // Create contact
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private/Admin
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single contact
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: `No contact found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact status
// @route   PATCH /api/contact/:id
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid status (unread, read, replied)' 
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: `No contact found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: `No contact found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
}; 
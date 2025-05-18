const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  primaryColor: { type: String, required: true }, // e.g., "#FF5733"
  secondaryColor: { type: String, required: true }, // e.g., "#C70039"
  sidebarHeaderColor: { type: String, required: true }, // e.g., "#1C2937"
  sidebarBodyColor: { type: String, required: true }, // e.g., "#34495E"
  sidebarTitle: { type: String, required: true, maxlength: 10 }, // e.g., "Admin"
  sidebarTitleBD: { type: String, required: true }, // e.g., "Admin BD"
  favicon: { type: String }, // URL of favicon image
  websiteTitle: { type: String, required: true }, // e.g., "My Website"
  websiteLogoWhite: { type: String }, // URL of white logo image
  websiteLogoDark: { type: String }, // URL of dark logo image
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` timestamp on save
ThemeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const ThemeModel = mongoose.model('Theme', ThemeSchema);

// Initialize single theme document if none exists
const initializeDefaultTheme = async () => {
  try {
    const count = await ThemeModel.countDocuments();
    if (count === 0) {
      await ThemeModel.create({
        primaryColor: '#FF5733',
        secondaryColor: '#C70039',
        sidebarHeaderColor: '#1C2937',
        sidebarBodyColor: '#34495E',
        sidebarTitle: 'Admin',
        sidebarTitleBD: 'অ্যাডমিন বিডি',
        websiteTitle: 'My Website',
        favicon: '',
        websiteLogoWhite: '',
        websiteLogoDark: '',
      });
      console.log('Default theme initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing default theme:', error);
  }
};

// Call initialization
initializeDefaultTheme();

module.exports = ThemeModel;
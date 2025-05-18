const mongoose = require('mongoose');

const homeCarouselSchema = new mongoose.Schema({
    images: {
        type: [{
            mobile: { type: String, required: true },
            desktop: { type: String, required: true }
        }]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    interval: {
        type: Number,
        default: 2500,
        min: [1000, 'Interval must be at least 1000ms']
    },
    infiniteLoop: {
        type: Boolean,
        default: true
    },
    autoPlay: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const HomeCarousel = mongoose.model('HomeCarousel', homeCarouselSchema);

module.exports = HomeCarousel;
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    primaryCategory: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    seoTags: {
        type: [String],
        default: []
    },
    sustainabilityFilters: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema);

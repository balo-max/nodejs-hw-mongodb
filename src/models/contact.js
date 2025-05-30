import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        default: 'personal',
        required: true,
    },
}, {
    timestamps: true,
});

export const Contact = mongoose.model("Contact", contactSchema);
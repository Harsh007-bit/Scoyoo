import mongoose from 'mongoose'

const { Schema } = mongoose

const BookingSchema = new Schema({
    user: {
        email: String
    },
    room: String,
    checkIn: Date,
    checkOut: Date,
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
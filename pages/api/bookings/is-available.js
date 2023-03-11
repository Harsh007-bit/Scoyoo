import connect from "@/db";
import { Booking } from "@/models/Booking";

export default async function handler(req, res) {
    await connect();
    if (req.method === "GET") {
        const { room, checkIn, checkOut } = req.query
        const bookings = await Booking.find({
            room: room, checkIn: {
                $lte: checkOut
            }, checkOut: {
                $gte: checkIn
            }
        })
        res.status(200);
        res.json(bookings.length === 0)
    } else {
        res.status(500)
        res.send("Sorry we don't accept POST requests.");
    }
}
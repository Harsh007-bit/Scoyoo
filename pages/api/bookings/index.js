import connect from "@/db"
import { Booking } from "@/models/Booking"

export default async function handler(req, res) {
    await connect();
    if (req.method === "POST") {
        const data = req.body
        const booking = await Booking.create(JSON.parse(data))
        res.status(200);
        res.json(booking);
        return;

    } else if (req.method === "DELETE") {

        const { id } = req.query;
        const booking = await Booking.deleteOne(id)
        res.status(200).json(booking.acknowledged);
        return;

    } else if (req.method === "PUT") {

        const data = req.body
        const { id: _id } = req.query
        const booking = await Booking.updateOne({ _id }, JSON.parse(data));
        res.status(200);
        res.json(booking.acknowledged);
        return;

    }

    const { passed, checkIn, checkOut, room, roomType } = req.query;

    const filters = { $and: [] }
    if (passed)
        filters["$and"].push({
            checkOut: {
                $lte: new Date()
            }
        })
    if (checkIn)
        filters["$and"].push({
            checkIn: {
                $gte: checkIn
            }
        })
    if (checkOut)
        filters["$and"].push({
            checkOut: {
                $lte: checkOut
            }
        })
    if (room)
        filters["$and"].push({ room })

    if (roomType)
        filters["$and"].push({ room: new RegExp(roomType + ".*") })

    if (Object.keys(req.query).length === 0)
        delete filters["$and"]

    const bookings = await Booking.find(filters)
    res.json(bookings)
}
export const getPrice = (data) => {
    if (!data.room || !data.checkIn || !data.checkOut) return 0
    const [roomType] = data?.room.split("")
    const hours = (new Date(data?.checkOut).getTime() - new Date(data?.checkIn).getTime()) / 1000 / 60 / 60
    switch (roomType) {
        case "A":
            return Math.floor(hours * 100)
        case "B":
            return Math.floor(hours * 80)
        case "C":
            return Math.floor(hours * 50)
        default:
            return 0
    }
}
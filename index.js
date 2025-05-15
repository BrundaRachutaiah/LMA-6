const express = require("express")
const app = express()
app.use(express.json())

let travelPackages = [
  { packageId: 1, destination: "Paris", price: 1500, duration: 7, availableSlots: 10 },
  { packageId: 2, destination: "Rome", price: 1200, duration: 5, availableSlots: 15 },
  { packageId: 3, destination: "Tokyo", price: 2000, duration: 10, availableSlots: 8 },
  { packageId: 4, destination: "New York", price: 1700, duration: 7, availableSlots: 12 },
  { packageId: 5, destination: "Dubai", price: 1100, duration: 4, availableSlots: 20 },
  { packageId: 6, destination: "Sydney", price: 2500, duration: 12, availableSlots: 5 },
  { packageId: 7, destination: "Cape Town", price: 1800, duration: 8, availableSlots: 6 },
  { packageId: 8, destination: "Bangkok", price: 800, duration: 3, availableSlots: 25 },
  { packageId: 9, destination: "Barcelona", price: 1400, duration: 6, availableSlots: 10 },
  { packageId: 10, destination: "Bali", price: 1300, duration: 5, availableSlots: 15 },
  { packageId: 11, destination: "Istanbul", price: 1000, duration: 4, availableSlots: 18 },
  { packageId: 12, destination: "London", price: 1900, duration: 9, availableSlots: 7 },
  { packageId: 13, destination: "Hawaii", price: 2200, duration: 10, availableSlots: 8 },
  { packageId: 14, destination: "Moscow", price: 1600, duration: 8, availableSlots: 10 },
  { packageId: 15, destination: "Athens", price: 1200, duration: 6, availableSlots: 12 },
];

let bookings = [
  { bookingId: 1, packageId: 1, customerName: "Anjali Seth", bookingDate: "2024-12-01", seats: 2 },
  { bookingId: 2, packageId: 5, customerName: "Rahul", bookingDate: "2024-11-20", seats: 3 },
  { bookingId: 3, packageId: 8, customerName: "Kiran Wankhade", bookingDate: "2024-10-15", seats: 1 },
  { bookingId: 4, packageId: 3, customerName: "Robert", bookingDate: "2024-09-10", seats: 4 },
  { bookingId: 5, packageId: 12, customerName: "Aryan Khan", bookingDate: "2024-08-25", seats: 2 },
];

function getAllPakages(){
    return travelPackages
}

app.get("/packages", async (req,res) => {
    try {
        let packages = await getAllPakages()
        if(packages.length === 0){
            res.status(400).json({error: "No packages found."})
        }
        res.json({packages})
    } catch (error) {
        res.status(500).json({error: "Internal server errro."})
    }
})

function getPackagesByDestination(destination){
    return travelPackages.find((ele) => ele.destination === destination)
}

app.get("/packages/:destination", async (req,res) => {
    try {
        let destination = req.params.destination
        let packages = await getPackagesByDestination(destination)
        if(!packages){
            res.status(400).json({error: "packages not found."})
        }
        res.json({package: packages })
    } catch (error) {
        res.status(500).json({error: "Internal server errro."})
    }
})

function addNewBooking(booking){
    let newBooking = {bookingId: bookings.length + 1, ...booking}
    bookings.push(newBooking)
    return {booking: newBooking}
}

app.post("/booking", async (req,res) => {
    try {
        let addedBooking = await addNewBooking(req.body)
        res.status(201).json(addedBooking)
    } catch (error) {
        res.status(500).json({error: "Internal server errro."})
    }
})

function updatePackageSlots(data){
    let packagesToUpdate = travelPackages.find((ele) => ele.packageId === data.packageId)
    if(packagesToUpdate){
        packagesToUpdate.availableSlots = packagesToUpdate.availableSlots - data.seatsBooked
        return packagesToUpdate
    }
    return {error: "Package not found"}
}

app.post("/packages/update-seats", async (req,res) => {
    try {
        let updateData = req.body
        let updatedData = await updatePackageSlots(updateData)
        res.status(201).json({package: updatedData})
    } catch (error) {
        res.status(500).json({error: "Internal server errro."})
    }
})

function getAllBookingsByPackage(packageId){
    return bookings.find((ele) => ele.packageId === packageId)
}

app.get("/bookings/:packageId", async (req,res) => {
    try {
        let packageId = parseInt(req.params.packageId)
        let bookings = await getAllBookingsByPackage(packageId)
        if(!bookings){
            res.status(400).json({error: "No bookings found of this package."})
        }
        res.json({bookings})
    } catch (error) {
        res.status(500).json({error: "Internal server errro."})
    }
})

module.exports = { app, getAllPakages, getPackagesByDestination, addNewBooking, updatePackageSlots, getAllBookingsByPackage }

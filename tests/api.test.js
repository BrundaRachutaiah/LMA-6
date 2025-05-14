const { app, getAllPakages, getPackagesByDestination, addNewBooking, updatePackageSlots, getAllBookingsByPackage } = require("../index.js")

const request = require("supertest")
const http = require("http")

jest.mock("../index.js", () => ({
    ...jest.requireActual("../index.js"),
    getAllPakages: jest.fn(), 
    getPackagesByDestination: jest.fn(), 
    addNewBooking: jest.fn(), 
    updatePackageSlots: jest.fn(), 
    getAllBookingsByPackage: jest.fn()
}))

let server

beforeAll((done) => {
    server = http.createServer(app)
    server.listen(3001, done)
})

afterAll((done) => {
    server.close(done)
})

describe("API testing", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it("GET API /packages should return all the packages", async () => {
        let res = await request(server).get("/packages")
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            packages: [
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
                { packageId: 15, destination: "Athens", price: 1200, duration: 6, availableSlots: 12 }
            ]
        })
    }),
    it("GET /packages/:destination should return a perticular destination packages", async () => {
        let res = await request(server).get("/packages/Paris")
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            package: { packageId: 1, destination: "Paris", price: 1500, duration: 7, availableSlots: 10 }
        })
    }),
    it("POST /booking should add a new bookings", async () => {
        let res = await request(server).post("/booking").send({"packageId": 4, "customerName": "Raj Kulkarni", "bookingDate": "2024-12-20", "seats": 2}) 
        expect(res.status).toEqual(201)
        expect(res.body).toEqual({
            booking: { bookingId: 6, packageId: 4, customerName: "Raj Kulkarni", bookingDate: "2024-12-20", seats: 2 }
        })
    }),
    it("POST /packages/update-seats should update the package", async () => {
        let res = await request(server).post("/packages/update-seats").send({"packageId":1, "seatsBooked": 2})
        expect(res.status).toEqual(201)
        expect(res.body).toEqual({
            package: {
                packageId: 1,
                destination: "Paris",
                price: 1500,
                duration: 7,
                availableSlots: 8
            }
        })
    }),
    it("GET /bookings/:packageId should retrive a perticular booking", async () => {
        let res = await request(server).get("/bookings/1")
        expect(res.status).toEqual(200)
        expect(res.body).toEqual({
            bookings: {
                bookingId: 1,
                packageId: 1,
                customerName: "Anjali Seth",
                bookingDate: "2024-12-01",
                seats: 2
            }
        })
    })
})
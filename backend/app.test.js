const request = require("supertest");
const app = require("./app");

describe("Backend API Tests", () => {

    test("GET / should return 200", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("DevOps Dashboard Backend Running");
    });

    test("GET /deployments should return JSON", async () => {
        const response = await request(app).get("/deployments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty("status");
    });

});
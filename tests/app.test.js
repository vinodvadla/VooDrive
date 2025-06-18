const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../src/models");
describe("API Tests", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("GET /hello → should return Hello World", async () => {
    const res = await request(app).get("/hello");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Hello World" });
  });
});

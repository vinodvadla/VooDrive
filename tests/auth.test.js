// tests/auth.test.js
const request = require("supertest");
const app = require("../index"); // adjust if your app is exported elsewhere
const { sequelize } = require("../src/models");

let cookies;

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Authentication API", () => {
  const userPayload = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
    phone: "+911234567890",
  };

  // ----------- REGISTER TESTS ---------------- //
  test("POST /v1/auth/register → should register user", async () => {
    const res = await request(app).post("/v1/auth/register").send(userPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("POST /v1/auth/register → fail with missing fields", async () => {
    const res = await request(app).post("/v1/auth/register").send({
      email: "",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/all fields are required/i);
  });

  test("POST /v1/auth/register → fail with invalid email", async () => {
    const res = await request(app).post("/v1/auth/register").send({
      ...userPayload,
      email: "invalid-email",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  test("POST /v1/auth/register → fail with invalid phone", async () => {
    const res = await request(app).post("/v1/auth/register").send({
      ...userPayload,
      phone: "123",
      email: "unique1@example.com",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid phone/i);
  });

  test("POST /v1/auth/register → fail with short password", async () => {
    const res = await request(app).post("/v1/auth/register").send({
      ...userPayload,
      password: "short",
      email: "unique2@example.com",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/at least 8 characters/i);
  });

  test("POST /v1/auth/register → fail if user already exists", async () => {
    const res = await request(app).post("/v1/auth/register").send(userPayload);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  // ----------- LOGIN TESTS ---------------- //
  test("POST /v1/auth/login → should login user", async () => {
    const res = await request(app).post("/v1/auth/login").send({
      email: userPayload.email,
      password: userPayload.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
  });

  test("POST /v1/auth/login → fail if email is missing", async () => {
    const res = await request(app).post("/v1/auth/login").send({
      password: userPayload.password,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email and password are required/i);
  });

  test("POST /v1/auth/login → fail with invalid password", async () => {
    const res = await request(app).post("/v1/auth/login").send({
      email: userPayload.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  // ----------- /me (Get User) ---------------- //
  test("GET /v1/auth/me → return user info with valid token", async () => {
    const res = await request(app).get("/v1/auth/me").set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/retrieved/i);
    expect(res.body.data.email).toBe(userPayload.email);
  });

  test("GET /v1/auth/me → fail without token", async () => {
    const res = await request(app).get("/v1/auth/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/access token is required/i);
  });

  // ----------- LOGOUT ---------------- //
  test("POST /v1/auth/logout → should logout user", async () => {
    const res = await request(app)
      .post("/v1/auth/logout")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logout successful");
  });

  test("POST /v1/auth/logout → fail without token", async () => {
    const res = await request(app).post("/v1/auth/logout");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/access token is required/i);
  });

  // ----------- FORGOT PASSWORD ---------------- //
  test("POST /v1/auth/forgot-password → should respond even for non-existent email", async () => {
    const res = await request(app)
      .post("/v1/auth/forgot-password")
      .send({ email: "test@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/password reset email/i);
  });

  test("POST /v1/auth/forgot-password → fail without email", async () => {
    const res = await request(app).post("/v1/auth/forgot-password").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email is required/i);
  });

  // ----------- RESET PASSWORD ---------------- //
  test("POST /v1/auth/reset-password → fail if token/newPassword missing", async () => {
    const res = await request(app).post("/v1/auth/reset-password").send({
      token: "",
      newPassword: "",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/token and new password/i);
  });

  test("POST /v1/auth/reset-password → fail with short password", async () => {
    const res = await request(app).post("/v1/auth/reset-password").send({
      token: "faketoken",
      newPassword: "123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/at least 8 characters/i);
  });

  // ----------- REFRESH TOKEN ---------------- //
  test("POST /v1/auth/refresh → should refresh token", async () => {
    const loginRes = await request(app).post("/v1/auth/login").send({
      email: userPayload.email,
      password: userPayload.password,
    });

    const refreshCookies = loginRes.headers["set-cookie"];

    const res = await request(app)
      .post("/v1/auth/refresh")
      .set("Cookie", refreshCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Token refreshed successfully");
  });

  test("POST /v1/auth/refresh → fail without cookie", async () => {
    const res = await request(app).post("/v1/auth/refresh");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/refresh token is required/i);
  });

  test("POST /v1/auth/refresh → fail with invalid token", async () => {
    const res = await request(app)
      .post("/v1/auth/refresh")
      .set("Cookie", "refreshToken=invalidtoken");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid refresh token/i);
  });
});

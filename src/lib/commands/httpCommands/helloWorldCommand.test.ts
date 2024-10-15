import request from "supertest";
import { app } from "../../../index";
import { CommandTypes } from "@apiTypes/commandTypes";

describe("HelloWorldCommand test suite", () => {
  const url = CommandTypes.HTTP.helloWorld;
  it("should respond with 200 status code to POST /", async () => {
    const response = await request(app).post(url);
    expect(response.status).toBe(200);
  });

  it("should return the correct response structure", async () => {
    const response = await request(app).post(url);
    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("message");
  });

  it("should return 'Hello, World!' message", async () => {
    const response = await request(app).post(url);
    expect(response.body.message).toBe("Hello, World!");
  });

  it("should return success: true", async () => {
    const response = await request(app).post(url);
    expect(response.body.success).toBe(true);
  });

  it("should return an empty data object", async () => {
    const response = await request(app).post(url);
    expect(response.body.data).toEqual({});
  });

  it("should handle empty request body", async () => {
    const response = await request(app).post(url).send({});
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should ignore additional request body data", async () => {
    const response = await request(app)
      .post(url)
      .send({ extraData: "should be ignored" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({});
  });

  it("should set the correct content type", async () => {
    const response = await request(app).post(url);
    expect(response.headers["content-type"]).toMatch(/json/);
  });
});

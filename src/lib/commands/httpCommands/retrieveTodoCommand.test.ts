import request from "supertest";
import { app } from "../../../index";
import { CommandTypes } from "@apiTypes/commandTypes";
import { TodoFetcher } from "@adapters/TodoFetcher";

jest.mock("@adapters/TodoFetcher");

describe("RetriveTodoCommand test suite", () => {
  const url = CommandTypes.HTTP.retrieveTodo;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should respond with 200 status code to POST /retrieveTodo", async () => {
    const response = await request(app).post(url).send({ id: 1 });
    expect(response.status).toBe(200);
  });

  it("should return the correct response structure", async () => {
    const response = await request(app).post(url).send({ id: 1 });
    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("message");
  });

  it("should return a todo object when given a valid id", async () => {
    const mockTodo = {
      userId: 1,
      id: 1,
      title: "Test Todo",
      completed: false,
    };
    (TodoFetcher.prototype.fetchTodo as jest.Mock).mockResolvedValue(mockTodo);

    const response = await request(app).post(url).send({ id: 1 });
    expect(response.body.success).toBe(true);
    expect(response.body.data.todo).toEqual(mockTodo);
    expect(response.body.message).toBe("Todo retrieved.");
  });

  it("should return an error when given an invalid id", async () => {
    (TodoFetcher.prototype.fetchTodo as jest.Mock).mockRejectedValue(
      new Error("Error fetching todo")
    );

    const response = await request(app).post(url).send({ id: 999 });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "There was an error fetching the todo. Please try again."
    );
  });

  it("should return a validation error when id is missing", async () => {
    const response = await request(app).post(url).send({});
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Input validation error.");
  });

  it("should return a validation error when id is not numeric", async () => {
    const response = await request(app).post(url).send({ id: "abc" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Input validation error.");
  });

  it("should set the correct content type", async () => {
    const response = await request(app).post(url).send({ id: 1 });
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should handle errors from TodoFetcher", async () => {
    (TodoFetcher.prototype.fetchTodo as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    const response = await request(app).post(url).send({ id: 1 });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Error occurred, please reach out to support."
    );
  });

  it("should ignore additional request body data", async () => {
    const mockTodo = {
      userId: 1,
      id: 1,
      title: "Test Todo",
      completed: false,
    };
    (TodoFetcher.prototype.fetchTodo as jest.Mock).mockResolvedValue(mockTodo);

    const response = await request(app)
      .post(url)
      .send({ id: 1, extraData: "should be ignored" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.todo).toEqual(mockTodo);
  });
});

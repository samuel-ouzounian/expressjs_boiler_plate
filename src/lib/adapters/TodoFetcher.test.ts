import { TodoFetcher } from "./TodoFetcher";
import { Todo } from "@apiTypes/types";

describe("TodoFetcher", () => {
  let todoFetcher: TodoFetcher;
  const mockApiUrl = "https://api.example.com";

  beforeEach(() => {
    todoFetcher = new TodoFetcher(mockApiUrl);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create an instance with the correct API URL", () => {
    expect(todoFetcher["apiUrl"]).toBe(mockApiUrl);
  });

  describe("fetchTodo", () => {
    it("should fetch a todo successfully", async () => {
      const mockTodo = {
        userId: 1,
        id: 1,
        title: "Test Todo",
        completed: false,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTodo),
      });

      const result = await todoFetcher.fetchTodo(1);

      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/todos/1`);
      expect(result).toEqual(mockTodo);
    });

    it("should throw an error when the API response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(todoFetcher.fetchTodo(1)).rejects.toThrow(
        "Error fetching todo: 1"
      );
    });

    it("should throw an error when the fetch fails", async () => {
      const mockError = new Error("Network error");
      (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(todoFetcher.fetchTodo(1)).rejects.toThrow(mockError);
    });
  });

  describe("mapToTodo", () => {
    it("should map API data to Todo object correctly", () => {
      const mockData = {
        userId: 1,
        id: 1,
        title: "Test Todo",
        completed: false,
        extraField: "This should be ignored",
      };

      const result = todoFetcher["mapToTodo"](mockData);

      const expectedTodo: Todo = {
        userId: 1,
        id: 1,
        title: "Test Todo",
        completed: false,
      };

      expect(result).toEqual(expectedTodo);
    });

    it("should handle missing fields in API data", () => {
      const mockData = {
        userId: 1,
        id: 1,
      };

      const result = todoFetcher["mapToTodo"](mockData);

      const expectedTodo: any = {
        userId: 1,
        id: 1,
        title: undefined,
        completed: undefined,
      };

      expect(result).toEqual(expectedTodo);
    });
  });
});

import { Todo } from "@apiTypes/types";
import { ITodoFetcher } from "./ITodoFetcher";

export class TodoFetcher implements ITodoFetcher {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async fetchTodo(id: number): Promise<Todo> {
    try {
      const response = await fetch(`${this.apiUrl}/todos/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching todo: ${id}`);
      }
      const data = await response.json();
      return this.mapToTodo(data);
    } catch (error) {
      throw error;
    }
  }

  private mapToTodo(data: any): Todo {
    return {
      userId: data.userId,
      id: data.id,
      title: data.title,
      completed: data.completed,
    };
  }
}

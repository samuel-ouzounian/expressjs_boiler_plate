import { Todo } from "@apiTypes/types";

export interface ITodoFetcher {
  fetchTodo(id: number): Promise<Todo>;
}

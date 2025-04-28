
export interface Task {
  id: string;
  subject: string;
  name: string;
  dueDate: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

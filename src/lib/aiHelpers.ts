
import { ChatMessage } from "./types";

// Simple implementation for AI responses
export async function getAIResponse(userMessage: string): Promise<string> {
  // This is a placeholder function that simulates AI responses
  // In a real app, you would integrate with an actual AI service
  
  const lowercasedMessage = userMessage.toLowerCase();
  
  // Simple response logic based on keywords
  if (lowercasedMessage.includes("hello") || lowercasedMessage.includes("hi")) {
    return "Hello! How can I help with your studies today?";
  } else if (lowercasedMessage.includes("essay") || lowercasedMessage.includes("write")) {
    return "When writing an essay, start with a clear thesis statement. Then create supporting paragraphs with evidence and analysis. Make sure to conclude by restating your main points and their significance.";
  } else if (lowercasedMessage.includes("math") || lowercasedMessage.includes("solve")) {
    return "For math problems, remember to isolate the variable and perform the same operation on both sides of the equation. Take your time and double-check your work.";
  } else if (lowercasedMessage.includes("science") || lowercasedMessage.includes("project")) {
    return "Some interesting science project ideas include: testing water quality in your area, building a simple solar oven, or measuring the effect of music on plant growth.";
  } else if (lowercasedMessage.includes("translate")) {
    return "For translations, try to understand the context of the phrase rather than translating word-by-word. This will help maintain the intended meaning.";
  } else if (lowercasedMessage.includes("theme") || lowercasedMessage.includes("book")) {
    return "When analyzing themes in literature, look for recurring symbols, character development, and how conflicts are resolved. These elements often reveal the author's message.";
  } else {
    return "I'll try to help with that. Remember to break down complex problems into smaller steps and take your time understanding each concept thoroughly.";
  }
}

// Generate a unique ID for messages
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

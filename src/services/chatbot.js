import { API_URL } from "./config";

export async function sendToChatbot(message) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  return response.json();
}

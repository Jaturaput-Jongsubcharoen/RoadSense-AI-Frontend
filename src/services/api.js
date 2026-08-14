// import { API_URL } from "./config";

// export async function predictImage(file) {
//   const formData = new FormData();
//   formData.append("file", file);

//   const response = await fetch(`${API_URL}/predict`, {
//     method: "POST",
//     body: formData,
//   });

//   return response.json();
// }


import axios from "axios";
import { API_URL } from "./config";

export const api = axios.create({
  baseURL: API_URL,
});

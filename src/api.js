export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function readApiResponse(response) {
  const text = await response.text();

  if (!text.trim()) {
    throw new Error(
      "The backend returned an empty response. Make sure the backend is running and its database is configured."
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `The backend returned an invalid response (${response.status}). Check that the API server is running.`
    );
  }
}

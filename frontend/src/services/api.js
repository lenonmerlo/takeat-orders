const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = {
    "content-type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Erro de comunicação com API (${response.status})`;

    throw new ApiError(message, response.status, payload?.details ?? null);
  }

  return payload;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

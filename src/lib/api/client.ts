const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_PUBLIC_API_URL || "http://localhost:5000/api/public/v1";

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: {
          error: data.error || "An error occurred",
          details: data,
        },
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        error: "Network error",
        details: error,
      },
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

// API publique pour le catalogue (sans auth, avec rate limiting)
async function publicApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${PUBLIC_API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: {
          error: data.error || "An error occurred",
          details: data,
        },
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        error: "Network error",
        details: error,
      },
    };
  }
}

export const publicApi = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    publicApiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    publicApiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
};

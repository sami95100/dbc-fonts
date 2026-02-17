const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_PUBLIC_API_URL ||
  "http://localhost:5000/api/public/v1";

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

// Shared request function for both API clients
async function request<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${baseUrl}${endpoint}`;

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
        error: { error: data.error || "An error occurred", details: data },
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { error: "Network error", details: error },
    };
  }
}

// Build a typed HTTP client for a given base URL + optional default headers
function createClient(baseUrl: string, defaultHeaders?: HeadersInit) {
  const req = <T>(endpoint: string, options: RequestInit = {}) =>
    request<T>(baseUrl, endpoint, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

  return {
    get: <T>(endpoint: string, options?: RequestInit) =>
      req<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
      req<T>(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),

    put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
      req<T>(endpoint, {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
      req<T>(endpoint, { ...options, method: "DELETE" }),
  };
}

// API admin backoffice (sans auth specifique cote front)
export const api = createClient(API_BASE_URL);

// API publique catalogue (sans auth)
export const publicApi = createClient(PUBLIC_API_URL);

// API publique authentifiee (avec JWT Supabase)
export function publicApiWithAuth(token: string) {
  return createClient(PUBLIC_API_URL, {
    Authorization: `Bearer ${token}`,
  });
}

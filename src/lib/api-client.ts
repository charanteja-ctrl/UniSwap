/**
 * UniSwap Safe API Client
 *
 * Provides a resilient, type-safe fetch wrapper that:
 * 1. Automatically resolves the backend base URL (e.g. Render backend URL if set, or relative /api).
 * 2. Ensures appropriate JSON headers are sent.
 * 3. Safely inspects the response status and Content-Type before parsing JSON.
 * 4. Catches HTML responses (e.g. 404 HTML fallback, 502/503 cold starts) and reports clean,
 *    human-friendly errors instead of throwing "Unexpected token '<', '<!DOCTYPE '... is not valid JSON".
 */

export function getApiBaseUrl(): string {
  // Support both NEXT_PUBLIC_BACKEND_URL and NEXT_PUBLIC_API_URL
  const backendUrl =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL)) ||
    "";

  if (backendUrl && backendUrl.trim().length > 0) {
    return backendUrl.trim().replace(/\/+$/, "");
  }

  // Same-origin relative path
  return "";
}

export function getApiEndpoint(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export async function safeApiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = getApiEndpoint(path);
  const headers = new Headers(options.headers || {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (!headers.has("Content-Type") && options.method && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr: any) {
    console.error(`[API Network Error]: Failed to reach ${url}:`, networkErr);
    return {
      ok: false,
      status: 0,
      error: `Network connection error: Unable to connect to campus payment backend at ${url}. Please check your internet connection or verify the server is running.`,
    };
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  const rawText = await response.text();

  // Detect HTML response (e.g. 404 SPA fallback or 502/503 Render boot page)
  const isHtml =
    contentType.includes("text/html") ||
    rawText.trim().startsWith("<!DOCTYPE") ||
    rawText.trim().startsWith("<html") ||
    rawText.trim().startsWith("<?xml");

  if (isHtml) {
    console.warn(
      `[API Warning]: Endpoint ${path} returned HTML (${response.status}) instead of JSON:`,
      rawText.substring(0, 180)
    );

    let friendlyError = `Server returned an HTML response (${response.status}) instead of JSON.`;
    if (response.status === 404) {
      friendlyError = `Payment API endpoint "${path}" was not found (HTTP 404). Ensure the payment backend is online and the URL route is configured correctly.`;
    } else if (response.status === 502 || response.status === 503 || response.status === 504) {
      friendlyError = `Campus payment server is currently waking up or experiencing temporary downtime (HTTP ${response.status}). Please retry in a few seconds.`;
    } else if (response.status === 500) {
      friendlyError = `Campus payment server encountered an unexpected error (HTTP 500). Please check server logs.`;
    }

    return {
      ok: false,
      status: response.status,
      error: friendlyError,
    };
  }

  // Safe JSON parse
  let parsedData: any = {};
  if (rawText && rawText.trim().length > 0) {
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error(`[API Parse Error]: Failed to parse JSON from ${path}:`, rawText.substring(0, 100));
      return {
        ok: false,
        status: response.status,
        error: `Invalid response format received from ${path}. Expected JSON.`,
      };
    }
  }

  if (!response.ok) {
    const errorMsg =
      parsedData.error ||
      parsedData.message ||
      `Request failed with HTTP status ${response.status}`;

    return {
      ok: false,
      status: response.status,
      data: parsedData,
      error: errorMsg,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: parsedData,
  };
}

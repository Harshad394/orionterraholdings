export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export async function postApi<T = unknown>(url: string, payload: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error || {
          code: 'HTTP_ERROR',
          message: json.message || `Request failed with status ${res.status}`,
        },
      };
    }

    return json;
  } catch (err: unknown) {
    console.error(`API Error POST ${url}:`, err);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
      },
    };
  }
}

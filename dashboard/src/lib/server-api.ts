const configuredApiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}

export function getExternalApiBaseUrl(): string | null {
  if (!configuredApiUrl) {
    return null;
  }

  const normalized = normalizeBaseUrl(configuredApiUrl);
  if (!normalized || normalized.includes('localhost:3000')) {
    return null;
  }

  return normalized;
}

export async function fetchExternalApi<T>(path: string): Promise<T | null> {
  const baseUrl = getExternalApiBaseUrl();
  if (!baseUrl) {
    return null;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`External API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

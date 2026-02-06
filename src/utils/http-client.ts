export async function safeFetchJSON(url: string): Promise<any> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Invalid Content-Type: ${contentType}. Expected JSON.\nPreview: "${text.substring(0, 30)}..."`);
    }

    return await response.json();

  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network Error: Connection failed or blocked.');
    }
    throw error;
  }
}
const BASE_URL = 'http://localhost:8000';

async function fetchFromAPI(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  const data = await response.json();
  return data;
}

export default fetchFromAPI;
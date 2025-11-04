import type { DevmasterRequest } from "../types";

const apiToken = process.env.DEVMASTER_API_KEY!;
const apiUrl = process.env.DEVMASTER_API_URL!;

export async function getProducts(request: DevmasterRequest) {
  const { user_id } = request;
  const response = await fetch(`${apiUrl}/appsorelly/${user_id}/produtos`, {
    headers: {
      'Token': apiToken,
    },
    cache: 'no-store',
  });
  const data = await response.json();
  return data;
}

export async function getUser(request: DevmasterRequest) {
  const { user_id } = request;
  const response = await fetch(`${apiUrl}/appsorelly/revendedoras/${user_id}`, {
    headers: {
      'Token': apiToken,
    },
    cache: 'no-store',
  });
  const data = await response.json();
  
  if (Array.isArray(data) && data.length > 0) return data[0];
  
  return data;
}

export async function getProductsById(user_id: string, product_id: string) {
  const response = await fetch(`${apiUrl}/appsorelly/${user_id}/produtos/${product_id}`, {
    headers: {
      'Token': apiToken,
    },
    cache: 'no-store',
  });
  const data = await response.json();
  
  if (Array.isArray(data) && data.length > 0) return data[0];
  
  return data;
}
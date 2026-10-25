import { Offer, CalculationResult, ApiError } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

/**
 * Thin fetch wrapper — deliberately not using axios yet. This is the only
 * function that needs to change if we later add auth headers, retries, or
 * swap HTTP clients, since every component calls through here rather than
 * hitting fetch directly.
 */
export async function calculateOffer(offer: Offer): Promise<CalculationResult> {
  const res = await fetch(`${API_BASE_URL}/api/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offer),
  });

  if (!res.ok) {
    const errorBody: ApiError = await res.json();
    const detailMessages = errorBody.details
      ?.map((d) => `${d.path}: ${d.message}`)
      .join("; ");
    throw new Error(detailMessages || errorBody.error || "Calculation failed");
  }

  return res.json();
}

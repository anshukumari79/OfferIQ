import { useState } from "react";
import toast from "react-hot-toast";
import { calculateOffer } from "../api/calculateOffer";
import { Offer, CalculationResult } from "../types";

/**
 * Wraps the calculate-offer API call with loading state and toast feedback.
 * Kept deliberately thin — this is the seam between "network call" and
 * "presentation", so components never call fetch directly.
 */
export function useCalculateOffer() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function calculate(offer: Offer) {
    setIsLoading(true);
    setResult(null);
    try {
      const data = await calculateOffer(offer);
      setResult(data);
      toast.success("Breakdown calculated");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return { result, isLoading, calculate };
}

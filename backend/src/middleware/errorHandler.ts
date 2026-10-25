import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Single place where errors become HTTP responses. Keeping this centralized
 * (rather than try/catch + res.status() scattered across every route) means
 * every endpoint added later gets consistent error shapes for free.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Invalid request body",
      details: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof Error) {
    // Errors thrown by the calculation engine itself (e.g. malformed vesting
    // schedule) surface here as 400s — they're caller input problems, not
    // server faults.
    res.status(400).json({ error: err.message });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}

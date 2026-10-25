import { Router, Request, Response, NextFunction } from "express";
import { offerSchema } from "../validation/offerSchema";
import { calculate } from "../engine/calculationEngine";

export const calculateRouter = Router();

/**
 * POST /api/calculate
 * Body: an Offer object (see offerSchema.ts)
 * Returns: a CalculationResult (see engine/types.ts)
 *
 * This route is deliberately thin: validate input shape, delegate to the
 * pure calculation engine, return its output. No business logic lives here.
 */
calculateRouter.post(
  "/calculate",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const offer = offerSchema.parse(req.body);
      const result = calculate(offer);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

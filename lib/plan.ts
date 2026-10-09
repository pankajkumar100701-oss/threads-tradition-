"use client";

import { PERIODS, addDays, isISODate } from "./rental";
import { useRente, useToday } from "./store";

/** The visitor's chosen rental dates, falling back to a sensible default window. */
export function usePlan() {
  const today = useToday();
  const { plan } = useRente();
  const min = addDays(today, 1);
  const start = isISODate(plan.start) && plan.start >= min ? plan.start : addDays(today, 6);
  const days = (PERIODS as readonly number[]).includes(plan.days) ? plan.days : 2;
  return { today, start, days, occasion: plan.occasion };
}

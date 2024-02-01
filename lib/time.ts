import { RRule } from "rrule";
import { Starter } from "./data/starterSchema";

export function getNextFeeding({ schedule }: Pick<Starter, "schedule">) {
  if (!schedule) return undefined;
  const rrule = RRule.fromString(schedule);
  const next = rrule.after(new Date());
  return next;
}

export function formatTime(time: Date): string {
  return time.toLocaleDateString();
}

export function getFormattedNextFeeding(feeding?: Starter): string {
  if (!feeding) return "Never";
  const next = getNextFeeding(feeding);
  return next ? formatTime(next) : "Never";
}

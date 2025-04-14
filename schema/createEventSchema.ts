import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start: z.date(),
  end: z.date(),
  notes: z.string().optional(),
  allDay: z.boolean().optional(),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;

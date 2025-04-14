import { z } from "zod";

/**
 * Schema for creating an event
 * Additional validation to ensure the event is at least 30 minutes long and no longer than 2 hours
 */
export const createEventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    start: z.date(),
    end: z.date(),
    notes: z.string().optional(),
    allDay: z.boolean().optional(),
    clientId: z.string().min(1, "Client is required"),
  })
  .refine(
    (data) => {
      const diffInMs = data.end.getTime() - data.start.getTime();
      return diffInMs >= 30 * 60 * 1000; // 30 minutes in milliseconds
    },
    {
      message: "Event must be at least 30 minutes long.",
      path: ["end"], // shows the error under the 'end' field
    }
  )
  .refine(
    (data) => {
      const diffMs = data.end.getTime() - data.start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours <= 2;
    },
    {
      message: "Event must be no longer than 2 hours",
      path: ["end"],
    }
  );

export type CreateEventSchema = z.infer<typeof createEventSchema>;

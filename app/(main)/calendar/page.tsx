"use client";
import Calendar from "@/app/components/Calendar";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import { authClient } from "@/lib/auth-client";
import { Event } from "@/db/schema";
const CalendarPage = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar", session?.user?.id],
    queryFn: async () => {
      const res = await fetch("/api/calendar");
      return res.json();
    },
    enabled: !!session?.user,
    select: (data) => {
      return {
        ...data,
        events: data.events.map((event: Event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        })),
      };
    },
  });

  if (isLoading || sessionLoading) {
    return <Loading />;
  }

  if (error || !data || !session) {
    return <div>Error</div>;
  }

  const { business, events } = data;

  return (
    <Calendar
      events={events}
      businessId={business.id}
      userId={session.user.id}
    />
  );
};

export default CalendarPage;

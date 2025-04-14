"use client";
import Calendar from "@/app/components/Calendar";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import { authClient } from "@/lib/auth-client";
const CalendarPage = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar", session?.user?.id],
    queryFn: async () => {
      const res = await fetch("/api/calendar");
      return res.json();
    },
    enabled: !!session?.user,
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

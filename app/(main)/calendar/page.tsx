"use client";
import Calendar from "@/app/components/Calendar";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
const CalendarPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      const res = await fetch("/api/calendar");
      return res.json();
    },
  });

  console.log(data);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <Calendar />;
};

export default CalendarPage;

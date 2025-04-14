"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Input,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Label,
  Checkbox,
  Textarea,
  DialogDescription,
} from "@/components/ui";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import { CreateEventSchema } from "@/schema/createEventSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema } from "@/schema/createEventSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const localizer = momentLocalizer(moment);

const MyCalendar = ({
  events,
  businessId,
  userId,
}: {
  events: any[];
  businessId: string;
  userId: string;
}) => {
  const queryClient = useQueryClient();
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleAddEvent = useMutation({
    mutationFn: async (event: CreateEventSchema & { businessId: string }) => {
      try {
        const res = await fetch("/api/calendar", {
          method: "POST",
          body: JSON.stringify(event),
        });
        if (!res.ok) {
          const { error } = await res.json();
          toast.error("Error creating event", {
            description: error,
          });
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["calendar", userId] });
        toast.success("Event created");
        setShowModal(false);
        return res.json();
      } catch (error) {
        toast.error("Error creating event", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  });

  const handleDeleteEvent = useMutation({
    mutationFn: async (event: { id: string; businessId: string }) => {
      const res = await fetch("/api/calendar", {
        method: "DELETE",
        body: JSON.stringify(event),
      });
      queryClient.invalidateQueries({ queryKey: ["calendar", userId] });
      setShowEditModal(false);
      toast.success("Event deleted");
      return res.json();
    },
  });

  const onSubmit = (data: CreateEventSchema) =>
    handleAddEvent.mutate({ ...data, businessId: businessId });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {showModal && (
        <Dialog
          open={showModal}
          onOpenChange={() => {
            setShowModal(false);
            form.reset();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Event will be added to the calendar for the business you are
            </DialogDescription>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  required
                  disabled={handleAddEvent.isPending}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm font-bold">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <DateTimePicker
                  name="start"
                  control={form.control}
                  disabled={handleAddEvent.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <DateTimePicker
                  name="end"
                  control={form.control}
                  disabled={handleAddEvent.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  disabled={handleAddEvent.isPending}
                />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Controller
                    name="allDay"
                    control={form.control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        id="allDay"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={handleAddEvent.isPending}
                      />
                    )}
                  />
                  <Label htmlFor="allDay">All Day</Label>
                </div>
                <Button type="submit" disabled={handleAddEvent.isPending}>
                  {handleAddEvent.isPending ? "Creating..." : "Create Event"}
                </Button>
              </div>
              {form.formState.errors.end && (
                <p className="text-red-500 text-sm text-center font-bold">
                  {form.formState.errors.end.message}
                </p>
              )}
            </form>
          </DialogContent>
        </Dialog>
      )}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setShowEditModal(true);
        }}
        onSelectSlot={(slotInfo) => {
          setShowModal(true);
          setSelectedEvent(slotInfo);
          form.setValue("start", slotInfo.start);
          form.setValue("end", slotInfo.end);
        }}
        selectable
      />
      {selectedEvent && (
        <Dialog
          open={showEditModal}
          onOpenChange={() => {
            setShowEditModal(false);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Event?</DialogTitle>
            </DialogHeader>
            <DialogDescription className="font-bold text-md text-black">
              "{selectedEvent.title}"
            </DialogDescription>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <Input
                  id="start"
                  value={new Date(selectedEvent.start).toLocaleString()}
                  disabled
                />
                <Label htmlFor="end">End</Label>
                <Input
                  id="end"
                  value={new Date(selectedEvent.end).toLocaleString()}
                  disabled
                />
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={selectedEvent.notes} disabled />
              </div>
              <Button
                onClick={() =>
                  handleDeleteEvent.mutate({
                    id: selectedEvent.id,
                    businessId: businessId,
                  })
                }
                type="submit"
                variant="destructive"
                className="justify-self-end flex"
              >
                Delete
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyCalendar;

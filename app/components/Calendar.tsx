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

const localizer = momentLocalizer(moment);

const events = [
  {
    allDay: false,
    title: "Lawn Mowing - John D.",
    start: new Date("2025-04-14T09:00:00"),
    end: new Date("2025-04-14T10:00:00"),
    notes:
      "client name - John Doe, address - 123 Main St, service type - Lawn Mowing",
  },
  {
    allDay: false,
    title: "Gutter Cleaning - Sarah K.",
    start: new Date("2025-04-14T12:30:00"),
    end: new Date("2025-04-14T01:30:00"),
    notes:
      "client name - Sarah King, address - 456 Oak Rd, service type - Gutter Cleaning",
  },
  {
    allDay: true,
    title: "Unavailable - Personal Day",
    start: new Date("2025-04-16"),
    end: new Date("2025-04-16"),
    notes: "Taking a day off",
  },
];

const MyCalendar = () => {
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleAddEvent = (event: any) => {
    console.log(event);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {showModal && (
        <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleAddEvent)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} required />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm font-bold">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <DateTimePicker name="start" control={form.control} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <DateTimePicker name="end" control={form.control} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...form.register("notes")} />
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
                      />
                    )}
                  />
                  <Label htmlFor="allDay">All Day</Label>
                </div>
                <Button type="submit">Create Event</Button>
              </div>
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
            form.reset();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Event?</DialogTitle>
            </DialogHeader>
            <DialogDescription className="font-medium text-xl text-black">
              {selectedEvent.title}
            </DialogDescription>
            <form
              onSubmit={form.handleSubmit(handleAddEvent)}
              className="space-y-4"
            >
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

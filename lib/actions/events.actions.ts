"use server";
import { mongoConnect } from "@/lib/database/connection";
import { Event as EventType } from "@/types";
import Events from "../database/models/events.model";

// Create Event
export async function createEvent(event: EventType) {
    try {
      await mongoConnect();
      const newEvent = await Events.create(
        event
      );
      console.log(newEvent);
      return JSON.parse(JSON.stringify(newEvent));
    } catch (error) {
      console.log(error);
    }
  }

  // Get All Events
export async function getAllEvents() {
    try {
      // Connect to the database
      await mongoConnect();
      // Search for events
      const events = await Events.find();
      return JSON.parse(JSON.stringify(events));
    } catch (error) {
      console.log(error);
    }
}

// Delete Event
export async function deleteEvent(eventId: string) {
  try {
    await mongoConnect();
    const deleteAction = await Events.findOneAndDelete({ _id: eventId }, { new: true });
    return JSON.parse(JSON.stringify(deleteAction));
  } catch (error) {
    console.log(error);
  }
}
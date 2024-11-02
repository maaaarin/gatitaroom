"use server";
import { mongoConnect } from "@/lib/database/connection";
import { State as StateType } from "@/types";
import States from "../database/models/states.model";

// Get All States
export async function getAllStates() {
    try {
        // Connect to the database
        await mongoConnect();
        // Search for states
        const states = await States.find();
        return JSON.parse(JSON.stringify(states));
    } catch (error) {
        console.log(error);
    }
}

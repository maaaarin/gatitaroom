"use server";
import { mongoConnect } from "@/lib/database/connection";
import { Interaction, Dialogue } from "@/types";
import Interactions from "../database/models/interactions.model";

// Get All Events
export async function getAllInteractions() {
    try {
        // Connect to the database
        await mongoConnect();
        // Search for events
        const interactions = await Interactions.find({ isFinished: false });
        return JSON.parse(JSON.stringify(interactions));
    } catch (error) {
        console.log(error);
    }
}

// Update current interaction
export async function updateCurrentDialogue(currentDialogueIndex: number, interactionId: string) {
    try {
        // Connect to the database
        await mongoConnect();
        const interaction = await Interactions.findById(interactionId);
        const totalDialogues = interaction.dialogues.length ;
        const isFinished = currentDialogueIndex >= totalDialogues;

        // Update the current dialogue index and isFinished flag
        await Interactions.updateOne(
            { _id: interactionId },
            {
                currentDialogueIndex: currentDialogueIndex,
                isFinished: isFinished, // Update isFinished based on the new index
            }
        );
    } catch (error) {
        console.log(error);
    }
}

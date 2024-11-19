"use server";
import { mongoConnect } from "@/lib/database/connection";
import { GroceryList, Grocery } from "@/types";
import Groceries from "../database/models/groceries.model";
import mongoose from "mongoose";

// Get All Groceries
export async function getAllGroceries() {
    try {
        // Connect to the database
        await mongoConnect();
        // Search for events
        const groceries = await Groceries.find();
        return JSON.parse(JSON.stringify(groceries));
    } catch (error) {
        console.log(error);
    }
}

// Remove a Grocery from a list
export async function removeGrocery(list: GroceryList, grocery: Grocery) {
    try {
        await mongoConnect();
        const updatedList = await Groceries.findOneAndUpdate(
            { name: list.name },
            { $pull: { items: { name: grocery.name } } },
            { new: true }
        );
        console.log(updatedList)
        return JSON.parse(JSON.stringify(updatedList));
    } catch (error) {
        console.error(error);
        throw new Error("Failed to remove grocery.");
    }
}

// Remove a Grocery List
export async function removeGroceryList(list: GroceryList) {
    try {
        await mongoConnect();
        const deletedList = await Groceries.findOneAndDelete({ name: list.name });
        return JSON.parse(JSON.stringify(deletedList));
    } catch (error) {
        console.error(error);
        throw new Error("Failed to remove grocery list.");
    }
}

// Add a Grocery to a list
export async function addGrocery(list: GroceryList, grocery: Grocery) {
    try {
        await mongoConnect();
        const updatedList = await Groceries.findOneAndUpdate(
            { name: list.name },
            {
                $push: {
                    items: grocery,
                },
            },
            { new: true }
        );
        return JSON.parse(JSON.stringify(updatedList));
    } catch (error) {
        console.error(error);
        throw new Error("Failed to add grocery.");
    }
}


// Create a new Grocery List
export async function createGroceryList(listName: string) {
    try {
        await mongoConnect();
        const newList = await Groceries.create({
            name: listName,
            items: [],
        });
        return JSON.parse(JSON.stringify(newList));
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create grocery list.");
    }
}

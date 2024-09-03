"use server";
import Task from "@/lib/database/models/task.model";
import { mongoConnect } from "@/lib/database/connection";
import { Task as TaskType } from "@/types";

// Create Task
export async function createTask(task: TaskType) {
  try {
    await mongoConnect();
    const newTask = await Task.create(task);
    return JSON.parse(JSON.stringify(newTask));
  } catch (error) {
    console.log(error);
  }
}

// Get All Tasks
export async function getAllTasks() {
  try {
    // Connect to the database
    await mongoConnect();
    // Search for tasks
    const tasks = await Task.find();
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.log(error);
  }
}

// Remove Task
export async function removeTask(_id: String | undefined) {
  try {
    await mongoConnect();
    const removeTask = await Task.findOneAndDelete({ _id: _id });
    return JSON.parse(JSON.stringify(removeTask));
  } catch (error) {
    console.log(error);
  }
}

// Update Task
export async function updateTask(
  _id: String | undefined,
  completed: boolean | undefined
) {
  try {
    await mongoConnect();
    const removeTask = await Task.findOneAndUpdate(
      { _id: _id },
      {
        completed: completed,
      }
    );
    return JSON.parse(JSON.stringify(removeTask));
  } catch (error) {
    console.log(error);
  }
}

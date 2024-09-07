"use server";
import { mongoConnect } from "@/lib/database/connection";
import { Task as TaskType } from "@/types";
import Tasks from "../database/models/tasks.model";

// Create Task
export async function createTask(task: TaskType) {
  try {
    await mongoConnect();
    const newTask = await Tasks.findOneAndUpdate(
      { status: "pending" },
      {
        $push: { tasks: task },
      }
    );
    console.log(newTask);
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
    const tasks = await Tasks.find();
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.log(error);
  }
}

// Remove Task
export async function removeTask(taskStatus: string, taskId: string) {
  try {
    await mongoConnect();
    const removeTask = await Tasks.findOneAndUpdate({ status: taskStatus }, {
      $pull: { tasks: { _id: taskId } }
    }, { new: true });
    return JSON.parse(JSON.stringify(removeTask));
  } catch (error) {
    console.log(error);
  }
}

// Update Task
export async function updateTask(
  sourceIndex: number,
  sourceId: String,
  destinationIndex: number,
  destinationId: string
) {
  try {
    await mongoConnect();
    if (sourceId !== destinationId) {
      const sourceTasks = await Tasks.findOne({ status: sourceId });
      const destinationTasks = await Tasks.findOne({ status: destinationId });
      const [movedTask] = sourceTasks.tasks.splice(sourceIndex, 1);
      destinationTasks.tasks.splice(destinationIndex, 0, movedTask);
      await sourceTasks.save();
      await destinationTasks.save();
    } else {
      const destionationTasks = await Tasks.findOne({ status: destinationId });
      const [movedTask] = destionationTasks.tasks.splice(sourceIndex, 1);
      destionationTasks.tasks.splice(destinationIndex, 0, movedTask);
      await destionationTasks.save();
    }
  } catch (error) {
    console.log(error);
  }
}

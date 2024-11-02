"use server";
import { mongoConnect } from "@/lib/database/connection";
import { Task as TaskType } from "@/types";
import Tasks from "../database/models/tasks.model";

// Create Task
export async function createTask(name: string, type: string = "standard", state: string = "pending") {
  try {
    await mongoConnect();

    // Verify if type event is already added
    const existingEventTask = await Tasks.findOne({
      name: name,
      state: state,
      type: "event",
    });

    if (type === "event" && existingEventTask) {
      return null;
    }

    // New task
    const tasks = await Tasks.find({ state });
    const order = tasks.length;
    const newTask = await Tasks.create(
      {
        name: name,
        state: state,
        type: type,
        order: order,
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
    const tasks = await Tasks.find().sort({ state: 1, order: 1 });
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.log(error);
  }
}

export async function removeTask(taskId: string, state: string) {
  try {
    await mongoConnect();
    
    // Find task
    const taskToRemove = await Tasks.findOne({ _id: taskId });
    if (!taskToRemove) {
      throw new Error("Task not found");
    }

    await Tasks.updateMany(
      { state, order: { $gt: taskToRemove.order } },
      { $inc: { order: -1 } }
    );

    // Delete task
    await Tasks.deleteOne({ _id: taskId });

    return { success: true, taskId };
  } catch (error) {
    console.error("Error removing task:", error);
    throw error;
  }
}

// Update Task
export async function updateTask(
  tasks: TaskType[],
  sourceId: string,
  destinationId: string,
  taskId?: string
) {
  try {
    await mongoConnect();
    if (sourceId === destinationId) {
      const orderTasks = tasks
      .filter(task => task.state === sourceId)  // Filtrar tareas con state igual a sourceId
      .map(task => ({
        updateOne: {
          filter: { _id: task._id, state: sourceId },  // Filtro adicional por state
          update: { $set: { order: task.order } }  // Solo actualizar el campo "order"
        }
      }));
      await Tasks.bulkWrite(orderTasks);
    } else {
      const orderTasksByState = [
        ...tasks
          .filter(task => task.state === sourceId)
          .map(task => ({
            updateOne: {
              filter: { _id: task._id, state: sourceId },
              update: { $set: { order: task.order } }
            }
          })),
        ...tasks
          .filter(task => task.state === destinationId || task._id === taskId)
          .map(task => ({
            updateOne: {
              filter: { _id: task._id },
              update: {
                $set: {
                  order: task.order,
                  ...(task._id === taskId && { state: destinationId }),
                  ...(destinationId === "done" && task._id === taskId && { completedAt: Date.now() })
                },
                ...(sourceId === "done" && task._id === taskId && {
                  $unset: { completedAt: "" }
                })
              }
            }
          }))
      ];
      await Tasks.bulkWrite(orderTasksByState);
    }
  } catch (error) {
    console.log(error);
  }
}

// // Update Task
// export async function updateTask(
//   sourceIndex: number,
//   sourceId: string,
//   destinationIndex: number,
//   destinationId: string
// ) {
//   try {
//     await mongoConnect();
//     if (sourceId === destinationId) {
//       const sourceTasks = await Tasks.findOne({ status: sourceId });
//       const destinationTasks = await Tasks.findOne({ status: destinationId });
//       const [movedTask] = sourceTasks.tasks.splice(sourceIndex, 1);
//       // If task done
//       if (destinationId === "done") {
//         movedTask.completedAt = new Date();
//       }
//       // If task isn't done anymore
//       if (sourceId === "done") {
//         delete movedTask.completedAt;
//       }
//       destinationTasks.tasks.splice(destinationIndex, 0, movedTask);
//       await sourceTasks.save();
//       await destinationTasks.save();
//     } else {
//       const destionationTasks = await Tasks.findOne({ status: destinationId });
//       const [movedTask] = destionationTasks.tasks.splice(sourceIndex, 1);
//       destionationTasks.tasks.splice(destinationIndex, 0, movedTask);
//       await destionationTasks.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

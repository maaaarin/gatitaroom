// Status.js
import { Schema, model, models } from "mongoose";

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(2, 0, 0, 0); // At 2:00h
  return tomorrow;
};

const taskSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, default: "Daily"},
  // date: {
  //   type: Date,
  //   default: getTomorrow,
  //   index: { expires: 0 },
  // }
});

const tasksSchema = new Schema({
  status: { type: String, enum: ["pending", "ongoing", "done"], required: true },
  tasks: [taskSchema] 
});

// Modelo
const Tasks = models.Tasks || model("Tasks", tasksSchema);

export default Tasks;

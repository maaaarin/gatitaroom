import { Schema, model, models } from "mongoose";

const taskSchema = new Schema({
  name: { type: String, required: true },
  state: { type: String, enum: ["pending", "ongoing", "done"], required: true },
  type: { type: String, default: "standard"},
  order: { type: Number, required: true },
  completedAt: { type: Date, expires: 3600 }
});

// Modelo
const Tasks = models.Tasks || model("Tasks", taskSchema);

export default Tasks;

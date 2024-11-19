import { Schema, model, models } from "mongoose";

const groceryItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
});

const grocerySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  items: {
    type: [groceryItemSchema],
    default: [],
  },
});

export default models.Groceries || model("Groceries", grocerySchema);

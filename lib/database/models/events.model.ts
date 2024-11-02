import { Schema, model, models } from "mongoose";

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    index: { expires: 0 }
  },
});

export default models.Events || model('Events', eventSchema);
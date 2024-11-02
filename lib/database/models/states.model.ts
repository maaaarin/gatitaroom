import { Schema, model, models } from "mongoose";

const stateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    }
});

export default models.States || model('States', stateSchema);

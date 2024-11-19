import { Schema, model, models } from "mongoose";

const interactionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    dialogues: [
        {
            text: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            audio: {
                type: [String],
                required: false,
            },
        },
    ],
    currentDialogueIndex: {
        type: Number,
        default: 0,
    },
    isFinished: {
        type: Boolean,
        default: false,
    },
});

export default models.Interactions || model('Interactions', interactionSchema);

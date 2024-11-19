export type Task = {
  _id?: string | undefined;
  name: string;
  state: string;
  order: number;
  type: string;
};

export type Event = {
  _id?: string | undefined;
  name: string;
  date: Date;
  color: string;
  sticker: string;
};

export type State = {
  name: string;
  description: string;
};

export type Dialogue = {
  text: string;
  image: string;
  audio: string[];
};

export type Interaction = {
  _id?: string | undefined;
  name: string;
  dialogues: Dialogue[];
  currentDialogueIndex: number;
  isFinished: boolean;
};

export type Grocery = {
  _id?: string | undefined;
  name: string;
  amount: number;
};

export type GroceryList = {
  _id?: string | undefined;
  name: string;
  items: Grocery[];
};

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
  type: 'audio' | 'music';
  image: string;
  audio: string[];
}

export type Interaction = {
  _id?: string | undefined;
  name: string;
  dialogues: Dialogue[]; 
  currentDialogueIndex: number; 
  isFinished: boolean; 
}
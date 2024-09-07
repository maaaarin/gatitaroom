export type Task = {
  _id?: string;
  name: string;
  type: string;
};

export type TaskStatus = {
  status: string;
  tasks: Task[];
};

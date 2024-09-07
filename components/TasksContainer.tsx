"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Task, TaskStatus } from "@/types";
import clsx from "clsx";
import { removeTask, updateTask } from "@/lib/actions/task.actions";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const TasksContainer = ({ tasksInit }: { tasksInit: TaskStatus[] }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  }, []);

  const [tasks, setTasks] = React.useState<TaskStatus[]>(tasksInit);

  useEffect(() => {
    setTasks(tasksInit);
  }, [tasksInit]);

  function taskDone() {
    const audio = new Audio("/assets/audio/task_done.mp3");
    audio.play();
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newTasks = [...tasks];
    // Drag on another area
    if (source.droppableId !== destination.droppableId) {
      const oldDroppableIndex = newTasks.findIndex(
        (x) => x.status == source.droppableId
      );
      const newDroppableIndex = newTasks.findIndex(
        (x) => x.status == destination.droppableId
      );
      const [item] = newTasks[oldDroppableIndex].tasks.splice(source.index, 1);
      newTasks[newDroppableIndex].tasks.splice(destination.index, 0, item);
      setTasks([...newTasks]);
      // Task done successfully
      if (destination.droppableId === "done") {
        taskDone();
      }
      // Update database
      const updatingTask = async () => {
        const updatedTask = await updateTask(
          source.index,
          source.droppableId,
          destination.index,
          destination.droppableId
        );
      };
      updatingTask();
    } else {
      // Drag on same area
      const droppableIndex = newTasks.findIndex(
        (x) => x.status == source.droppableId
      );
      const [item] = newTasks[droppableIndex].tasks.splice(source.index, 1);
      newTasks[droppableIndex].tasks.splice(destination.index, 0, item);
      setTasks([...newTasks]);
      // Update database
      const updatingTask = async () => {
        const taskUpdate = await updateTask(
          source.index,
          source.droppableId,
          destination.index,
          destination.droppableId
        );
      };
      updatingTask();
    }
  };

  function taskRemove(taskStatus: string, taskId: string){
    removeTask(taskStatus, taskId);
    router.refresh();
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="w-3/4 h-auto bg-white rounded-3xl border-secondary border-2 flex pt-5 relative ">
        {/* Tasks */}
        <div className="size-full flex overflow-y-auto">
          {isBrowser
            ? tasks.map((tasksCategory: any, index: number) => {
                return (
                  <Droppable
                    droppableId={tasksCategory.status}
                    type="column"
                    key={index}>
                    {(provided) => (
                      <>
                      <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="w-2/6 h-full p-5 flex flex-col gap-3">
                        {tasksCategory.tasks.map((task: any, index: number) => {
                          return (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}>
                              {(provided) => (
                                <li
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  className={clsx(
                                    "w-full h-28 border rounded-2xl p-5 relative group",
                                    {
                                      "bg-amber-100":
                                        tasksCategory.status === "ongoing",
                                      "bg-primary/20":
                                        tasksCategory.status === "done",
                                    }
                                  )}>
                                  <div>{task.name}</div>
                                  <Button isIconOnly className="absolute bottom-2 right-2 bg-transparent hover:bg-black/5 opacity-0 group-hover:opacity-100 hover:text-red-400 duration-300 text-zinc-500" radius="sm" size="sm" onClick={()=>{taskRemove(tasksCategory.status, task._id)}}>
                                    <svg
                                      className="size-5 "
                                      fill="currentColor"
                                      viewBox="0 0 16 16">
                                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                  </Button>
                                </li>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </ul>
                      {index < 2 && <Image src="/assets/divider.svg" alt="alt" width={5} height={5} />}
                      </>
                    )}
                  </Droppable>
                );
              })
            : null}
        </div>
        <div className="w-full h-2/5 absolute bottom-0 bg-gradient-to-t from-white z-50 rounded-b-3xl pointer-events-none flex gap-[calc(100%/3-2rem)] items-end justify-center pb-10">
          <div className="size-8 rounded-full bg-zinc-400 grid place-content-center">
            <svg
              className="size-6 text-white"
              fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z" />
            </svg>
          </div>
          <div className="size-8 rounded-full bg-amber-500 grid place-content-center">
            <svg
              className="size-5 text-white"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
            </svg>
          </div>
          <div className="size-8 rounded-full bg-primary grid place-content-center">
            <svg
              fill="currentColor"
              className="size-6 text-white"
              viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
            </svg>
          </div>
        </div>
        <Image
          src="/assets/zigzag.svg"
          alt="alt"
          width={35}
          height={35}
          className="absolute -left-5 bottom-16 z-50"
        />
        <div className="w-fit h-12 flex absolute -top-6 left-4 px-12 items-center justify-center -rotate-3">
          <Image src="/assets/banner.svg" alt="alt" fill />
          <Image
            src="/assets/good.png"
            alt="alt"
            width={60}
            height={60}
            className="absolute top-0 -right-7 rotate-12"
          />
          <p className="relative text-white text-2xl">Daily Overview</p>
        </div>
      </section>
    </DragDropContext>
  );
};

export default TasksContainer;

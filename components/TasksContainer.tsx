"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Task, State } from "@/types";
import clsx from "clsx";
import { removeTask, updateTask } from "@/lib/actions/task.actions";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type Props = {
  tasks: Task[],
  states: State[],
}

const TasksContainer = ({ tasks, states }: Props) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  }, []);

  const [myTasks, setMyTasks] = React.useState<Task[]>(tasks);

  useEffect(() => {
    setMyTasks(tasks);
  }, [tasks]);

  function taskDone() {
    const audio = new Audio("/assets/audio/task_done.mp3");
    audio.play();
  }

  function taskMove() {
    const audio = new Audio("/assets/audio/task_move.mp3");
    audio.play();
  }

  const sortTasksByOrder = (tasks: any[]) => {
    return [...tasks].sort((a, b) => a.order - b.order);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    const newTasks = [...myTasks];
    // Drag on same area
    if (source.droppableId === destination.droppableId) {
      const tasksInColumn = newTasks.filter(task => task.state === source.droppableId);
      const movedTask = tasksInColumn.find(task => task.order === source.index);
      const destinationTask = tasksInColumn.find(
        (task) => task.order == destination.index
      );
      // Detect the direction in which it moves
      if (movedTask && destinationTask) {
        console.log(movedTask)
        console.log(destinationTask)
        if (source.index < destination.index) {
          // Subtract down
          tasksInColumn.forEach((task) => {
            if (task.order > movedTask.order && task.order <= destinationTask.order) {
              task.order--;
            }
          })
          // Change the order of source to that of destination
          movedTask.order = destination.index
        } else {
          // Add up
          tasksInColumn.forEach((task) => {
            if (task.order < movedTask.order && task.order >= destinationTask.order) {
              task.order++;
            }
          })
          // Change the order of source to that of destination
          movedTask.order = destination.index
        }
      }
      // Update the original array
      newTasks.forEach(task => {
        if (task.state === source.droppableId) {
          const updatedTask = tasksInColumn.find(t => t._id === task._id);
          if (updatedTask) {
            task.order = updatedTask.order;
          }
        }
      });
      const sortedTasks = sortTasksByOrder(newTasks);
      setMyTasks(sortedTasks);
      // Update database
      const updatingTask = async () => {
        const updatedTask = await updateTask(
          myTasks,
          source.droppableId,
          destination.droppableId
        );
      };
      updatingTask();
      // Task moved
      taskMove();
    } else {
      // From element, subtract downwards
      const tasksOriginColumn = newTasks.filter(task => task.state === source.droppableId);
      const tasksDestinationColumn = newTasks.filter(task => task.state === destination.droppableId);
      const movedTask = tasksOriginColumn.find(task => task.order === source.index);
      tasksOriginColumn.forEach((task) => {
        if (task.order > source.index) {
          task.order--;
        }
      })
      // In the other column, starting from the destination element, add downwards.
      tasksDestinationColumn.forEach((task) => {
        if (task.order >= destination.index) {
          task.order++;
        }
      })
      // Assign the index to the source element and change state
      if (movedTask) {
        movedTask.order = destination.index
        movedTask.state = destination.droppableId
      }
      // Update the original array
      newTasks.forEach(task => {
        if (task.state === source.droppableId) {
          const updatedTask = tasksOriginColumn.find(t => t._id === task._id);
          if (updatedTask) {
            task.order = updatedTask.order;
          }
        } else if (task.state === destination.droppableId) {
          const updatedTask = tasksDestinationColumn.find(t => t._id === task._id);
          if (updatedTask) {
            task.order = updatedTask.order;
          }
        }
      });
      const sortedTasks = sortTasksByOrder(newTasks);
      // Update database
      const updatingTask = async () => {
        const updatedTask = await updateTask(
          myTasks,
          source.droppableId,
          destination.droppableId,
          draggableId
        );
      };
      updatingTask();
      setMyTasks(sortedTasks);
      if(destination.droppableId === "done"){
        taskDone();
      } else {
        taskMove();
      }
    }
    router.refresh();
  };

  // const onDragEnd = (result: DropResult) => {
  //   if (!result.destination) return;
  //   const { source, destination } = result;
  //   const newTasks = [...myTasks];
  //   console.log(result);
  //   // Drag on another area
  //   if (source.droppableId !== destination.droppableId) {
  // const oldDroppableIndex = newTasks.findIndex(
  //   (x) => x.status == source.droppableId
  // );
  // const newDroppableIndex = newTasks.findIndex(
  //   (x) => x.status == destination.droppableId
  // );
  // const [item] = newTasks[oldDroppableIndex].tasks.splice(source.index, 1);
  // newTasks[newDroppableIndex].tasks.splice(destination.index, 0, item);
  // setMyTasks([...newTasks]);
  // Task done successfully
  // if (destination.droppableId === "done") {
  //   taskDone();
  // }
  // Update database
  // const updatingTask = async () => {
  //   const updatedTask = await updateTask(
  //     source.index,
  //     source.droppableId,
  //     destination.index,
  //     destination.droppableId
  //   );
  // };
  // updatingTask();
  //   } else {
  // //Drag on same area
  // const droppableIndex = newTasks.findIndex(
  //   (x) => x.status == source.droppableId
  // );
  // const [item] = newTasks[droppableIndex].tasks.splice(source.index, 1);
  // newTasks[droppableIndex].tasks.splice(destination.index, 0, item);
  // setMyTasks([...newTasks]);
  // Update database
  // const updatingTask = async () => {
  //   const taskUpdate = await updateTask(
  //     source.index,
  //     source.droppableId,
  //     destination.index,
  //     destination.droppableId
  //   );
  // };
  // updatingTask();
  //   }
  // };

  function taskRemove(taskId: string, state: string) {
    removeTask(taskId, state);
    router.refresh();
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="w-full h-full bg-white rounded-3xl border-secondary border-2 flex pt-5 relative ">
        {/* Categories */}
        <div className="size-full flex overflow-y-auto">
          {isBrowser
            ? states.map((state: State, index: number) => {
              return (
                <Droppable
                  droppableId={state.name}
                  type="column"
                  key={index}>
                  {(provided) => (
                    <>
                      <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="w-2/4 h-full p-5 flex flex-col gap-3">
                        {myTasks
                          .filter(task => task.state === state.name)
                          .map((task: Task, index: number) => {
                            return (
                              <Draggable
                                key={task._id}
                                draggableId={task._id!}
                                index={index}>
                                {(provided) => (
                                  <li
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    className={clsx("w-full h-28 border-zinc-400 border-2 rounded-2xl p-5 relative group flex flex-col justify-between gap-6",
                                      {
                                        "bg-secondary/40 !border-primary border-2":
                                          state.name === "done" && task.type != "event",
                                      },
                                      {
                                        "bg-primary !border-secondary border-2":
                                          task.type === "event",
                                      }
                                    )}>
                                    <div className={clsx({ "text-secondary": task.type === "event" })}>{task.name}</div>
                                    {task.type != "event" ?
                                      <Button isIconOnly className="absolute bottom-2 right-2 bg-transparent hover:bg-black/5 opacity-0 group-hover:opacity-100 hover:text-red-400 duration-300 text-zinc-500" radius="sm" size="sm" onClick={() => { taskRemove(task._id!, state.name) }}>
                                        <svg
                                          className="size-5 "
                                          fill="currentColor"
                                          viewBox="0 0 16 16">
                                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                      </Button>
                                      :
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <svg className="text-secondary size-5" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
                                          </svg>
                                          <span className="text-secondary">Today</span>
                                        </div>
                                        <Button isIconOnly className="bg-transparent min-w-fit w-fit h-fit opacity-0 group-hover:opacity-100" radius="none" onClick={() => { taskRemove(task._id!, state.name) }}>
                                          <svg className="text-secondary size-5" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                          </svg>
                                        </Button>
                                      </div>
                                    }
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </ul>
                      {index < 1 && <Image src="/assets/divider.svg" alt="alt" width={5} height={5} />}
                    </>
                  )}
                </Droppable>
              );
            })
            : null}
        </div>
        <div className="w-full h-2/5 absolute bottom-0 bg-gradient-to-t from-white z-50 rounded-b-3xl pointer-events-none flex gap-[calc(100%/2-2rem)] items-end justify-center pb-10">
          <div className="size-8 rounded-full bg-zinc-400 grid place-content-center">
            <svg
              className="size-6 text-white"
              fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z" />
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
          src="/assets/star_1.svg"
          alt="alt"
          width={60}
          height={60}
          className="absolute -left-5 -top-5 z-50"
        />
        <Image
          src="/assets/cat/thinking_you.svg"
          alt="alt"
          width={160}
          height={160}
          className="absolute -left-12 -bottom-4 z-50"
        />
      </section>
    </DragDropContext>
  );
};

export default TasksContainer;

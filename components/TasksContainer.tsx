"use client";
import { createTask } from "@/lib/actions/task.actions";
import Image from "next/image";
import React, { useEffect } from "react";
import { Task as TaskType } from "@/types";
import Task from "./Task";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

const TasksContainer = ({ tasks }: { tasks: any }) => {
  const router = useRouter();
  const [taskCompleted, setTaskCompleted] = React.useState(false);
  const [taskInput, setTaskInput] = React.useState("");

  // Add new task
  useEffect(() => {
    if (taskCompleted) {
      setTimeout(() => {
        document.getElementById("confetti")?.remove();
        setTaskCompleted(false);
      }, 3000);
    }
  }, [taskCompleted]);

  const taskInputElement = React.useRef<HTMLInputElement>(null);

  function newTask(e: HTMLInputElement) {
    setTaskInput(e.value);
  }

  function addTaskButton() {
    if (taskInput) {
      createTask({ name: taskInput });
      taskInputElement.current!.value = "";
      setTaskInput("");
      router.refresh();
    }
  }

  useEffect(() => {
    const addTask = (e: KeyboardEvent) => {
      if (e.key === "Enter" && taskInput) {
        createTask({ name: taskInput });
        taskInputElement.current!.value = "";
        setTaskInput("");
        router.refresh();
      }
    };
    window.addEventListener("keydown", addTask);
    return () => {
      window.removeEventListener("keydown", addTask);
    };
  }, [taskInput]);

  const [isTaskCompleted, setIsTaskCompleted] = React.useState(false);

  // Check if there's tasks completed
  function checkTasksCompleted() {
    const completedTasks = tasks.some((task: TaskType) => task.completed);
    if (completedTasks) {
      setIsTaskCompleted(true);
    } else {
      setIsTaskCompleted(false);
    }
  }

  useEffect(() => {
    checkTasksCompleted();
    console.log(isTaskCompleted);
    console.log(tasks);
  }, [tasks]);

  // Check All Tasks Completed
  // function checkAllTasksCompleted() {
  //   const completedTasks = tasks.filter(task => task.completed);
  //   if(completedTasks.length === tasks.length) {
  //     setTaskCompleted(true);
  //   }
  // }

  return (
    <>
    <section className="w-2/5 flex-auto overflow-hidden bg-white rounded-t-3xl">
      {/* Add task */}
      <div className="flex h-16 items-center w-full relative">
        <input
          type="text"
          placeholder="Add your task..."
          className="size-full bg-zinc-200 rounded-t-3xl indent-5 border-none outline-none"
          onChange={(e) => newTask(e.currentTarget)}
          ref={taskInputElement}
        />
        <Button
          className="absolute right-5 bg-secondary w-20"
          isIconOnly
          onClick={addTaskButton}>
          <svg
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-white size-8">
            <path
              fillRule="evenodd"
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
              />
          </svg>
        </Button>
      </div>
      {tasks.length ? (
        <div className="w-full h-[calc(100%-4rem)] overflow-y-auto">
          {/* Tasks list */}
          <ul className="flex flex-col w-full p-5 gap-2">
            {tasks.map(
              (task: TaskType, key: number) =>
                !task.completed && (
                  <Task
                    key={key}
                    task={task}
                    setTaskCompleted={setTaskCompleted}></Task>
                  )
                )}
          </ul>
          {/* Completed tasks */}
          {isTaskCompleted && (
            <div className="flex justify-center">
              <Image
                src="/assets/good.png"
                alt="alt"
                width={70}
                height={70}
                className="text-center"
                />
            </div>
          )}
          <ul className="flex flex-col w-full p-5 gap-2">
            {tasks.map(
              (task: TaskType, key: number) =>
                task.completed && (
                  <Task
                  key={key}
                  task={task}
                  setTaskCompleted={setTaskCompleted}></Task>
                )
            )}
          </ul>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
          <Image src="/assets/excited.png" alt="alt" width={125} height={125} />
          <h1 className="text-xl text-gray-800">What will you do today?</h1>
        </div>
      )}
      {/*  Confetti */}
      {taskCompleted && (
        <div className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center z-10 bg-black/50 ">
          <Image
            src="/assets/gg.png"
            alt="alt"
            width={500}
            height={500}
            className=""
            />
          <Image src="/assets/confetti.gif" alt="alt" fill id="confetti" />
          <audio src="/assets/gg_sfx.mp3" autoPlay></audio>
        </div>
      )}
    </section>
    <div className="w-2/5 flex-auto relative">
    <Image
          src="/assets/flower_1.svg"
          alt="alt"
          width={150}
          height={150}
          className="absolute -left-32 bottom-0"
        />
        <Image
          src="/assets/flower_2.svg"
          alt="alt"
          width={180}
          height={180}
          className="absolute -right-32 bottom-0"
        />
        <Image
          src="/assets/sleeping.png"
          alt="alt"
          width={120}
          height={120}
          className="absolute -right-10 bottom-0"
        />
        <Image
          src="/assets/zzz.gif"
          alt="alt"
          width={80}
          height={80}
          className="absolute -right-0 bottom-16"
        />
    </div>
      </>
  );
};

export default TasksContainer;

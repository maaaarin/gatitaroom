"use client";
import { createTask } from "@/lib/actions/task.actions";
import { Button, DateInput, DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const TaskInput = () => {
  const router = useRouter();
  const [taskInput, setTaskInput] = React.useState("");
  const taskInputElement = React.useRef<HTMLInputElement>(null);
  // const [value, setValue] = React.useState(null);
  const [isDailyChecked, setIsDailyChecked] = React.useState(true);

  function newTask(e: HTMLInputElement) {
    setTaskInput(e.value);
  }

  function addTaskButton() {
    if (taskInput) {
      const creatingTask = async () => {
        const createdTask = await createTask({
          name: taskInput,
          type: "Daily",
        });
        createdTask && router.refresh();
      };
      creatingTask();
      // Clear input
      taskInputElement.current!.value = "";
      setTaskInput("");
      // Refresh
      router.refresh();
    }
  }

  useEffect(() => {
    const addTask = (e: KeyboardEvent) => {
      if (e.key === "Enter" && taskInput) {
        const creatingTask = async () => {
          const createdTask = await createTask({
            name: taskInput,
            type: "Daily",
          });
          createdTask && router.refresh();
        };
        creatingTask();
        // Clear input
        setTaskInput("");
        taskInputElement.current!.value = "";
        // Refresh
        router.refresh();
      }
    };
    window.addEventListener("keydown", addTask);
    return () => {
      window.removeEventListener("keydown", addTask);
    };
  }, [taskInput]);

  return (
    <section className="w-full min-h-14 flex items-center justify-center mb-4 z-50">
      <div className="w-2/5 h-full flex items-center relative border-secondary border-2 rounded-full">
        <input
          type="text"
          className="size-full border-none outline-none rounded-full indent-5 text-lg"
          ref={taskInputElement}
          onChange={(e) => {
            newTask(e.currentTarget);
          }}
          placeholder="New task..."
        />
        <div className="flex absolute right-2 gap-1">
          {/* <Button
            isIconOnly
            className={clsx(
              "!size-10 rounded-full flex items-center justify-center relative bg-transparent",
              {
                "bg-primary": isDailyChecked,
              }
            )}>
            <svg
              fill="currentColor"
              className={clsx("size-7 text-zinc-400 absolute", {
                "!text-white": isDailyChecked,
              })}
              viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"
              />
              <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
            </svg>
            <input
              type="checkbox"
              name="daily"
              value={"daily"}
              className="size-10 opacity-0 cursor-pointer"
              checked={isDailyChecked}
              onChange={() => {
                setIsDailyChecked(!isDailyChecked);
              }}
            />
          </Button>
          <DatePicker
            value={value}
            // onChange={setValue}
            isDisabled={isDailyChecked}
            classNames={{
              base: "size-10 w-fit",
              selectorIcon: "size-7",
              selectorButton: "!size-10 m-0",
            }}
            size="md"
            dateInputClassNames={{
              input: "hidden",
              inputWrapper: "bg-transparent hover:!bg-transparent px-0",
            }}
            timeInputProps={{ radius: "full" }}
          /> */}
          <Button
            isIconOnly
            className="bg-primary"
            radius="full"
            size="md"
            onClick={addTaskButton}>
            <svg
              fill="currentColor"
              className="size-5 text-white"
              viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TaskInput;

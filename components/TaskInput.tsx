"use client";
import { createTask } from "@/lib/actions/task.actions";
import { Button } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";

const TaskInput = () => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const taskInput = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  async function handleAddTask() {
    if (!name) return;
    const createAction = await createTask(name);
    if (createAction) {
      router.refresh();
    }
    // Clear input
    taskInput.current!.value = "";
    setName("");
  }

  return (
    <section className="w-full min-h-14 flex items-center justify-center mb-4 z-50">
      <div className="w-2/5 h-full flex items-center relative border-secondary border-2 rounded-full">
        <input
          type="text"
          className="size-full border-none outline-none rounded-full indent-5 text-lg"
          ref={taskInput}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="New task..."
        />
        <div className="flex absolute right-2 gap-1">
          <Button
            isIconOnly
            className="bg-primary"
            radius="full"
            size="md"
            onClick={handleAddTask}>
            <svg
              fill="currentColor"
              className="size-6 text-secondary"
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

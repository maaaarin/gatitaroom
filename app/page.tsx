import Image from "next/image";
import TasksContainer from "@/components/TasksContainer";
import { Task, TaskStatus } from "@/types";
"@internationalized/date";
import TaskInput from "@/components/TaskInput";
import Welcome from "@/components/Welcome";
import { getAllTasks } from "@/lib/actions/task.actions";

export const dynamic = "force-dynamic";

const Home = async () => {

  const tasks = await getAllTasks();
  // const tasks: TaskStatus[] = [
  //   {
  //     "status": "pending",
  //     "tasks": []
  //   },
  //   {
  //     "status": "ongoing",
  //     "tasks": []
  //   },
  //   {
  //     "status": "done",
  //     "tasks": []
  //   }
  // ];
  {if (tasks) {
  return (
    <div className="w-full h-screen flex flex-col py-4 px-8">
      <TaskInput></TaskInput>
      <div className="flex-auto h-[calc(100%-5rem)] flex gap-4 z-50 relative">
        <TasksContainer tasksInit={tasks}></TasksContainer>
        <section className="w-3/12 flex flex-col gap-4">
          <div className="w-full h-40 relative flex items-center justify-center text-center px-5 ">
            <div className="size-full absolute bg-secondary shape-border"></div>
            <div className="size-[98.5%] absolute bg-white shape "></div>
            <p className="relative z-10">
              Take a catnap when you need it, but never lose sight of the hunt
              for your dreams!
            </p>
            <Image
              src="/assets/hearts.svg"
              alt="alt"
              width={50}
              height={50}
              className="absolute top-0 right-0"
            />
            <Image
              src="/assets/excited.png"
              alt="alt"
              width={70}
              height={70}
              className="absolute -bottom-5 left-0"
            />
          </div>
          <div className="flex-auto bg-white rounded-2xl flex flex-col items-center justify-center gap-3 relative border-secondary border-2">
            <Image
              src="/assets/gatito.png"
              alt="alt"
              width={100}
              height={100}
            />
            <span>Available soon!</span>
            <Image
              src="/assets/star_1.svg"
              alt="alt"
              width={70}
              height={70}
              className="absolute -bottom-2 -left-5"
            />
          </div>
        </section>
      </div>
      <Welcome></Welcome>
      <Image
        src="/assets/bg-deco.svg"
        alt="alt"
        width={0}
        height={0}
        className="w-full fixed left-0 bottom-0"
      />

    </div>
  )}
}
};

export default Home;

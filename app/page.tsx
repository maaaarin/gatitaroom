import Image from "next/image";
import TasksContainer from "@/components/TasksContainer";
"@internationalized/date";
import TaskInput from "@/components/TaskInput";
import Welcome from "@/components/Welcome";
import { getAllTasks } from "@/lib/actions/task.actions";
import CalendarContainer from "@/components/CalendarContainer";

export const dynamic = "force-dynamic";

const Home = async () => {

  const tasks = await getAllTasks();

  {if (tasks) {
  return (
    <div className="w-full h-screen flex flex-col py-4 px-8">
      <TaskInput></TaskInput>
      <div className="w-full h-[calc(100%-5rem)] flex gap-4 z-50 relative">
        <section className="w-1/5 h-full">
        </section>
        <section className="w-3/5 h-full">
          <TasksContainer tasksInit={tasks}></TasksContainer>
        </section>
        <section className="w-1/5 h-full">
          <CalendarContainer/>
        </section>
        {/* <section className="w-3/12 flex flex-col gap-4">
          <div className="flex-shrink bg-white rounded-2xl flex flex-col items-center justify-center gap-3 relative border-secondary border-2">
            <Image
              src="/assets/star_1.svg"
              alt="alt"
              width={70}
              height={70}
              className="absolute -bottom-4 -left-5"
            />
          </div>
        </section> */}
      </div>
      <Welcome></Welcome>
      <Image
        src="/assets/bg-deco.svg"
        alt="alt"
        width={0}
        height={0}
        className="w-full fixed left-0 bottom-0"
      />
      <Image
        src="/assets/hw_tree.webp"
        alt="alt"
        width={1250}
        height={1250}
        className="fixed -right-12 -bottom-28 pointer-events-none"
      />
        <Image
        src="/assets/bats.webp"
        alt="alt"
        width={360}
        height={360}
        className="fixed left-12 top-16 z-10"
        />
      <Image
        src="/assets/moon.webp"
        alt="alt"
        width={350}
        height={0}
        className="fixed left-5 top-5"
      />
    </div>
  )}
}
};

export default Home;

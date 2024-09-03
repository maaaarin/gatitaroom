import Image from "next/image";
import { getAllTasks } from "@/lib/actions/task.actions";
import TasksContainer from "@/components/TasksContainer";
import Welcome from "@/components/Welcome";
export const dynamic = 'force-dynamic';

const Home = async () => {
  const tasks = await getAllTasks();

  return (
    <>
      <Welcome></Welcome>
      <Image
        src="/assets/bg-deco.svg"
        alt="alt"
        width={0}
        height={0}
        className="w-screen  absolute bottom-0"
      />
      <main className="w-full h-screen max-h-screen flex justify-end items-center flex-col relative">
        <div className="flex flex-col items-center text-black py-12 relative">
          <h1 className="text-4xl">Gatita's Room</h1>
          <h3 className="text-2xl">My petit chat</h3>
          <Image
            src="/assets/cute.png"
            alt="alt"
            width={50}
            height={50}
            className="absolute -right-16 rotate-6"
          />
        </div>
        <TasksContainer tasks={tasks}></TasksContainer>
      </main>
    </>
  );
};

export default Home;

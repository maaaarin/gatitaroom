import Image from "next/image";
import TasksContainer from "@/components/TasksContainer";
import TaskInput from "@/components/TaskInput";
import AsideRight from "@/components/AsideRight";
import { getAllTasks } from "@/lib/actions/task.actions";
import { getAllEvents } from "@/lib/actions/events.actions";
import { getAllStates } from "@/lib/actions/states.actions";
import Intro from "@/components/Intro";
import { getAllInteractions } from "@/lib/actions/interactions.action";

export const dynamic = "force-dynamic";

const Home = async () => {

  const tasks = await getAllTasks();
  const events = await getAllEvents();
  const states = await getAllStates();
  const interactions = await getAllInteractions();

  {if (tasks) {
  return (
    <div className="w-full h-screen flex flex-col py-4 px-8">
      <TaskInput></TaskInput>
      <div className="w-full h-[calc(100%-5rem)] flex justify-center gap-3 z-50 relative">
        <section className="w-1/5 h-full">
        </section>
        <section className="w-2/5 h-full">
          <TasksContainer  states={states} tasks={tasks} ></TasksContainer>
        </section>
        <section className="w-1/5 h-full flex flex-col gap-3">
          <AsideRight events={events}/>
        </section>
      </div>
      <Intro interactions={interactions}/>
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

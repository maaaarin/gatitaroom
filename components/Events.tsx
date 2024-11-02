import { Button, Input } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { CalendarDate } from "@internationalized/date";
import { format, isToday } from 'date-fns';
import { createEvent, deleteEvent } from '@/lib/actions/events.actions';
import { useRouter } from 'next/navigation';
import { Event } from '@/types';
import { createTask } from '@/lib/actions/task.actions';

type Props = {
    date: CalendarDate,
    events: Event[]
}

const Events = ({ date, events }: Props) => {
    const router = useRouter();

    const [loaded, setLoaded] = React.useState(false);
    const [name, setName] = React.useState('');
    const [isNewEvent, setIsNewEvent] = React.useState(false);
    const [sortedEvents, setSortedEvents] = React.useState<Event[]>([]);
    const [processedTodayEvents, setProcessedTodayEvents] = React.useState(false);

    useEffect(() => {
        // Process today events
        if (!processedTodayEvents) {
            todayEvents();
            setProcessedTodayEvents(true);
        }
        // Sort events by date
        const sortEvents = events.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setSortedEvents(sortEvents);
    }, [events]);


    useEffect(() => {
        if (loaded) {
            setIsNewEvent(true);
        }
        setLoaded(true);
    }, [date]);

    // Delete Event
    async function handleDeleteEvent(e: Event) {
        const removedEvent = await deleteEvent(e._id!);
        if (removedEvent) {
            router.refresh();
        }
    }

    // Add Event
    async function handleAddEvent() {
        if (!name || !date) return;
        const selectedDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
        selectedDate.setHours(23, 59, 59);
        // Create task or event
        const isTodayEvent = isToday(selectedDate);
        const createAction = isTodayEvent ? createTask(name, "event") : createEvent({ name, date: selectedDate });
        const createdItem = await createAction;
        if (createdItem) {
            setIsNewEvent(false);
            router.refresh();
        }
    }

    // Today Events
    async function todayEvents() {
        const filteredTodayEvents = events.filter((event) => isToday(new Date(event.date)));
        const createdTasks = await Promise.all(
            filteredTodayEvents.map(async (event) => {
                return Promise.all([
                    createTask(event.name, "event"),
                    deleteEvent(event._id!)
                ]);
            })
        );
        if (createdTasks.length > 0) {
            router.refresh();
        }
    }


    return (
        <aside className="w-full bg-white flex flex-1 flex-col overflow-hidden gap-2 rounded-3xl border-secondary border-2 p-5 relative">
            <div className="w-full flex justify-between">
                <h2 className="text-lg text-primary">Events</h2>
                {!isNewEvent &&
                    <Button isIconOnly className='bg-primary rounded-full w-fit px-5' size='sm' onClick={() => { setIsNewEvent(true) }}>
                        <svg
                            fill="currentColor"
                            className="size-5 text-secondary"
                            viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                            />
                        </svg>
                    </Button>
                }
            </div>
            <div className="size-full flex overflow-hidden flex-col gap-2">
                {isNewEvent &&
                    <div className="w-full h-auto rounded-2xl p-4 flex flex-col justify-between border-primary border-2 gap-4">
                        <Input type="text" required variant={"bordered"} label="Name" value={name} classNames={{
                            label: "text-primary",
                            inputWrapper: 'border-primary/40 group-data-[focus=true]:border-primary',
                        }} onValueChange={setName} />
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <svg className="text-primary size-5" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
                                    </svg>
                                    <span className="text-primary">{format(new Date(date.year, date.month - 1, date.day), 'd MMM. yyyy')}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Button onClick={() => { setIsNewEvent(false) }} isIconOnly className="bg-transparent min-w-fit w-fit h-fit" radius="none">
                                        <svg className="text-primary size-4" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                        </svg>
                                    </Button>
                                    <Button isIconOnly className='bg-primary rounded-full w-fit' size='sm' onClick={handleAddEvent}>
                                        <svg
                                            fill="currentColor"
                                            className="size-5 text-secondary"
                                            viewBox="0 0 16 16">
                                            <path
                                                fillRule="evenodd"
                                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                                            />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {sortedEvents.map((event: Event, index: number) => {
                    return (
                        <div key={index} className="w-full h-auto rounded-2xl bg-primary p-4 flex flex-col justify-between gap-6 group">
                            <span className="text-secondary">{event.name}</span>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <svg className="text-secondary size-5" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
                                    </svg>
                                    <span className="text-secondary">{format((event.date), 'd MMM. yyyy')}</span>
                                </div>
                                <Button isIconOnly className="bg-transparent min-w-fit w-fit h-fit opacity-0 group-hover:opacity-100" radius="none" onClick={() => { handleDeleteEvent(event) }}>
                                    <svg className="text-secondary size-5" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    )
                }
                )}
            </div>
            <div className="w-full h-1/3 absolute left-0 bottom-0 bg-gradient-to-t from-white z-50 rounded-b-3xl flex  items-end justify-center pb-10">
                {/* <div className="size-8 rounded-full bg-primary grid place-content-center cursor-pointer">
                    <svg fill="currentColor" className="size-6 text-white" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5" />
                    </svg>
                </div> */}
            </div>
        </aside>
    )
}

export default Events
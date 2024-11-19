"use client"
import {
    Button,
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectItem,
    DatePicker,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { format, isToday, setDate } from "date-fns";
import { createEvent, deleteEvent } from "@/lib/actions/events.actions";
import { useRouter } from "next/navigation";
import { Event } from "@/types";
import { createTask } from "@/lib/actions/task.actions";
import Image from "next/image";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";

type Props = {
    events: Event[];
};

const colors = [
    {
        name: "Rose",
        color: "#FD0F76",
    },
    {
        name: "Malachite",
        color: "#25D952",
    },
    {
        name: "Cornflower Blue",
        color: "#576EF2",
    },
    {
        name: "Corn",
        color: "#F2CB05",
    },
    {
        name: "Grape",
        color: "#3C1F5C",
    },
];

const stickers = [
    {
        name: "Mad",
        path: "/assets/cat/mad.svg",
    },
    {
        name: "Sad",
        path: "/assets/cat/sad.svg",
    },
    {
        name: "Annoyed",
        path: "/assets/cat/annoyed.svg",
    },
    {
        name: "Cry",
        path: "/assets/cat/cry.svg",
    },
    {
        name: "Huh",
        path: "/assets/cat/huh.svg",
    },
    {
        name: "Hehe",
        path: "/assets/cat/hehe.svg",
    },
    {
        name: "Cute",
        path: "/assets/cat/cute.svg",
    },
    {
        name: "Angel",
        path: "/assets/cat/angel.svg",
    },
    {
        name: "Worried",
        path: "/assets/cat/worried.svg",
    },
    {
        name: "Heart",
        path: "/assets/cat/heart.svg",
    },
    {
        name: "Study",
        path: "/assets/cat/study.svg",
    },
    {
        name: "Time",
        path: "/assets/cat/time.svg",
    },
];

const Events = ({ events }: Props) => {
    const router = useRouter();
    const [name, setName] = React.useState("");
    const [date, setDate] = React.useState(today(getLocalTimeZone()));
    const [color, setColor] = React.useState<any>(new Set(["Grape"]));
    const [sticker, setSticker] = React.useState("");
    const [isStickerSelected, setIsStickerSelected] = React.useState(false);
    const [isNewEvent, setIsNewEvent] = React.useState(false);
    const [sortedEvents, setSortedEvents] = React.useState<Event[]>([]);
    const [loaded, setLoaded] = React.useState(false);
    const [processedTodayEvents, setProcessedTodayEvents] = React.useState(false);

    // Sort events by date
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

    // New event bug fix on reload
    useEffect(() => {
        if (loaded) {
            setIsNewEvent(true);
        }
        setLoaded(true);
    }, [date]);

    function handleSelectSticker(newSticker: string) {
        if (newSticker != sticker) {
            setIsStickerSelected(false);
            setSticker(newSticker);
            return;
        }
        setSticker("");
        setIsStickerSelected(false);
    }

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
        const selectedDate = new Date(
            Date.UTC(date.year, date.month - 1, date.day)
        );
        selectedDate.setHours(23, 59, 59);
        // Create task or event
        const isTodayEvent = isToday(selectedDate);
        const createAction = isTodayEvent
            ? createTask(name, "event")
            : createEvent({
                name,
                date: selectedDate,
                color: [...color][0],
                sticker: sticker,
            });
        const createdItem = await createAction;
        if (createdItem) {
            setIsNewEvent(false);
            setName("");
            setSticker("");
            setIsStickerSelected(false);
            setColor(new Set(["Grape"]));
            router.refresh();
        }
    }

    // Today Events
    async function todayEvents() {
        const filteredTodayEvents = events.filter((event) =>
            isToday(new Date(event.date))
        );
        const createdTasks = await Promise.all(
            filteredTodayEvents.map(async (event) => {
                return Promise.all([
                    createTask(event.name, "event"),
                    deleteEvent(event._id!),
                ]);
            })
        );
        if (createdTasks.length > 0) {
            router.refresh();
        }
    }

    return (
        <aside className="w-full h-4/5 bg-white flex flex-col justify-center items-center gap-2 rounded-3xl border-primary-dark border-2 p-5 relative">
            <div className="w-full flex justify-center items-center absolute -bottom-7 z-50">
                <div className="w-auto flex items-center relative">
                    <div className="size-14 bg-secondary border-primary-dark border-2 rounded-full grid place-items-center">
                        <svg
                            viewBox="0 0 100 100"
                            fill="currentColor"
                            className="size-7 text-primary"
                        >
                            <g>
                                <path d="M84.6,9.5h-4.2l-1.2,4.4c-1,4-4.9,7-8.9,7c-2.2,0-4.3-0.9-5.5-2.6c-1.3-1.7-1.7-4-1.1-6.2l0.7-2.6H50.9l-1.2,4.4     c-1.1,4-4.9,7-9,7c-2.2,0-4.2-0.9-5.5-2.6c-1.3-1.7-1.7-4-1.1-6.2l0.7-2.6h-4.4c-6.7,0-13.4,5.2-15.1,11.9L2.9,67.1     c-1,3.6-0.4,7.2,1.7,9.8c2,2.6,5.1,4.1,8.6,4.1h6.1v2.7c0,7.1,5.8,12.9,12.9,12.9h52.4c7.1,0,12.9-5.8,12.9-12.9V22.4     C97.5,15.3,91.7,9.5,84.6,9.5z M13.3,73.2c-0.8,0-1.8-0.2-2.4-1c-0.6-0.7-0.7-1.8-0.3-3l10.2-38.2h62.2l-9.7,36.2     c-0.9,3.3-4.4,6.1-7.6,6.1H13.3z M89.7,83.7c0,2.8-2.3,5.1-5.1,5.1H32.3c-2.8,0-5.1-2.3-5.1-5.1V81h38.5     c6.7,0,13.4-5.2,15.1-11.9L89.7,36V83.7z" />
                                <path d="M40.7,17.3c2.4,0,4.8-1.9,5.4-4.3l1.4-5.3c0.6-2.4-0.8-4.3-3.1-4.3c-2.4,0-4.8,1.9-5.4,4.3L37.6,13     C37,15.3,38.4,17.3,40.7,17.3z" />
                                <path d="M70.3,17.3c2.4,0,4.8-1.9,5.4-4.3l1.4-5.3c0.6-2.4-0.8-4.3-3.1-4.3c-2.4,0-4.8,1.9-5.4,4.3L67.1,13     C66.5,15.3,67.9,17.3,70.3,17.3z" />
                                <path d="M50.2,54.5h-9.3c-0.6,0-1.3,0.5-1.5,1.1l-1.8,6.8c-0.2,0.6,0.2,1.1,0.8,1.1h9.3c0.6,0,1.3-0.5,1.5-1.1l1.8-6.8     C51.2,55,50.8,54.5,50.2,54.5z" />
                                <path d="M33.8,54.5h-9.3c-0.6,0-1.3,0.5-1.5,1.1l-1.8,6.8c-0.2,0.6,0.2,1.1,0.8,1.1h9.3c0.6,0,1.3-0.5,1.5-1.1l1.8-6.8     C34.8,55,34.5,54.5,33.8,54.5z" />
                                <path d="M66.6,54.5h-9.3c-0.6,0-1.3,0.5-1.5,1.1L54,62.4c-0.2,0.6,0.2,1.1,0.8,1.1h9.3c0.6,0,1.3-0.5,1.5-1.1l1.8-6.8     C67.6,55,67.2,54.5,66.6,54.5z" />
                                <path d="M54,40.2h-9.3c-0.6,0-1.3,0.5-1.5,1.1l-1.8,6.8c-0.2,0.6,0.2,1.1,0.8,1.1h9.3c0.6,0,1.3-0.5,1.5-1.1l1.8-6.8     C55,40.7,54.7,40.2,54,40.2z" />
                                <path d="M37.7,40.2h-9.3c-0.6,0-1.3,0.5-1.5,1.1l-1.8,6.8c-0.2,0.6,0.2,1.1,0.8,1.1h9.3c0.6,0,1.3-0.5,1.5-1.1l1.8-6.8     C38.7,40.7,38.3,40.2,37.7,40.2z" />
                                <path d="M58.7,49.3H68c0.6,0,1.3-0.5,1.5-1.1l1.8-6.8c0.2-0.6-0.2-1.1-0.8-1.1h-9.3c-0.6,0-1.3,0.5-1.5,1.1l-1.8,6.8     C57.7,48.7,58,49.3,58.7,49.3z" />
                            </g>
                        </svg>
                    </div>
                    {!isNewEvent && (
                        <Button
                            isIconOnly
                            className="bg-primary rounded-full border-primary-dark border-2 absolute left-16"
                            size="md"
                            onClick={() => {
                                setIsNewEvent(true);
                            }}>
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
                    )}
                </div>
            </div>
            <div className="size-full flex overflow-hidden flex-col gap-2">
                {isNewEvent && (
                    <div className="w-full h-auto rounded-2xl p-4 flex flex-col justify-between border-primary border-2 gap-4">
                        <Input
                            type="text"
                            required
                            variant={"bordered"}
                            label="Name"
                            value={name}
                            classNames={{
                                label: "text-primary",
                                inputWrapper:
                                    "border-primary/40 group-data-[focus=true]:border-primary",
                            }}
                            onValueChange={setName}
                        />
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <DatePicker
                                        className="max-w-[284px]"
                                        value={date}
                                        onChange={setDate}
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        onClick={() => {
                                            setIsNewEvent(false);
                                        }}
                                        isIconOnly
                                        className="bg-transparent min-w-fit w-fit h-fit"
                                        radius="none">
                                        <svg
                                            className="text-primary size-4"
                                            fill="currentColor"
                                            viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                        </svg>
                                    </Button>
                                    <Popover
                                        placement="bottom"
                                        showArrow={true}
                                        isOpen={isStickerSelected}
                                        onOpenChange={(open) => setIsStickerSelected(open)}>
                                        <PopoverTrigger>
                                            <Button
                                                isIconOnly
                                                className="bg-transparent min-w-fit w-fit h-fit relative"
                                                radius="none">
                                                {sticker && (
                                                    <div className="size-2 bg-primary rounded-full absolute top-0 right-0"></div>
                                                )}
                                                <svg className="size-5" fill="none" viewBox="0 0 24 24">
                                                    <path
                                                        d="M21.93 12.86C21.91 13.05 21.88 13.23 21.83 13.41C20.79 12.53 19.44 12 17.97 12C14.66 12 11.97 14.69 11.97 18C11.97 19.47 12.5 20.82 13.38 21.86C13.2 21.91 13.02 21.94 12.83 21.96C11.98 22.04 11.11 22 10.21 21.85C6.09999 21.15 2.78999 17.82 2.10999 13.7C0.97999 6.85002 6.81999 1.01002 13.67 2.14002C17.79 2.82002 21.12 6.13002 21.82 10.24C21.97 11.14 22.01 12.01 21.93 12.86Z"
                                                        stroke="#292D32"
                                                        stroke-width="1.5"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                    <path
                                                        d="M21.83 13.41C21.69 13.9 21.43 14.34 21.06 14.71L14.68 21.09C14.31 21.46 13.87 21.72 13.38 21.86C12.5 20.82 11.97 19.47 11.97 18C11.97 14.69 14.66 12 17.97 12C19.44 12 20.79 12.53 21.83 13.41Z"
                                                        stroke="#292D32"
                                                        stroke-width="1.5"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="grid grid-cols-3 py-2 gap-y-2 max-h-40 overflow-y-auto">
                                                {stickers.map((sticker, index) => (
                                                    <Button
                                                        key={index}
                                                        className="h-min bg-transparent"
                                                        size="lg"
                                                        onClick={() => handleSelectSticker(sticker.name)}>
                                                        <Image
                                                            src={sticker.path}
                                                            alt="alt"
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </Button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <Select
                                        items={colors}
                                        classNames={{
                                            trigger: "w-fit p-1",
                                            innerWrapper: "w-fit",
                                            selectorIcon: "hidden",
                                            listbox: "w-fit p-0 gap-2",
                                        }}
                                        renderValue={(items) => {
                                            return items.map((item: any, index) => (
                                                <div
                                                    key={index}
                                                    className="size-5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.rendered.props.style.backgroundColor ||
                                                            "black",
                                                    }}></div>
                                            ));
                                        }}
                                        size="sm"
                                        radius="full"
                                        selectedKeys={color}
                                        onSelectionChange={setColor}
                                        disallowEmptySelection>
                                        {colors.map((color) => (
                                            <SelectItem
                                                key={color.name}
                                                hideSelectedIcon
                                                classNames={{
                                                    base: "p-0",
                                                }}>
                                                <div
                                                    className="size-5 rounded-full"
                                                    style={{ backgroundColor: color.color }}></div>
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Button
                                        isIconOnly
                                        className="bg-primary rounded-full w-fit"
                                        size="sm"
                                        onClick={handleAddEvent}>
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
                )}
                <div className="w-full flex flex-col gap-2 overflow-y-auto">
                    {sortedEvents.map((event: Event, index: number) => {
                        const hasColor = colors.find((a) => a.name === event.color);
                        const borderColor = hasColor ? hasColor.color : "";
                        const backgroundColor = hasColor
                            ? `${hasColor.color}20`
                            : "transparent";
                        return (
                            <div
                                key={index}
                                className="w-full h-auto rounded-2xl p-4 flex flex-col justify-between gap-6 group border-4 relative z-10"
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: backgroundColor,
                                }}>
                                <span className="text-primary font-bold">{event.name}</span>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="text-primary size-5"
                                            fill="currentColor"
                                            viewBox="0 0 16 16">
                                            <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                        <span className="text-primary">
                                            {format(event.date, "d MMM. yyyy")}
                                        </span>
                                    </div>
                                    <Button
                                        isIconOnly
                                        className="bg-transparent min-w-fit w-fit h-fit opacity-0 group-hover:opacity-100"
                                        radius="none"
                                        onClick={() => {
                                            handleDeleteEvent(event);
                                        }}>
                                        <svg
                                            className="text-primary size-5"
                                            fill="currentColor"
                                            viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                        </svg>
                                    </Button>
                                </div>
                                {event.sticker && (
                                    <div className="size-full absolute inset-0 overflow-hidden -z-10">
                                        <Image
                                            className="absolute right-5 -bottom-2"
                                            src={
                                                stickers.find(
                                                    (sticker) => sticker.name === event.sticker
                                                )?.path || ""
                                            }
                                            alt=""
                                            width={80}
                                            height={80}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full h-2/5 absolute bottom-0 bg-gradient-to-t from-white rounded-b-3xl pointer-events-none ">
            </div>
        </aside>
    );
};

export default Events;

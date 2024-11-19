"use client";
import { addGrocery, createGroceryList, removeGrocery, removeGroceryList } from "@/lib/actions/groceries.actions";
import { Grocery, GroceryList } from "@/types";
import { Accordion, AccordionItem, Button, Chip, Input } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect } from "react";

const initialGroceries = [
    {
        name: "Fruits",
        items: [
            { name: "Apple", amount: 6 },
            { name: "Banana", amount: 12 },
            { name: "Orange", amount: 8 },
            { name: "Strawberries", amount: 2 },
        ],
    },
    {
        name: "Vegetables",
        items: [
            { name: "Carrot", amount: 10 },
            { name: "Broccoli", amount: 3 },
            { name: "Spinach", amount: 5 },
        ],
    },
    {
        name: "Dairy",
        items: [
            { name: "Milk", amount: 2 },
            { name: "Cheese", amount: 1 },
            { name: "Yogurt", amount: 6 },
            { name: "Butter", amount: 1 },
        ],
    },
    {
        name: "Bakery",
        items: [
            { name: "Bread", amount: 1 },
            { name: "Bagels", amount: 4 },
            { name: "Croissant", amount: 2 },
        ],
    },
    {
        name: "Snacks",
        items: [
            { name: "Chips", amount: 3 },
            { name: "Cookies", amount: 2 },
            { name: "Granola Bars", amount: 8 },
            { name: "Popcorn", amount: 1 },
            { name: "Nuts", amount: 7 },
        ],
    },
];

type Props = {
    groceries: GroceryList[];
};

const Groceries = ({ groceries }: Props) => {
    const [listName, setListName] = React.useState("");
    const [groceryName, setGroceryName] = React.useState("");
    const [groceryAmount, setGroceryAmount] = React.useState("1");
    const [isNewList, setIsNewList] = React.useState(false);
    const [myGroceries, setMyGroceries] = React.useState(groceries);
    const [isNewGroceryIndex, setIsNewGroceryIndex] = React.useState<number | null>(null);

    useEffect(() => {
        setMyGroceries(groceries);
        console.log(groceries);
    }, [groceries]);

    async function handleClose (list: GroceryList, groceryToRemove: Grocery) {
        let newGroceries = myGroceries.map((groceryList) => {
            if (groceryList.name === list.name) {
                return {
                    ...groceryList,
                    items: groceryList.items.filter(
                        (grocery) => grocery.name !== groceryToRemove.name
                    ),
                };
            }
            return groceryList;
        });
        setMyGroceries(newGroceries);
        console.log(groceryToRemove);

        // Update database
        await removeGrocery(list, groceryToRemove);
    };

    async function handleAddGroceryList() {
        if (!setListName) {
            return;
        }
        let newGroceries = [
            ...myGroceries,
            {
                name: listName,
                items: [],
            },
        ];
        setMyGroceries(newGroceries);
        setListName("");
        setIsNewList(false);

        // Update database
        await createGroceryList(listName);
    }

    async function handleRemoveGroceryList(listToRemove: GroceryList) {
        let newGroceries = myGroceries.filter(
            (groceryList) => groceryList.name !== listToRemove.name
        );
        setMyGroceries(newGroceries);

        // Update database
        await removeGroceryList(listToRemove);
    }

    async function handleAddGrocery(list: GroceryList) {
        if (!groceryName) {
            return;
        }

        const newGrocery = { name: groceryName, amount: parseInt(groceryAmount) };

        let newGroceries = myGroceries.map((groceryList) => {
            if (groceryList.name === list.name) {
                return {
                    ...groceryList,
                    items: [
                        ...groceryList.items,
                        newGrocery,
                    ],
                };
            }
            return groceryList;
        });

        setMyGroceries(newGroceries);
        setGroceryName("");
        setGroceryAmount("1");
        setIsNewGroceryIndex(null);

        // Update database
        await addGrocery(list, newGrocery);
    }

    return (
        <aside className="w-full h-2/4 bg-white flex flex-col justify-center items-center gap-2 rounded-3xl border-primary-dark border-2 p-4 relative">
            <div className="w-full flex justify-center items-center absolute -bottom-7 z-50">
                <div className="w-auto flex items-center relative">
                    <div className="size-14 bg-secondary border-primary-dark border-2 rounded-full grid place-items-center">
                        <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="size-7 text-primary">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                        </svg>
                    </div>
                    {!isNewList && (
                        <Button
                            isIconOnly
                            className="bg-primary rounded-full border-primary-dark border-2 absolute left-16"
                            size="md"
                            onClick={() => {
                                setIsNewList(true);
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
            <div className="size-full flex overflow-hidden flex-col gap-2 relative">
                {isNewList && (
                    <div className="w-full min-h-12 flex items-center relative border-secondary border-2 rounded-full">
                        <input
                            type="text"
                            className="size-full border-none outline-none rounded-full indent-5 text-base"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGroceryList()}
                            placeholder="Name"
                        />
                        <div className="flex absolute items-center right-2 gap-2">
                            <Button
                                onClick={() => {
                                    setIsNewList(false);
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
                            <Button
                                isIconOnly
                                className="bg-primary"
                                radius="full"
                                size="sm"
                                onClick={handleAddGroceryList}>
                                <svg
                                    fill="currentColor"
                                    className="size-4 text-secondary"
                                    viewBox="0 0 16 16">
                                    <path
                                        fillRule="evenodd"
                                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                                    />
                                </svg>
                            </Button>
                        </div>
                    </div>
                )}
                {!myGroceries.length &&
                    <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center text-primary pointer-events-none">
                        <Image src="/assets/cat/list.png" alt="alt" width={100} height={100} />
                        <span>No groceries... Grrr...</span>
                    </div>
                }
                <div className="w-full h-full flex flex-col gap-2 overflow-y-auto">
                    <Accordion selectionMode="multiple" showDivider={false} >
                        {/* Grocery Lists */}
                        {myGroceries.map((list, index) => (
                            <AccordionItem
                                key={index}
                                title={list.name}
                                classNames={{
                                    title: "text-primary text-base",
                                    content: "flex gap-1 flex-wrap pt-0",
                                    trigger: "py-2",
                                    base: "relative"
                                }}>
                                {/* Remove List / Add Grocery / Indicator */}
                                {isNewGroceryIndex !== index &&
                                    <div className="w-auto h-6 flex items-center absolute top-0 my-2 right-6 ">
                                        {/* Remove List */}
                                        <Button
                                            isIconOnly
                                            className="h-fit bg-transparent size-4 "
                                            radius="full"
                                            size="sm"
                                            onClick={() => { handleRemoveGroceryList(list) }}>
                                            <svg className="size-4 text-default-400" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                            </svg>
                                        </Button>
                                        {/* Add Grocery */}
                                        <Button
                                            isIconOnly
                                            className="h-fit bg-transparent size-4 "
                                            radius="full"
                                            size="sm"
                                            onClick={() => { setIsNewGroceryIndex(index) }}>
                                            <svg
                                                fill="currentColor"
                                                className="size-4 text-default-400"
                                                viewBox="0 0 16 16">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                                                />
                                            </svg>
                                        </Button>
                                    </div>
                                }
                                {/* Add Grocery Form */}
                                {isNewGroceryIndex === index && (
                                    <div className="w-full h-auto rounded-2xl p-4 flex flex-col justify-between border-primary border-2 gap-2 mb-2">
                                        <Input
                                            type="text"
                                            required
                                            variant={"bordered"}
                                            label="Name"
                                            value={groceryName}
                                            classNames={{
                                                label: "text-primary",
                                                inputWrapper:
                                                    "border-primary/40 group-data-[focus=true]:border-primary",
                                            }}
                                            onValueChange={setGroceryName}
                                        />
                                        <div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        required
                                                        variant={"bordered"}
                                                        min={1}
                                                        max={99}
                                                        value={groceryAmount}
                                                        endContent={
                                                            <div className="pointer-events-none flex items-center">
                                                                <span className="text-default-400 text-small">#</span>
                                                            </div>
                                                        }
                                                        classNames={{
                                                            label: "text-primary",
                                                            inputWrapper:
                                                                "border-primary/40 group-data-[focus=true]:border-primary",
                                                            base: "pr-32"
                                                        }}
                                                        onValueChange={setGroceryAmount}
                                                    />
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Button
                                                        onClick={() => {
                                                            setIsNewGroceryIndex(null);
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
                                                    <Button
                                                        isIconOnly
                                                        className="bg-primary rounded-full w-fit"
                                                        size="sm"
                                                        onClick={() => { handleAddGrocery(list) }}>
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
                                {list.items.map((grocery, index) => (
                                    <Chip
                                        key={index}
                                        startContent={
                                            <div className="size-6 bg-secondary text-primary text-sm grid place-content-center rounded-full">
                                                {grocery.amount}
                                            </div>
                                        }
                                        classNames={{
                                            base: "py-4 gap-1",
                                            closeButton: "text-zinc-500"
                                        }}
                                        onClose={() => handleClose(list, grocery)}
                                        variant="flat">
                                        {grocery.name}
                                    </Chip>
                                ))}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
            <div className="w-full h-2/5 absolute bottom-0 bg-gradient-to-t from-white rounded-b-3xl pointer-events-none "></div>
        </aside>
    );
};

export default Groceries;

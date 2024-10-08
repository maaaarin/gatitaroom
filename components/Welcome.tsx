"use client";
import Image from "next/image";
import React from "react";
import { Button } from "@nextui-org/react";
import { clsx } from "clsx";

const Welcome = () => {
  const [entered, setEntered] = React.useState(false);

  function enteredClick(){
    const audio = new Audio("/assets/welcome_sfx.mp3");
    setEntered(true)
    audio.play();
  }

  return (
    <>
      <div
        className={clsx(
          "w-screen h-screen bg-black fixed z-50 pointer-events-none top-0 left-0",
          {
            test: entered,
          }
        )}></div>
      <div
        className={clsx(
          "w-full h-screen flex flex-col items-center justify-center z-50 fixed gap-3 top-0 left-0",
          {
            hidden: entered,
          }
        )}>
        <div className="w-60 flex items-center justify-center relative">
          <Image
            src="/assets/dialogue.svg"
            alt="alt"
            width={250}
            height={250}
            className="absolute -top-[120%] -right-44"
          />
          <Image src="/assets/gatito.png" alt="alt" width={100} height={100} />
        </div>
        {/* <input type="text" className="w-36 h-10 rounded-full text-center outline-none border-none" placeholder="Password! Grrr"/> */}
        <Button
          className="w-36 bg-secondary rounded-full text-xl text-white"
          onClick={enteredClick}>
          Enter Room
        </Button>
        <span className="text-primary">New update!</span>
      </div>
    </>
  );
};

export default Welcome;

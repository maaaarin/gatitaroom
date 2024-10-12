"use client";
import Image from "next/image";
import React from "react";
import { Button } from "@nextui-org/react";
import { clsx } from "clsx";

const Welcome = () => {
  const [entered, setEntered] = React.useState(false);

  function enteredClick(){
    const audio = new Audio("/assets/audio/spooky_sfx.mp3");
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
            className="absolute -top-[90%] -right-44"
          />
          <Image src="/assets/cat_pumpkins.svg" alt="alt" width={130} height={100} />
        </div>
        {/* <input type="text" className="w-36 h-10 rounded-full text-center outline-none border-none" placeholder="Password! Grrr"/> */}
        <Button
          className="w-36 bg-primary rounded-full text-xl text-white mb-2"
          onClick={enteredClick}>
          Enter Room
        </Button>
        {/* <span className="text-primary">Halloween update!</span> */}
        <Image src="/assets/halloween_text.svg" alt="alt" width={150} height={0} />
      </div>
    </>
  );
};

export default Welcome;

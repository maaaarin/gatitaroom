"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import 'animate.css';
import { Interaction } from '@/types';
import { updateCurrentDialogue } from '@/lib/actions/interactions.action';

// const dialogue = {
//   name: "groceries",
//   dialogues: [
//     {
//       text: "Gata! It's me again! I'm back!",
//       image: "/assets/cat/nature.svg",
//       audio: ["meow_1"]
//     },
//     {
//       text: "This time I want to show you something new!",
//       image: "/assets/cat/happy.svg",
//       audio: []
//     },
//     {
//       text: "You can finally prepare yourself better for groceries!",
//       image: "/assets/cat/groceries.svg",
//       audio: []
//     },
//     {
//       text: "Yes! You heard correctly! Groceries!",
//       image: "/assets/cat/angel.svg",
//       audio: ["meow_2"]
//     },
//     {
//       text: "Now you can create lists, and you will never forget what you need!",
//       image: "/assets/cat/groceries_2.svg",
//       audio: []
//     },
//     {
//       text: "Great, isn't it?",
//       image: "/assets/cat/worried.svg",
//       audio: ["meow_4"]
//     },
//     {
//       text: "Well, I just wanted to show you this. Now I have to go.",
//       image: "/assets/cat/cute.svg",
//       audio: []
//     },
//     {
//       text: "Keep working hard, and remember this:",
//       image: "/assets/cat/normal.svg",
//       audio: []
//     },
//     {
//       text: "I love you.",
//       image: "/assets/cat/kiss_heart.svg",
//       audio: ["meow_2"]
//     },
//   ],
//   currentDialogueIndex: 0,
//   isFinished: false
// }

const audioList = [
  {
    name: "meow_sad",
    root: "/assets/audio/meow_sad.mp3",
    type: "music"
  },
  {
    name: "skip_dialogue",
    root: "/assets/audio/skip_dialogue.mp3",
    type: "sound"
  },
  {
    name: "horn",
    root: "/assets/audio/horn.mp3",
    type: "sound"
  },
  {
    name: "meow_1",
    root: "/assets/audio/meow_1.mp3",
    type: "sound"
  },
  {
    name: "meow_2",
    root: "/assets/audio/meow_2.mp3",
    type: "sound"
  },
  {
    name: "meow_3",
    root: "/assets/audio/meow_3.mp3",
    type: "sound"
  },
  {
    name: "meow_4",
    root: "/assets/audio/meow_4.mp3",
    type: "sound"
  },
  {
    name: "birthday",
    root: "/assets/audio/birthday/background_music.mp3",
    type: "music"
  },
  {
    name: "groceries",
    root: "/assets/audio/groceries/background_music.mp3",
    type: "music"
  }
];

type Props = {
  interactions: Interaction[],
}

const Dialogue = ({interactions}: Props) => {

  const audioMap = useRef<{ [key: string]: HTMLAudioElement }>({});
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);

  // const [interaction, setInteraction] = useState<Interaction>(interactions[0]);
  const [interaction, setInteraction] = useState<Interaction>(interactions[0]);

  useEffect(() => {
    console.log(interactions);
    // Load audio files
    audioList.forEach((audio) => {
      const newAudio = new Audio(audio.root);
      newAudio.loop = audio.type === "music";
      audioMap.current[audio.name] = new Audio(audio.root);
      if (audio.name === interaction.name) {
        backgroundMusic.current = newAudio;
      }
    });

    backgroundMusic.current?.play();

    return () => {
      backgroundMusic.current?.pause();
      backgroundMusic.current!.currentTime = 0;
    };
  }, []);

  function playAudio(name: string) {
    const audio = audioMap.current[name];
    
    if (audio) {
      const isMusic = audioList.find((a) => a.name === name)?.type === "music";

      // Pause background music if another "music" type audio is played
      if (isMusic) {
        backgroundMusic.current?.pause();
        audio.onended = () => {
          backgroundMusic.current?.play();
        };
      }

      audio.currentTime = 0;
      audio.play();
    }
  }

  const [currentDialogueIndex, setCurrentDialogueIndex] = React.useState(interaction.currentDialogueIndex);
  const [currentDialogue, setCurrentDialogue] = React.useState(interaction.dialogues[currentDialogueIndex]);
  const [isFinished, setIsFinished] = React.useState(interaction.isFinished);
  const [canProceed, setCanProceed] = React.useState(false);

  React.useEffect(() => {
    if(interaction != null) {
      setCurrentDialogue(interaction.dialogues[currentDialogueIndex])
      setCanProceed(false);
    }

    const timer = setTimeout(() => {
      setCanProceed(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [currentDialogueIndex]);

  useEffect(() => {
    // Stop previous audio
    if (currentDialogueIndex != 0) {
      let previousDialogue = interaction.dialogues[currentDialogueIndex - 1];
      if (previousDialogue.audio) {
        previousDialogue.audio.forEach(audio => {
          audioMap.current[audio].pause();
          audioMap.current[audio].currentTime = 0;
        });
      }
    }

    // Continue background music
    if (backgroundMusic.current?.paused) {
      backgroundMusic.current?.play();
    }

    // Play audio if has it
    if (currentDialogue.audio) {
      currentDialogue.audio.forEach(audio => playAudio(audio));
    }

  }, [currentDialogue]);

  const handleNextDialogue = async () => {
    if (canProceed) {
      playAudio("skip_dialogue");
      if (currentDialogueIndex < interaction.dialogues.length - 1) {
        setCurrentDialogueIndex(currentDialogueIndex + 1);
      } else {
        setIsFinished(true);
        backgroundMusic.current?.pause();
      }
      await updateCurrentDialogue(currentDialogueIndex + 1, interaction._id!);
    }
  };

  if (isFinished) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={handleNextDialogue}
    >
      <div className="w-1/4 aspect-video text-center flex items-center justify-center text-2xl fixed left-[25%] bottom-[40%] z-40 bg-[url('/assets/dialogue_bubble.svg')] bg-no-repeat bg-contain pl-16 pr-8 pb-8 text-wrap  animate__animated animate__rollIn animate__faster">
        <p>{currentDialogue.text}</p>
      </div>

      <Image
        src={currentDialogue.image}
        alt="alt"
        width={0}
        height={0}
        className="w-1/5 fixed left-[10%] bottom-[5%] z-30"
      />
      {currentDialogue.text.includes("beautiful") &&
        <>
          <Image
            src="/assets/pictures/she_2.webp"
            alt="alt"
            width={800}
            height={800}
            className="w-[12.5%] fixed left-[45%] bottom-[12.5%] z-40 -rotate-12 rounded-3xl border-primary border-4"
          />
          <Image
            src="/assets/pictures/she.webp"
            alt="alt"
            width={800}
            height={800}
            className="w-[12.5%] fixed left-[35%] -bottom-[5%] z-30 rotate-12 rounded-3xl border-primary border-4"
          />
        </>
      }
      <Image
        src="/assets/dialogue_bg.svg"
        alt="alt"
        width={0}
        height={0}
        className="w-2/5 fixed left-0 bottom-0"
      />
    </div>
  );
};

export default Dialogue
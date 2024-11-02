"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import 'animate.css';
import { Interaction } from '@/types';
import { updateCurrentDialogue } from '@/lib/actions/interactions.action';

  // const dialogues = [
  //   {
  //     text: "Bonjour Gatita! It's me, your Marinito, but in an alternative version as a cat.",
  //     image: "/assets/cat/hello.svg",
  //     audio: ["meow_1"]
  //   },
  //   {
  //     text: "Sorry for not introducing myself before. I want to show you your new room!",
  //     image: "/assets/cat/worried.svg",
  //   },
  //   {
  //     text: "Now there will only be two statuses for your tasks.",
  //     image: "/assets/cat/party.svg",
  //   },
  //   {
  //     text: "And there's something else! Now there are events!",
  //     image: "/assets/cat/cheers.svg",
  //     audio: ["meow_3"]
  //   },
  //   {
  //     text: "Yes! You can add events for specific dates.",
  //     image: "/assets/cat/calendar.svg",
  //   },
  //   {
  //     text: "You can select a date from the calendar and add an event.",
  //     image: "/assets/cat/angel.svg",
  //   },
  //   {
  //     text: "You can view all scheduled events for that same day.",
  //     image: "/assets/cat/study.svg",
  //   },
  //   {
  //     text: "And well, now I want to tell you something important.",
  //     image: "/assets/cat/roses.svg",
  //   },
  //   {
  //     text: "Happy birthday!",
  //     image: "/assets/cat/surprise.svg",
  //     audio: ["horn"]
  //   },
  //   {
  //     text: "A little late, I know...",
  //     image: "/assets/cat/depressed.svg",
  //     audio: ["meow_4"]
  //   },
  //   {
  //     text: "Sorry for taking so long; I know it's been disappointing.",
  //     image: "/assets/cat/cry.svg",
  //     audio: ["meow_sad"]
  //   },
  //   {
  //     text: "I want to apologize for that and tell you a few things.",
  //     image: "/assets/cat/sad.svg",
  //     audio: ["meow_2"]
  //   },
  //   {
  //     text: "Thank you for being with me; I'm so glad I found you.",
  //     image: "/assets/cat/cute.svg",
  //   },
  //   {
  //     text: "You've made me happy countless times, relieving my loneliness.",
  //     image: "/assets/cat/heart.svg",
  //   },
  //   {
  //     text: "I feel very lucky to have you in my life.",
  //     image: "/assets/cat/happy.svg",
  //   },
  //   {
  //     text: "I'm not perfect, but I keep trying to be better.",
  //     image: "/assets/cat/sad.svg",
  //   },
  //   {
  //     text: "Thanks again for being here with me.",
  //     image: "/assets/cat/heart_hand.svg",
  //     audio: ["meow_1"]
  //   },
  //   {
  //     text: "I can’t believe I ended up with such a beautiful girl!",
  //     image: "/assets/cat/in_love.svg",
  //   },
  //   {
  //     text: "You are very strong; things have not been easy for you.",
  //     image: "/assets/cat/roses.svg",
  //   },
  //   {
  //     text: "But you still don't give up, and I want you to keep going.",
  //     image: "/assets/cat/cheers.svg",
  //   },
  //   {
  //     text: "That's why I built this site to help you out.",
  //     image: "/assets/cat/worried.svg",
  //   },
  //   {
  //     text: "I'll be here to support you; you'll never be alone.",
  //     image: "/assets/cat/together.svg",
  //   },
  //   {
  //     text: "I love you so much, petit chat.",
  //     image: "/assets/cat/kiss_you.svg",
  //   },
  //   {
  //     text: " Now that's it! Enjoy your new room! ",
  //     image: "/assets/cat/flowers.svg",
  //   },
  //   {
  //     text: "We'll see each other again!",
  //     image: "/assets/cat/hello.svg",
  //   },
  // ];

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
    name: "background_music",
    root: "/assets/audio/background_music.mp3",
    type: "music"
  }
];

type Props = {
  interactions: Interaction[],
}

const Dialogue = ({interactions}: Props) => {

  const audioMap = useRef<{ [key: string]: HTMLAudioElement }>({});
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);

  const [interaction, setInteraction] = useState<Interaction>(interactions[0]);

  useEffect(() => {
    console.log(interactions);
    // Load audio files
    audioList.forEach((audio) => {
      const newAudio = new Audio(audio.root);
      newAudio.loop = audio.type === "music";
      audioMap.current[audio.name] = new Audio(audio.root);
      if (audio.name === "background_music") {
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
    setCurrentDialogue(interactions[0].dialogues[currentDialogueIndex])
    setCanProceed(false);

    const timer = setTimeout(() => {
      setCanProceed(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [currentDialogueIndex]);

  useEffect(() => {
    
    // Stop previous audio
    if (currentDialogueIndex != 0) {
      let previousDialogue = interactions[0].dialogues[currentDialogueIndex - 1];
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
      if (currentDialogueIndex < interactions[0].dialogues.length - 1) {
        setCurrentDialogueIndex(currentDialogueIndex + 1);
      } else {
        setIsFinished(true);
        backgroundMusic.current?.pause();
      }
      await updateCurrentDialogue(currentDialogueIndex + 1, interactions[0]._id!);
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
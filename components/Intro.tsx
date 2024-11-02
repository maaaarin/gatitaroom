"use client"
import React, { useEffect, useState } from 'react'
import Welcome from './Welcome'
import Dialogue from './Dialogue'
import { Interaction } from '@/types'

type Props = {
    interactions: Interaction[],
}

const Intro = ({interactions}: Props) => {

    const [hasEntered, setHasEntered] = useState(false);
    const [showDialogue, setShowDialogue] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (hasEntered) {
            timer = setTimeout(() => {
                setShowDialogue(true);
            }, 2000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [hasEntered]);

    return (
        <>
            <Welcome hasEntered={hasEntered} setHasEntered={setHasEntered} />
            {showDialogue && interactions.length > 0 && <Dialogue interactions={interactions} />}
        </>
    )
}

export default Intro
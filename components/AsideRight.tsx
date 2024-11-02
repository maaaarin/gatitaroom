"use client"
import React from 'react'
import Calendar from './Calendar'
import Events from './Events'
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { Event } from '@/types';

type Props = {
    events: Event[],
  }

const AsideRight = ({ events }: Props) => {

    let [date, setDate] = React.useState(today(getLocalTimeZone()));

    return (
        <>
            <Calendar date={date} setDate={setDate} />
            <Events date={date} events={events} />
        </>
    )
}

export default AsideRight
"use client";
import React from 'react'
import { CalendarDate } from "@internationalized/date";
import { Calendar as CalendarUI } from "@nextui-org/calendar";
import Image from 'next/image';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import ReactDOM from 'react-dom/client';

type Props = {
  date: CalendarDate,
  setDate: any
}

const Calendar = ({date, setDate}: Props) => {

  function selectedDate(date: CalendarDate) {
    console.log(date);

  }

  return (
    <aside className="w-full py-2 bg-white flex rounded-3xl border-secondary border-2 relative">
      <CalendarUI
        defaultValue={date}
        calendarWidth="100%"
        classNames={{
          "base": "shadow-none rounded-3xl !text-primary",
          "title": "text-primary",
        }}
        onFocusChange={selectedDate}
        onChange={setDate} 
      />
      <Image
        src="/assets/lines.svg"
        alt="alt"
        width={40}
        height={40}
        className="absolute -right-3 -top-3 z-50"
      />

    </aside>
  )
}

export default Calendar
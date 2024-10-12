"use client";
import React from 'react'
import {today, getLocalTimeZone} from "@internationalized/date";
import {Calendar} from "@nextui-org/calendar";

const CalendarContainer = () => {
  return (
      <div className="w-full pt-6 bg-white flex rounded-3xl border-secondary border-2">
        <Calendar
          aria-label="Date (Read Only)"
          value={today(getLocalTimeZone())}
          isReadOnly
          calendarWidth="100%"
          classNames={{
            "base": "pb-6 shadow-none",
            "gridHeaderCell": "w-10",
            "cell": "w-10"
          }}
        />
      </div>
  )
}

export default CalendarContainer
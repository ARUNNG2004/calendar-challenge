'use client';

import React, { useState, useEffect } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays,
  isWithinInterval, isAfter, isBefore
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, PenLine } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for clean tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1445220000000-111111111111", // Jan
  "https://images.unsplash.com/photo-1517400508447-f8dd518b86db", // Feb
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa", // Mar
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946", // Apr
  "https://images.unsplash.com/photo-1464047736614-af63643285bf", // May
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // Jun
  "https://images.unsplash.com/photo-1505118380757-91f5f5632de0", // Jul
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a", // Aug
  "https://images.unsplash.com/photo-1508964942454-1a56651d54ac", // Sep
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8", // Oct
  "https://images.unsplash.com/photo-1422207134147-65fb81f59e38", // Nov
  "https://images.unsplash.com/photo-1544273677-c433136021d4", // Dec
];

// Framer Motion variants for page flipping
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export default function WallCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(0);

  // Load notes securely on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('calendar-notes');
      if (saved) setNotes(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to parse notes", e);
    }
  }, []);

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const onDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isBefore(day, startDate)) {
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const monthKey = format(currentDate, 'yyyy-MM');
    const newNotes = { ...notes, [monthKey]: e.target.value };
    setNotes(newNotes);
    localStorage.setItem('calendar-notes', JSON.stringify(newNotes));
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDateGrid;
    let formattedDate = '';

    while (day <= endDateGrid) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;

        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        const isStart = startDate && isSameDay(cloneDay, startDate);
        const isEnd = endDate && isSameDay(cloneDay, endDate);
        const isInRange = startDate && endDate && isWithinInterval(cloneDay, { start: startDate, end: endDate });
        const isHovering = startDate && !endDate && hoverDate && isAfter(cloneDay, startDate) && isBefore(cloneDay, hoverDate);

        days.push(
          <div
            key={cloneDay.toString()}
            className={cn(
              "relative flex items-center justify-center h-10 w-10 text-sm font-medium cursor-pointer transition-colors duration-200",
              !isCurrentMonth && "text-gray-300",
              isCurrentMonth && !isStart && !isEnd && "text-gray-700 hover:bg-gray-100 rounded-full",
              (isInRange || isHovering) && "bg-blue-50 text-blue-800",
              isStart && "bg-[#0ea5e9] text-white rounded-l-full rounded-r-none",
              isEnd && "bg-[#0ea5e9] text-white rounded-r-full rounded-l-none",
              isStart && !endDate && !hoverDate && "rounded-full",
              isStart && isEnd && "rounded-full"
            )}
            onClick={() => onDateClick(cloneDay)}
            onMouseEnter={() => setHoverDate(cloneDay)}
            onMouseLeave={() => setHoverDate(null)}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex justify-between w-full mt-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-3xl w-full relative">

        {/* Spiral Binding Aesthetic */}
        <div className="absolute top-0 w-full h-4 flex justify-around px-8 z-20">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="w-2 h-6 bg-gray-800 rounded-full border-2 border-gray-600 shadow-sm -mt-2"></div>
          ))}
        </div>

        {/* Hero Section */}
        <div className="relative h-64 md:h-80 w-full bg-gray-200 overflow-hidden pt-4">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentDate.getMonth()}
              src={MONTH_IMAGES[currentDate.getMonth()]}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0 object-cover w-full h-full"
              alt="Month Hero"
            />
          </AnimatePresence>

          {/* Geometric Overlay */}
          <div className="absolute inset-0 bg-black/10"></div>
          <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 w-full h-24 md:h-32 text-[#0ea5e9] fill-current z-10">
            <polygon points="0,25 0,10 45,25 60,5 100,25" />
          </svg>

          {/* Month/Year Title */}
          <div className="absolute bottom-4 right-8 z-20 text-white text-right">
            <div className="text-2xl font-light tracking-wide">{format(currentDate, 'yyyy')}</div>
            <div className="text-4xl md:text-5xl font-bold uppercase tracking-widest">{format(currentDate, 'MMMM')}</div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-8 left-8 flex space-x-2 z-20">
            <button onClick={handlePrevMonth} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition">
              <ChevronLeft size={24} />
            </button>
            <button onClick={handleNextMonth} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Bottom Section: Notes & Calendar Grid */}
        <div className="flex flex-col md:flex-row p-6 md:p-8 gap-8">

          {/* Notes Area */}
          <div className="w-full md:w-1/3 flex flex-col">
            <div className="flex items-center space-x-2 text-gray-800 mb-4 font-bold text-lg border-b-2 border-gray-100 pb-2">
              <PenLine size={18} />
              <span>Notes</span>
            </div>
            <textarea
              className="flex-grow w-full bg-transparent resize-none outline-none text-sm text-gray-600 leading-relaxed placeholder-gray-300"
              placeholder="Jot down goals, birthdays, or reminders for this month..."
              value={notes[format(currentDate, 'yyyy-MM')] || ''}
              onChange={handleNoteChange}
              style={{
                backgroundImage: 'linear-gradient(transparent, transparent 29px, #e5e7eb 29px, #e5e7eb 30px)',
                backgroundSize: '100% 30px',
                lineHeight: '30px',
              }}
              rows={8}
            />
          </div>

          {/* Calendar Grid */}
          <div className="w-full md:w-2/3">
            <div className="flex justify-between w-full mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="w-10 text-center">{d}</div>
              ))}
            </div>
            <div className="flex flex-col w-full">
              {renderDays()}
            </div>

            {/* Quick Range Indicator */}
            <div className="mt-6 text-sm text-gray-500 flex justify-end">
              {startDate && endDate && (
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  Selected: {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

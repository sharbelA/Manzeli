"use client";

import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { addMonths, startOfMonth, parseISO } from "date-fns";
import type { Availability } from "@/lib/supabase/types";

interface AvailabilityCalendarProps {
  availability: Availability[];
}

export default function AvailabilityCalendar({
  availability,
}: AvailabilityCalendarProps) {
  const today = new Date();

  const { available, booked, blocked } = useMemo(() => {
    const available: Date[] = [];
    const booked: Date[] = [];
    const blocked: Date[] = [];

    for (const entry of availability) {
      const d = parseISO(entry.date);
      if (entry.status === "available") available.push(d);
      else if (entry.status === "booked") booked.push(d);
      else blocked.push(d);
    }

    return { available, booked, blocked };
  }, [availability]);

  const hasData = availability.length > 0;

  return (
    <div className="availability-calendar">
      <style>{`
        .availability-calendar .rdp-root {
          --rdp-accent-color: var(--accent);
          --rdp-accent-background-color: var(--accent-light);
        }
        .availability-calendar .rdp-day_button {
          border-radius: 50%;
          font-size: 13px;
        }
        .availability-calendar .rdp-available .rdp-day_button {
          background-color: #dcfce7;
          color: #166534;
        }
        .availability-calendar .rdp-booked .rdp-day_button {
          background-color: #fee2e2;
          color: #991b1b;
          cursor: not-allowed;
        }
        .availability-calendar .rdp-blocked .rdp-day_button {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .availability-calendar .rdp-months {
          gap: 1.5rem;
        }
      `}</style>

      <DayPicker
        numberOfMonths={3}
        startMonth={startOfMonth(today)}
        endMonth={addMonths(startOfMonth(today), 2)}
        modifiers={
          hasData
            ? { available, booked, blocked }
            : undefined
        }
        modifiersClassNames={
          hasData
            ? {
                available: "rdp-available",
                booked: "rdp-booked",
                blocked: "rdp-blocked",
              }
            : undefined
        }
        disabled={{ before: today }}
        showOutsideDays={false}
      />

      {hasData && (
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#dcfce7] border border-[#86efac] inline-block" />
            <span className="text-[var(--muted)]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#fee2e2] border border-[#fca5a5] inline-block" />
            <span className="text-[var(--muted)]">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#f3f4f6] border border-[#d1d5db] inline-block" />
            <span className="text-[var(--muted)]">Unavailable</span>
          </div>
        </div>
      )}

      {!hasData && (
        <p className="text-sm text-[var(--muted)] mt-3">
          Contact us to check availability for your preferred dates.
        </p>
      )}
    </div>
  );
}

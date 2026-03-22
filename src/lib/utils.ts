import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let timeOffset = Number(localStorage.getItem('aha_time_offset')) || 0;

export async function syncRealTime() {
  try {
    let realTimeMs: number | null = null;
    try {
      const res = await fetch('http://worldtimeapi.org/api/timezone/Asia/Manila');
      if (res.ok) {
        realTimeMs = new Date((await res.json()).datetime).getTime();
      }
    } catch (err) {}

    if (!realTimeMs) {
      try {
        const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Manila');
        if (res.ok) {
          realTimeMs = new Date((await res.json()).dateTime).getTime();
        }
      } catch (err) {}
    }

    if (realTimeMs) {
      timeOffset = realTimeMs - Date.now();
      localStorage.setItem('aha_time_offset', timeOffset.toString());
      
      // Dispatch event so React components could optionally listen, 
      // though typically the next refresh will just use localStorage instantly.
      window.dispatchEvent(new Event('timeSynced'));
    }
  } catch (err) {
    console.warn('Real time sync failed completely');
  }
}

export function getPhTime(): Date {
  const realNow = new Date(Date.now() + timeOffset);
  const phTimeStr = realNow.toLocaleString("en-US", { timeZone: "Asia/Manila" });
  return new Date(phTimeStr);
}

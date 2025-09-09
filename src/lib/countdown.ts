"use client";
import { useEffect, useState } from "react";

export default function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    isToday: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();

      // cek apakah hari ini
      const isSameDay =
        now.getFullYear() === target.getFullYear() &&
        now.getMonth() === target.getMonth() &&
        now.getDate() === target.getDate();

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          isToday: isSameDay,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        isToday: isSameDay,
      });
    };

    updateCountdown(); // langsung hitung saat mount
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
"use client";

import { useState, useEffect } from "react";

export default function Clock() {
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  const update = () => {
    const date = new Date(Date.now());
    
    setTimeStr(
      date.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Seoul",
        hour: "numeric",
        minute: "2-digit",
      })
    );

    setDateStr(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  };

  useEffect(() => {
    update();
    setInterval(update, 1000);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen p-8">
      <div className="flex basis-3/4 justify-start items-center w-full">
        <div className="text-9xl font-bold">
          <div>{timeStr}</div>
        </div>
      </div>
      <div className="flex basis-1/4 justify-start w-full p-2">
        <div className="text-2xl">{dateStr}</div>
      </div>
    </div>
  );
}

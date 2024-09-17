"use client";

import { useState, useEffect } from "react";

export default function Weather() {
  const [tempForcasts, setTempForcasts] = useState([]);

  useEffect(() => {
    async function update() {
      const forcasts = await fetchForcasts();
      setTempForcasts(forcasts);
    }
    update();
    const interval = setInterval(update, 3_600_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <span>temperature</span>
      {tempForcasts.map((x) => (
        <li key={x}>
          {x.fcstTime}: {x.fcstValue}
        </li>
      ))}
    </div>
  );
}

/**
 * base_time should be 1 hour ago's (hhmm) since API data is 
 * not ready for current time.
 * 
 * @returns base_date and base_time
 */
function getBaseDateAndTime() {
  // Get the current date and time
  const currentDate = new Date();

  // Subtract one hour from the current time
  currentDate.setHours(currentDate.getHours() - 1);
  // Set the minutes to '00'
  currentDate.setMinutes(0);
  currentDate.setSeconds(0); // Optional: set seconds to 0

  // Function to format number with leading zero if needed
  const formatWithLeadingZero = (number) =>
    number < 10 ? `0${number}` : number;

  // Extract the components of the date
  const year = currentDate.getFullYear();
  const month = formatWithLeadingZero(currentDate.getMonth() + 1); // Months are zero-based in JS
  const day = formatWithLeadingZero(currentDate.getDate());

  // Format date as 'yyyymmdd'
  const formattedDate = `${year}${month}${day}`;

  // Extract the components of the time
  const hours = formatWithLeadingZero(currentDate.getHours());
  const minutes = formatWithLeadingZero(currentDate.getMinutes());

  // Format time as 'hhmm'
  const formattedTime = `${hours}${minutes}`;

  return { base_date: formattedDate, base_time: formattedTime };
}

async function fetchForcasts() {
  const { base_date, base_time } = getBaseDateAndTime();

  const requestOptions = {
    method: "GET",
  };

  const baseUrl =
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
  // WEATHER_API_KEY can be used in client side code because this app will not be public
  const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const params = {
    serviceKey: key,
    pageNo: "1",
    numOfRows: "100",
    dataType: "JSON",
    base_date: base_date,
    base_time: base_time,
    nx: "58", // my living x
    ny: "125", // my living y
  };

  const queryString = new URLSearchParams(params).toString();
  const requestUrl = `${baseUrl}?${queryString}`;

  const response = await fetch(requestUrl, requestOptions);

  try {
    const forcasts = (await response.json()).response.body.items.item;
    return forcasts.filter((x) => x.category === "TMP").slice(0, 5);
  } catch {
    console.error("error fetching data", response);
    return [];
  }
}

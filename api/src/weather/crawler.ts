import { fetchWeather, type WeatherApiResponse } from "./api.js";

type WeatherKey = string;
type WeatherData = {
  fcstTime: string;
  temp: string;
  sky:
    | "sun"
    | "wind"
    | "crowd"
    | "few rain"
    | "heavy rain"
    | "snow"
    | "unknown";
};

export async function run(): Promise<void> {
  let baseDate: string = "20240922";
  let baseTime: string = "1900";
  await getWeatherData(baseDate, baseTime);
  // Save to sqlite3
}

async function getWeatherData(
  baseDate: string,
  baseTime: string
): Promise<WeatherData[]> {
  const apiResponse: WeatherApiResponse[] = await fetchWeather(
    baseDate,
    baseTime
  );

  const result = apiResponse.reduce<{ [key: WeatherKey]: WeatherData }>(
    (agg, curr) => {
      const forcastTime = curr.fcstTime;
      if (agg[forcastTime] === undefined) {
        agg[forcastTime] = {
          fcstTime: forcastTime,
          temp: "",
          sky: "unknown",
        };
      }

      switch (curr.category) {
        case "T1H":
          agg[forcastTime].temp = curr.fcstValue;
          break;
        case "RN1":
          if (!["강수없음", "0", "null"].includes(curr.fcstValue)) {
            agg[forcastTime].sky = "heavy rain";
          }
          break;
        case "PTY":
          if (curr.fcstValue === "1" || curr.fcstValue === "2") {
            agg[forcastTime].sky = "heavy rain";
          }
          if (curr.fcstValue === "5" || curr.fcstValue === "6") {
            agg[forcastTime].sky = "few rain";
          }
          if (curr.fcstValue === "3" || curr.fcstValue === "7") {
            agg[forcastTime].sky = "snow";
          }
          break;
        case "SKY":
          if (agg[forcastTime].sky !== "unknown") {
            break;
          }
          if (parseInt(curr.fcstValue) <= 5) {
            agg[forcastTime].sky = "sun";
          } else {
            agg[forcastTime].sky = "crowd";
          }
          break;
      }
      return agg;
    },
    {}
  );

  return Object.values(result);
}

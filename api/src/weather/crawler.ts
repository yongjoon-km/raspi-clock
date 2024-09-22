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
  const apiResponse: WeatherApiResponse[] = await fetchWeather(
    baseDate,
    baseTime
  );

  const result = apiResponse.reduce<{ [key: WeatherKey]: WeatherData }>(
    (agg, curr) => {
      if (agg[curr.fcstTime] === undefined) {
        agg[curr.fcstTime] = {
          fcstTime: curr.fcstTime,
          temp: "",
          sky: "unknown",
        };
      }

      switch (curr.category) {
        case "T1H":
          agg[curr.fcstTime].temp = curr.fcstValue;
          break;
        case "RN1":
          if (
            curr.fcstValue === "강수없음" ||
            curr.fcstValue === "0" ||
            curr.fcstValue === "null"
          ) {
            break;
          } else {
            agg[curr.fcstTime].sky = "heavy rain";
          }
          break;
        case "PTY":
          if (curr.fcstValue === "1" || curr.fcstValue === "2") {
            agg[curr.fcstTime].sky = "heavy rain";
          }
          if (curr.fcstValue === "5" || curr.fcstValue === "6") {
            agg[curr.fcstTime].sky = "few rain";
          }
          if (curr.fcstValue === "3" || curr.fcstValue === "7") {
            agg[curr.fcstTime].sky = "snow";
          }
          break;
        case "SKY":
          if (agg[curr.fcstTime].sky !== "unknown") {
            break;
          }
          if (parseInt(curr.fcstValue) <= 5) {
            agg[curr.fcstTime].sky = "sun";
          } else {
            agg[curr.fcstTime].sky = "crowd";
          }
          break;
      }
      return agg;
    },
    {}
  );

  console.log(Object.values(result));
  /**
   * [
   *   {
   *     "baseTime": "0100",
   *     "temp": "25",
   *     "sky": "sun" | "wind" | "crowd" | "few rain" | "heavy rain" | "snow"
   *   }
   * ]
   */
}

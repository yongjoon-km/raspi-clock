type WeatherCategory = "T1H" | "RN1" | "PTY" | "SKY";

export type WeatherApiResponse = {
  baseDate: string;
  baseTime: string;
  category: WeatherCategory;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
};

export async function fetchWeather(
  baseDate: string,
  baseTime: string
): Promise<WeatherApiResponse[]> {
  const key = process.env.WEATHER_API_KEY;
  if (key === undefined) {
    throw new Error("weather api key doesn't exist.");
  }

  const baseUrl =
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

  const requestOptions = {
    method: "GET",
  };

  const params = {
    serviceKey: key,
    pageNo: "1",
    numOfRows: "100",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: "58", // my living x
    ny: "125", // my living y
  };

  const queryString = new URLSearchParams(params).toString();
  const requestUrl = `${baseUrl}?${queryString}`;

  const response = await fetch(requestUrl, requestOptions);

  if (!response.ok) {
    return [];
  }

  try {
    return (await response.json()).response.body.items.item;
  } catch {
    console.error("error fetching data", response);
    return [];
  }
}

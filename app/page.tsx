import Clock from "@/app/clock";
import Weather from "./weather";

export default function Home() {
  return (
    <div className="flex flex-row justify-center items-center h-screen w-screen">
      <div className="flex basis-3/4">
        <Clock />
      </div>
      <div className="flex basis-1/4">
        <Weather />
      </div>
    </div>
  );
}

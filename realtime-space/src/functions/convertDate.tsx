import { useSimClock } from "../components/menu/timeControl";


export function getCurrentClock() {
  const currentClock = useSimClock();
  const currentSetTime = currentClock.timeRef.current;

  const convertedTime = convertMsToDate(currentSetTime);

  return convertedTime;
}

export function convertMsToDate(ms: number): string {
  const date = new Date(ms);
  const parsedDate = parseDateString(date)
  return parsedDate
}

export function parseDateString(dateString: Date) {
    const dateYear = dateString.getFullYear();
    const dateMonth = dateString.getMonth();
    const dateDay = dateString.getDate();
    const dateHour = dateString.getHours();
    const dateMinute = dateString.getMinutes();
    const dateSecond = dateString.getSeconds();

    return `${dateYear}-${String(dateMonth + 1).padStart(2, "0")}-${String(dateDay).padStart(2, "0")} ${String(dateHour).padStart(2, "0")}:${String(dateMinute).padStart(2, "0")}:${String(dateSecond).padStart(2, "0")}`;
}
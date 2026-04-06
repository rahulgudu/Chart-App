import { format, isToday, isYesterday, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const formatLastSeen = (dateString: string) => {
  if (!dateString) return "";

  const date = parseISO(dateString);
  // Convert UTC to IST (Asia/Kolkata)
  const istDate = toZonedTime(date, "Asia/Kolkata");

  const timeStr = format(istDate, "h:mm a"); // e.g., 1:58 PM

  if (isToday(istDate)) {
    return `last seen today at ${timeStr}`;
  } else if (isYesterday(istDate)) {
    return `last seen yesterday at ${timeStr}`;
  } else {
    // For older dates: 09/03/26
    return `last seen ${format(istDate, "dd/MM/yy")}`;
  }
};

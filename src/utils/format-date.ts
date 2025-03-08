import dayjs from "dayjs";

/**
 * Formats a date string or Date object into a human-readable string
 *
 * @param date - The date to format (can be a string or Date object)
 * @param format - The desired output format using dayjs format tokens (default: "MMM DD, YYYY")
 * @returns A formatted date string
 *
 * @example
 * ```typescript
 * formatDate(new Date('2023-12-25'))          // returns "Dec 25, 2023"
 * formatDate('2023-12-25', 'YYYY-MM-DD')      // returns "2023-12-25"
 * formatDate('2023-12-25', 'dddd, MMMM D')    // returns "Monday, December 25"
 * ```
 */
export const formatDate = (date: string | Date, format = "MMM DD, YYYY") => {
  return dayjs(date).format(format);
};

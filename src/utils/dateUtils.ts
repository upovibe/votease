export const formatDate = (
  date: Date | string | { toDate: () => Date },
  showFullDate: boolean = true
): string => {
  try {
    // Type guard for Firestore Timestamp
    const isFirestoreTimestamp = (
      date: Date | string | { toDate: () => Date }
    ): date is { toDate: () => Date } => {
      return typeof (date as { toDate?: () => Date }).toDate === "function";
    };

    // If it's a Firestore Timestamp (has the toDate method), convert it to Date
    const parsedDate = isFirestoreTimestamp(date)
      ? date.toDate()
      : typeof date === "string"
      ? new Date(date)
      : date;

    // If showFullDate is true, return the full date format
    if (showFullDate) {
      return parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Otherwise, return the "time ago" format
    const seconds = Math.floor((new Date().getTime() - parsedDate.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000); // Years
    if (interval > 1) return `${interval}y ago`;

    interval = Math.floor(seconds / 2592000); // Months
    if (interval > 1) return `${interval}mo ago`;

    interval = Math.floor(seconds / 86400); // Days
    if (interval > 1) return `${interval}d ago`;

    interval = Math.floor(seconds / 3600); // Hours
    if (interval > 1) return `${interval}h ago`;

    interval = Math.floor(seconds / 60); // Minutes
    if (interval > 1) return `${interval}m ago`;

    return `${Math.floor(seconds)}s ago`; // Seconds
  } catch {
    return "Invalid Date";
  }
};

export const formatDate = (date: Date | string): string => {
    try {
      const parsedDate = typeof date === "string" ? new Date(date) : date;
      return parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };
  
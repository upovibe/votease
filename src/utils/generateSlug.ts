// utils/generateSlug.ts

/**
 * Generates a slug from a given string.
 * @param title - The title to generate the slug from.
 * @returns A URL-safe slug.
 */
export const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
  };
  
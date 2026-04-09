export const cleanText = (input: string): string => {
  return input.replace(/\s+/g, " ").replace(/\u0000/g, "").trim();
};

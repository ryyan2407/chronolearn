export const buildDefaultRubric = (topic: string) => {
  return {
    accuracy: `Identify historically accurate causes, actors, or outcomes related to ${topic}.`,
    context: `Explain the broader historical setting surrounding ${topic}.`,
    causation: `Connect developments to why ${topic} emerged or changed over time.`
  };
};

const handleError = (error: unknown, context: string) => {
  console.debug(`Error in ${context}:`, error);
};

export default handleError;

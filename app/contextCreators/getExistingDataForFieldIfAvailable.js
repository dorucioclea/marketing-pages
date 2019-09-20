export const getExistingDataForFieldIfAvailable = (exisitingDataForTask, questionId, index) => (
  exisitingDataForTask
    && exisitingDataForTask.data
    && exisitingDataForTask.data[questionId]
    && exisitingDataForTask.data[questionId][index]
    ? exisitingDataForTask.data[questionId][index] : undefined
);
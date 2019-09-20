import { generateFields } from './generateFields';
import { findExistingMarketingDataForTask } from './findExistingMarketingDataForTask';

export const createTaskPageContext = (solutionId, taskManifest, existingSolutionData) => {
  const context = {};
  const questions = [];

  context.title = taskManifest.title;
  context.submitActionUrl = `/${solutionId}/task/${taskManifest.id}`;

  taskManifest.questions.map((taskManifestQuestion) => {
    const question = {};
    question.id = taskManifestQuestion.id;
    question.type = taskManifestQuestion.type;
    question.mainAdvice = taskManifestQuestion.mainAdvice;
    question.additionalAdvice = taskManifestQuestion.additionalAdvice;

    if (taskManifestQuestion.type === 'bulletpoint-list') {
      const exisitingDataForTask = findExistingMarketingDataForTask(
        existingSolutionData, taskManifest.id,
      );
      question.fields = generateFields(taskManifestQuestion, exisitingDataForTask);
    }

    questions.push(question);
  });

  context.questions = questions;

  return context;
};
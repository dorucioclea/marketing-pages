import { createErrorForQuestionNew } from './createErrorForQuestion';

describe('createErrorForQuestionNew', () => {
  it('should return undefined if validationErrors is undefined', () => {
    const expectedError = undefined;

    const questionManifest = undefined;

    const validationErrors = undefined;

    const error = createErrorForQuestionNew({
      questionId: 'some-question-id', questionManifest, validationErrors,
    });

    expect(error).toEqual(expectedError);
  });

  it('should return undefined if questionManifest is undefined', () => {
    const expectedError = undefined;

    const questionManifest = undefined;

    const validationErrors = {
      'some-question-id': 'someErrorType',
    };

    const error = createErrorForQuestionNew({
      questionId: 'some-question-id', questionManifest, validationErrors,
    });

    expect(error).toEqual(expectedError);
  });

  it('should return undefined if there is no errorResponse in the questionManifest', () => {
    const expectedError = undefined;

    const questionManifest = {};

    const validationErrors = {
      'some-question-id': 'someErrorType',
    };

    const error = createErrorForQuestionNew({
      questionId: 'some-question-id', questionManifest, validationErrors,
    });

    expect(error).toEqual(expectedError);
  });

  it('should return generated error for the question', () => {
    const expectedError = {
      text: 'some error message',
      href: '#some-question-id',
    };

    const questionManifest = {
      errorResponse: {
        someErrorType: 'some error message',
      },
    };

    const validationErrors = {
      'some-question-id': 'someErrorType',
    };

    const error = createErrorForQuestionNew({
      questionId: 'some-question-id', questionManifest, validationErrors,
    });

    expect(error).toEqual(expectedError);
  });
});

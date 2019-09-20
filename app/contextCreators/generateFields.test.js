import { generateFields } from './generateFields';

describe('generateFields', () => {
  it('should return undefined if question is undefined', () => {
    const expectedGeneratedFields = undefined;

    const question = undefined;

    const fields = generateFields(question);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should return undefined if maxItems property does not exist in question', () => {
    const expectedGeneratedFields = undefined;

    const question = {
      id: 'some-question-id',
    };

    const fields = generateFields(question);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should return undefined if maxItems property is 0', () => {
    const expectedGeneratedFields = undefined;

    const question = {
      id: 'some-question-id',
      maxItems: 0,
    };

    const fields = generateFields(question);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should create a list of 1 field if the question provided has a maxItems property of 1', () => {
    const expectedGeneratedFields = [
      {
        id: 'some-question-id-1',
      },
    ];

    const question = {
      id: 'some-question-id',
      maxItems: 1,
    };

    const fields = generateFields(question);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should create a list of multiple fields if the question provided has a maxItems property of more than 1', () => {
    const expectedGeneratedFields = [
      {
        id: 'some-question-id-1',
      },
      {
        id: 'some-question-id-2',
      },
      {
        id: 'some-question-id-3',
      },
    ];

    const question = {
      id: 'some-question-id',
      maxItems: 3,
    };

    const fields = generateFields(question);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should populate the fields with data when there is existing data available', () => {
    const expectedGeneratedFields = [
      {
        id: 'some-question-id-1',
        data: 'some-data-1',
      },
      {
        id: 'some-question-id-2',
        data: 'some-data-2',
      },
      {
        id: 'some-question-id-3',
      },
    ];

    const question = {
      id: 'some-question-id',
      maxItems: 3,
    };

    const exisitingDataForTask = {
      data: {
        'some-question-id': [
          'some-data-1', 'some-data-2',
        ],
      },
    };

    const fields = generateFields(question, exisitingDataForTask);

    expect(fields).toEqual(expectedGeneratedFields);
  });
});
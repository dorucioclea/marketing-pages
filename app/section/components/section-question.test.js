import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './section/components/section-question.njk' import sectionQuestion %}
                            {{ sectionQuestion(question) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('section-question', () => {
  describe('when question type is bulletpoint-list', () => {
    it('should render the bullepoint-list component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'bulletpoint-list',
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-bulletpoint-list"]');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is textarea-field', () => {
    it('should render the textarea-field component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'textarea-field',
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-textarea-field"]');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is text-field', () => {
    it('should render the text-field component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'text-field',
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-text-field"]');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is checkbox-options', () => {
    it('should render the checkbox-options component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'checkbox-options',
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-checkbox-options"]');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is radiobutton-options', () => {
    it('should render the radiobutton-options component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'radiobutton-options',
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-radiobutton-options"]');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });

  describe('when question type is multi-question', () => {
    it('should render the radiobutton-options component', (done) => {
      const context = {
        question: {
          id: 'question-id',
          type: 'multi-question',
          questions: [
            {},
          ],
        },
      };

      const dummyApp = createDummyApp(context);
      request(dummyApp)
        .get('/')
        .then((res) => {
          const $ = cheerio.load(res.text);

          const question = $('div[data-test-id="section-question-multi-question"]');
          expect(question.length).toEqual(1);

          done();
        });
    });
  });
});

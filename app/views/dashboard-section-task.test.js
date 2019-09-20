import request from 'supertest';
import express from 'express';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { App } from '../../app';

const aTaskContext = (title, requirement = 'Mandatory', status = 'INCOMPLETE') => ({
  task: {
    URL: 'someUrl',
    title,
    requirement,
    status,
  },
});

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    const macroWrapper = `{% from './dashboard-section-task.njk' import dashboardSectionTask %}
                            {{ dashboardSectionTask(task) }}`;

    const viewToTest = nunjucks.renderString(macroWrapper, context);

    res.send(viewToTest);
  });

  app.use(dummyRouter);

  return app;
};

describe('dashboard-section-task', () => {
  it('should render the task title', (done) => {
    const dummyApp = createDummyApp(aTaskContext('Some Task Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-task-title"]').text().trim()).toEqual('Some Task Title');

        done();
      });
  });

  it('should render the requirement of the task', (done) => {
    const dummyApp = createDummyApp(aTaskContext('Some Task Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-task-requirement"]').text().trim()).toEqual('Mandatory');

        done();
      });
  });

  it('should render status of the task as INCOMPLETE', (done) => {
    const dummyApp = createDummyApp(aTaskContext('Some Task Title'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-task-status"]').text().trim()).toEqual('INCOMPLETE');

        done();
      });
  });

  it('should render status of the task as COMPLETE', (done) => {
    const dummyApp = createDummyApp(aTaskContext('Some Task Title', 'Mandatory', 'COMPLETE'));
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="dashboard-section-task-status"]').text().trim()).toEqual('COMPLETE');

        done();
      });
  });
});
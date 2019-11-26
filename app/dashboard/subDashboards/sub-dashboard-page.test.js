import request from 'supertest';
import express from 'express';
import cheerio from 'cheerio';
import { App } from '../../../app';

const createDummyApp = (context) => {
  const app = new App().createApp();

  const router = express.Router();
  const dummyRouter = router.get('/', (req, res) => {
    res.render('./dashboard/subDashboards/sub-dashboard-page.njk', context);
  });

  app.use(dummyRouter);

  return app;
};

describe('sub dashboard page', () => {
  it('should render the title of the sub dashboard', (done) => {
    const context = {
      title: 'Title of the sub dashboard',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="sub-dashboard-title"]').text().trim()).toEqual('Title of the sub dashboard');

        done();
      });
  });

  it('should render the main advice of the sub dashboard', (done) => {
    const context = {
      title: 'Title of the sub dashboard',
      mainAdvice: 'This is the main advice for this sub dashboard',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="sub-dashboard-main-advice"]').text().trim()).toEqual('This is the main advice for this sub dashboard');

        done();
      });
  });

  it('should render any additional advice of the sub dashboard', (done) => {
    const context = {
      title: 'Title of the sub dashboard',
      additionalAdvice: [
        'First bit of addtional advice',
        'Second bit of addtional advice',
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        context.additionalAdvice.map((advice, idx) => {
          expect($(`[data-test-id="sub-dashboard-additional-advice"] p:nth-child(${idx + 1})`).text().trim()).toEqual(advice);
        });

        done();
      });
  });

  it('should render the sectionGroups on the sub dashboard page', (done) => {
    const context = {
      sectionGroups: [
        {
          title: 'Some section group title',
          sections: [],
        },
      ],
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id^="dashboard-sectionGroup"]').length).toEqual(1);

        done();
      });
  });

  it('should render the return to all sections link', (done) => {
    const context = {
      title: 'Title of the section',
    };

    const dummyApp = createDummyApp(context);
    request(dummyApp)
      .get('/')
      .then((res) => {
        const $ = cheerio.load(res.text);

        expect($('[data-test-id="sub-dashboard-back-link"] a').length).toEqual(1);
        expect($('[data-test-id="sub-dashboard-back-link"] a').text().trim()).toEqual('Return to all sections');

        done();
      });
  });
});

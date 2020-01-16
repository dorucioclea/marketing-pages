import express from 'express';
import axios from 'axios';
import { getMarketingPageDashboardContext, postSubmitForModeration } from './pages/dashboard/controller';
import { getSubDashboardPageContext } from './pages/dashboard/subDashboards/controller';
import { getSectionPageContext, getSectionPageErrorContext, postSection } from './pages/section/controller';
import { getPreviewPageContext } from './pages/preview/controller';
import logger from './logger';
import { errorHandler } from './pages/error/errorHandler';
import fs from 'fs';
// const http = require('http');

const router = express.Router();

router.get('/healthcheck', async (req, res) => {
  logger.info('navigating to healthcheck page');

  res.send('Marketing pages is Running!!!');
});


router.get('/download', async (req, res) => {
  logger.info('Gonna try a download');

  // const file = fs.createReadStream('./test-file.png');
  // console.log(`file is ${JSON.stringify(file)}`);
  const code = '';

  const endpoint = `https://gpit-func-app.azurewebsites.net/api/DownloadFileSdkTest/docs/NHSmail.pdf?code=${code}`;
  logger.info(`api called: [GET] ${endpoint}`);
  const response = await axios.get(endpoint, { responseType: 'stream' });
  // console.log(`the file ${JSON.stringify(theFile)}`);

  response.data.pipe(res);
  // res.pipe(file);

  // res.send('Marketing pages is Running!!!');
});

router.get('/solution/:solutionId', async (req, res, next) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} dashboard`);
  try {
    const context = await getMarketingPageDashboardContext({ solutionId });
    res.render('pages/dashboard/template', context);
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/section/:sectionId', async (req, res, next) => {
  const { solutionId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: section ${sectionId}`);
  try {
    const context = await getSectionPageContext({ solutionId, sectionId });
    res.render('pages/section/template', context);
  } catch (err) {
    next(err);
  }
});

router.post('/solution/:solutionId/section/:sectionId', async (req, res, next) => {
  const { solutionId, sectionId } = req.params;
  const sectionData = req.body;
  try {
    const response = await postSection({
      solutionId, sectionId, sectionData,
    });
    if (response.success) {
      res.redirect(response.redirectUrl);
    } else {
      const context = await getSectionPageErrorContext({
        solutionId, sectionId, sectionData, validationErrors: response,
      });
      res.render('pages/section/template', context);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/dashboard/:dashboardId', async (req, res, next) => {
  const { solutionId, dashboardId } = req.params;
  logger.info(`navigating to Solution ${solutionId} dashboard: ${dashboardId}`);
  try {
    const context = await getSubDashboardPageContext({ solutionId, dashboardId });
    res.render('pages/dashboard/subDashboards/template', context);
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/dashboard/:dashboardId/section/:sectionId', async (req, res, next) => {
  const { solutionId, dashboardId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: dashboard ${dashboardId}: section ${sectionId}`);
  try {
    const context = await getSectionPageContext({ solutionId, dashboardId, sectionId });
    res.render('pages/section/template', context);
  } catch (err) {
    next(err);
  }
});

router.post('/solution/:solutionId/dashboard/:dashboardId/section/:sectionId', async (req, res, next) => {
  const { solutionId, dashboardId, sectionId } = req.params;
  const sectionData = req.body;
  try {
    const response = await postSection({
      solutionId, sectionId, sectionData, dashboardId,
    });
    if (response.success) {
      res.redirect(response.redirectUrl);
    } else {
      const context = await getSectionPageErrorContext({
        solutionId, sectionId, sectionData, validationErrors: response, dashboardId,
      });
      res.render('pages/section/template', context);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/preview', async (req, res, next) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} preview`);
  try {
    const context = await getPreviewPageContext({ solutionId });
    res.render('pages/preview/template', context);
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/submitForModeration', async (req, res, next) => {
  const { solutionId } = req.params;
  try {
    const response = await postSubmitForModeration({ solutionId });
    if (response.success) {
      res.redirect(`/solution/${solutionId}`);
    } else {
      const context = await getMarketingPageDashboardContext({
        solutionId, validationErrors: response,
      });
      res.render('pages/dashboard/template', context);
    }
  } catch (err) {
    next(err);
  }
});

router.get('*', (req, res, next) => {
  next({
    status: 404,
    message: 'Incorrect url - please check it is valid and try again',
  });
});

router.use((err, req, res, next) => {
  if (err) {
    const context = errorHandler(err);
    logger.error(context.message);
    res.render('pages/error/template.njk', context);
  } else {
    next();
  }
});

module.exports = router;

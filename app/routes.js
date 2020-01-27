import express from 'express';
import axios from 'axios';

import { getMarketingPageDashboardContext, postSubmitForModeration } from './pages/dashboard/controller';
import { getSubDashboardPageContext } from './pages/dashboard/subDashboards/controller';
import { getSectionPageContext, getSectionPageErrorContext, postSection } from './pages/section/controller';
import { getPreviewPageContext } from './pages/preview/controller';
import logger from './logger';
import { errorHandler } from './pages/error/errorHandler';

const blobStorage = require('@azure/storage-blob');

const router = express.Router();

router.get('/healthcheck', async (req, res) => {
  logger.info('navigating to healthcheck page');

  res.send('Marketing pages is Running!!!');
});

async function downloadRoadmap(solutionId, url, accessKey) {
  const azSdkEndpoint = `${url}/${solutionId}.pdf`;

  const config = {
    method: 'get',
    headers: {
      'x-functions-key': accessKey,
    },
    responseType: 'stream',
  };

  logger.info(`API called: [GET] ${azSdkEndpoint}`);

  return axios.get(azSdkEndpoint, config);
}

const appName = 'func-streamingspike';

router.get('/download/azBinding/:solutionId', async (req, res) => {
  logger.info('Downloading roadmap using AZ Function (with binding)');

  const { solutionId } = req.params;
  const accessKey = '13Zbo5vydAU5VaXt0Xfpawg3xS9h2614uZq2MGic3ncGfn3GBBJa7w==';
  const azBindingEndpoint = `https://${appName}.azurewebsites.net/api/downloadBlob/binding/spike/`;

  const response = await downloadRoadmap(solutionId, azBindingEndpoint, accessKey);

  response.data.pipe(res);
});

router.get('/download/azSdk/:solutionId', async (req, res) => {
  logger.info('Downloading roadmap using AZ Function (with SDK)');

  const { solutionId } = req.params;
  const accessKey = '04MRvMYdSugTVMA5jMdmL8W1xDLYU1FYaR48H3PaUy/7IxFL5GpHHg==';
  const azSdkEndpoint = `https://${appName}.azurewebsites.net/api/downloadBlob/sdk/spike/`;

  const response = await downloadRoadmap(solutionId, azSdkEndpoint, accessKey);

  response.data.pipe(res);
});

router.get('/download/localApi/:solutionId', async (req, res) => {
  logger.info('Downloading roadmap using local API (with SDK)');

  const { solutionId } = req.params;
  const endpoint = `http://localhost:59404/api/blob/sdk/spike/${solutionId}.pdf`;

  logger.info(`API called: [GET] ${endpoint}`);

  const response = await axios.get(endpoint, { responseType: 'stream' });

  response.data.pipe(res);
});

router.get('/download/node/:solutionId', async (req, res) => {
  logger.info('Downloading roadmap using node only (with SDK)');

  const { solutionId } = req.params;

  const accountName = 'ststreamingspike001';
  const accountKey = '6HCECUIDEXY1wdfHto6hqUcGyjzdxBAI9RJCwhKl4ToMdm9JDC4r1h+ctDMeev7RWmZJmjmsNLiMihJ7ARQN8A==';
  const endpoint = `https://${accountName}.blob.core.windows.net`;

  const credential = new blobStorage.StorageSharedKeyCredential(
    accountName,
    accountKey,
  );

  const blobServiceClient = new blobStorage.BlobServiceClient(
    endpoint,
    credential,
  );

  const containerClient = blobServiceClient.getContainerClient('spike');
  const blobClient = containerClient.getBlobClient(`${solutionId}.pdf`);

  logger.info(`API called: [GET] ${endpoint}`);

  const download = await blobClient.download();

  download.readableStreamBody.pipe(res);
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

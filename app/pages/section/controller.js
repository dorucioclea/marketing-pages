import axios from 'axios';
import { ManifestProvider } from '../../manifestProvider';
import { ApiProvider } from '../../apiProvider';
import { createSectionPageContext } from './createSectionPageContext';
import { transformSectionData } from './helpers/transformSectionData';
import { createPostSectionResponse } from './helpers/createPostSectionResponse';
import { apiHost } from '../../config';
import logger from '../../logger';

export const getSectionPageContext = async ({
  solutionId, dashboardId, sectionId,
}) => {
  const sectionManifest = new ManifestProvider().getSectionManifest({
    dashboardId,
    sectionId,
  });
  const sectionData = await new ApiProvider().getSectionData({ solutionId, sectionId });
  if (sectionData && sectionData.data) {
    const formData = sectionData.data;
    const context = createSectionPageContext({
      solutionId, sectionManifest, formData, dashboardId,
    });
    return context;
  }
  throw new Error('No data returned');
};

export const getSectionPageErrorContext = async ({
  solutionId, sectionId, sectionData, validationErrors, dashboardId,
}) => {
  const sectionManifest = new ManifestProvider().getSectionManifest({ dashboardId, sectionId });

  const context = createSectionPageContext({
    solutionId, sectionManifest, formData: sectionData, validationErrors, dashboardId,
  });

  return context;
};

export const postSection = async ({
  solutionId, sectionId, sectionData, dashboardId,
}) => {
  const sectionManifest = new ManifestProvider().getSectionManifest({ dashboardId, sectionId });
  const transformedSectionData = transformSectionData({ sectionManifest, sectionData });
  try {
    await new ApiProvider().putSectionData({
      solutionId, sectionId, sectionData: transformedSectionData,
    });

    const response = createPostSectionResponse({ solutionId, sectionManifest });

    return response;
  } catch (error) {
    if (error.response.status === 400) {
      return error.response.data;
    }
    logger.error(`postSection: unrecognised response ${JSON.stringify(error.response.data, null, 2)}`);
    throw error;
  }
};

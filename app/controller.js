import axios from 'axios';
import { ManifestProvider } from './forms/manifestProvider';
import { createSectionPageContext } from './contextCreators/createSectionPageContext';
import { createDashboardPageContext } from './contextCreators/createDashboardPageContext';
import { createPreviewPageContext } from './contextCreators/createPreviewPageContext';
import { transformSectionData } from './helpers/transformSectionData';
import { createPostSectionResponse } from './helpers/createPostSectionResponse';

export const getMarketingPageDashboardContext = async (solutionId, validationErrors) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  const dashboardDataRaw = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/dashboard`);
  const dashboardData = dashboardDataRaw.data;

  const context = createDashboardPageContext(
    solutionId, dashboardManifest, dashboardData.sections, validationErrors,
  );

  return context;
};

export const getSubDashboardPageContext = async (solutionId, sectionId) => {
  const dashboardManifest = new ManifestProvider().getSubDashboardManifest(sectionId);

  const sectionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`);
  const { sections } = sectionData.data;

  const context = createDashboardPageContext(
    solutionId, dashboardManifest, sections,
  );

  return context;
};

export const getSectionPageContext = async (solutionId, sectionId) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const sectionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`);
  const formData = sectionData.data;

  const context = createSectionPageContext(solutionId, sectionManifest, formData);

  return context;
};

export const getSectionPageErrorContext = async (
  solutionId, sectionId, sectionData, validationErrors,
) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const context = createSectionPageContext(
    solutionId, sectionManifest, sectionData, validationErrors,
  );

  return context;
};

export const postSection = async (solutionId, sectionId, sectionData) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);
  const transformedSectionData = transformSectionData(sectionId, sectionManifest, sectionData);
  try {
    await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`, transformedSectionData);

    const response = createPostSectionResponse(solutionId, sectionManifest);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const getPreviewPageContext = async (solutionId) => {
  const previewDataRaw = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/preview`);
  const previewData = previewDataRaw.data;

  const context = createPreviewPageContext(previewData);

  return context;
};

export const postSubmitForModeration = async (solutionId) => {
  try {
    await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}/SubmitForReview`, {});
    return {
      success: true,
    };
  } catch (error) {
    return error.response.data;
  }
};

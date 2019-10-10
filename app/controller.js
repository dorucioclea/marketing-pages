import axios from 'axios';
import { ManifestProvider } from './forms/manifestProvider';
import { createSectionPageContext } from './contextCreators/createSectionPageContext';
import { createMarketingDashboardContext } from './contextCreators/createMarketingDashboardContext';
import { createPreviewPageContext } from './contextCreators/createPreviewPageContext';
import { createMarketingDataIfRequired } from './helpers/createMarketingDataIfRequired';
import { createUpdatedSolutionData } from './helpers/createUpdatedSolutionData';
import { validateSectionData } from './helpers/validateSectionData';
import { findExistingMarketingDataForSection } from './helpers/findExistingMarketingDataForSection';

export const getMarketingPageDashboardContext = async (solutionId) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const { solution } = solutionData.data;

  solution.marketingData = createMarketingDataIfRequired(dashboardManifest, solution);
  await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}`, solution);

  const context = createMarketingDashboardContext(
    solutionId, dashboardManifest, solution.marketingData,
  );

  return context;
};

export const getSectionPageContext = async (solutionId, sectionId) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const existingSolutionData = solutionData.data.solution;

  const formData = findExistingMarketingDataForSection(existingSolutionData, sectionManifest.id);

  const context = createSectionPageContext(solutionId, sectionManifest, formData);

  return context;
};

const convertToFormData = sectionData => ({
  data: {
    ...sectionData,
  },
});

export const getSectionPageErrorContext = async (
  solutionId, sectionId, sectionData, validationErrors,
) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const formData = convertToFormData(sectionData);
  const context = createSectionPageContext(solutionId, sectionManifest, formData, validationErrors);

  return context;
};

export const validateSection = (sectionId, sectionData) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);
  return validateSectionData(sectionManifest, sectionData);
};

export const postSection = async (solutionId, sectionId, sectionData) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const existingSolutionData = solutionData.data.solution;

  const updatedSolutionData = createUpdatedSolutionData(
    sectionId, existingSolutionData, sectionManifest, sectionData,
  );

  await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}`, updatedSolutionData);

  return true;
};

export const getPreviewPageContext = async (solutionId) => {
  const previewManifest = new ManifestProvider().getPreviewManifest();
  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const existingSolutionData = solutionData.data.solution;

  const context = createPreviewPageContext(previewManifest, existingSolutionData);

  return context;
};

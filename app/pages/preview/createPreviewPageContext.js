export const createPreviewPageContext = ({ previewData }) => {
  const context = {
    id: previewData.id,
    sections: previewData.sections,
  };

  return context;
};

import { getSubDashboardPageContext } from './controller';
import { ManifestProvider } from '../../../manifestProvider';
import { ApiProvider } from '../../../apiProvider';

jest.mock('../../../manifestProvider');
jest.mock('../../../apiProvider');

describe('subDashboards controller', () => {
  const subDashboardManifest = {
    sectionGroups: {
      'some-section-group-id': {
        title: 'Some section group',
        sections: {
          'some-section-id': {
            title: 'Some section',
            type: 'section',
          },
        },
      },
    },
  };

  const subDashboardData = {
    data: {
      sections: {
        'some-section-id': {
          status: 'INCOMPLETE',
          requirement: 'Mandatory',
        },
      },
    },
  };

  it('should return the context when the manifest and data from the api is provided', async () => {
    const expectedContext = {
      previewUrl: '/solution/some-solution-id/preview',
      submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
      returnToDashboardUrl: '/supplier/solution/some-solution-id',
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: '/supplier/solution/some-solution-id/dashboard/some-dashboard-id/section/some-section-id',
              id: 'some-section-id',
              title: 'Some section',
              requirement: 'Mandatory',
              status: 'INCOMPLETE',
              isActive: true,
            },
          ],
        },
      ],
    };

    ManifestProvider.prototype.getSubDashboardManifest.mockReturnValue(subDashboardManifest);
    ApiProvider.prototype.getSubDashboardData.mockResolvedValue(subDashboardData);

    const context = await getSubDashboardPageContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });

    expect(context).toEqual(expectedContext);
  });

  it('should throw an error when no data is returned from the ApiProvider', async () => {
    ManifestProvider.prototype.getSubDashboardManifest.mockReturnValue(subDashboardManifest);
    ApiProvider.prototype.getSubDashboardData.mockResolvedValue({});

    try {
      await getSubDashboardPageContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });
    } catch (err) {
      expect(err).toEqual(new Error('No data returned'));
    }
  });
});

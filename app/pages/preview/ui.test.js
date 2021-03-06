import nock from 'nock';
import { Selector } from 'testcafe';
import previewWithNoMarketingData from '../../../fixtures/previewWithNoMarketingData.json';
import previewWithMarketingData from '../../../fixtures/previewWithMarketingData.json';
import { apiLocalhost, apiPath } from '../../test-utils/config';
import { extractInnerText } from '../../test-utils/helper';

const mocks = (existingData) => {
  if (!existingData) {
    nock(apiLocalhost)
      .get(`${apiPath}/preview`)
      .reply(200, previewWithNoMarketingData);
  } else {
    nock(apiLocalhost)
      .get(`${apiPath}/preview`)
      .reply(200, previewWithMarketingData);
  }
};

const pageSetup = async (t, existingData = false) => {
  mocks(existingData);
  await t.navigateTo('http://localhost:1234/solution/S100000-001/preview');
};

fixture('Show marketing preview page');

test('should render the marketing preview page title', async (t) => {
  await pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(await extractInnerText(title)).eql('Preview Page');
});

test('when no existing marketing data - The solution description section should not be rendered', async (t) => {
  await pageSetup(t);

  const solutionDescriptionSection = Selector('[data-test-id="view-solution-description"]');

  await t
    .expect(solutionDescriptionSection.exists).notOk();
});

test('when existing marketing data - The solution description section and all questions should be rendered', async (t) => {
  await pageSetup(t, true);

  const solutionDescriptionSection = Selector('[data-test-id="view-solution-description"]');
  const summaryQuestion = solutionDescriptionSection.find('[data-test-id="view-section-question-summary"]');
  const descriptionQuestion = solutionDescriptionSection.find('[data-test-id="view-section-question-description"]');
  const linkQuestion = solutionDescriptionSection.find('[data-test-id="view-section-question-link"]');

  await t
    .expect(solutionDescriptionSection.exists).ok()
    .expect(await extractInnerText(solutionDescriptionSection.find('h3'))).eql('Solution description')

    .expect(summaryQuestion.exists).ok()
    .expect(await extractInnerText(summaryQuestion.find('[data-test-id="view-question-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryQuestion.find('[data-test-id="view-question-data-text-summary"]'))).eql('The solution summary')

    .expect(descriptionQuestion.exists).ok()
    .expect(await extractInnerText(descriptionQuestion.find('[data-test-id="view-question-title"]'))).eql('About the solution')
    .expect(await extractInnerText(descriptionQuestion.find('[data-test-id="view-question-data-text-description"]'))).eql('The solution description')

    .expect(linkQuestion.exists).ok()
    .expect(linkQuestion.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(await extractInnerText(linkQuestion.find('[data-test-id="view-question-data-link"]'))).eql('The solution link');
});

test('when no existing marketing data - The features section should not be rendered', async (t) => {
  await pageSetup(t);
  const featuresSection = Selector('[data-test-id="view-features"]');

  await t
    .expect(featuresSection.exists).notOk();
});

test('when existing marketing data - The features section should be rendered and the features displayed', async (t) => {
  await pageSetup(t, true);

  const featuresSection = Selector('[data-test-id="view-features"]');

  await t
    .expect(featuresSection.exists).ok()
    .expect(await extractInnerText(featuresSection.find('h3'))).eql('Features')

    .expect(featuresSection.exists).ok()
    .expect(featuresSection.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').exists).ok()
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li').count).eql(3)
    .expect(await extractInnerText(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(1)'))).eql('Feature A')
    .expect(await extractInnerText(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(2)'))).eql('Feature B')
    .expect(await extractInnerText(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(3)'))).eql('Feature C');
});

test('when no existing marketing data - The client-application-types section should not be rendered', async (t) => {
  await pageSetup(t);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');

  await t
    .expect(clientApplicationTypesSection.exists).notOk();
});

test('when existing marketing data - The client application type section and browser-based section should be rendered', async (t) => {
  await pageSetup(t, true);
  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const browserBasedExpandableSection = Selector('[data-test-id="view-section-browser-based"]');
  const browserBasedExpandaleSectionTable = Selector('[data-test-id="view-section-table-browser-based"]');
  const supportedBrowsersRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-supported-browsers"]');
  const mobileResponsiveRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-responsive"]');
  const mobileFirstRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-first-design"]');
  const pluginsRequiredRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-plugins-required"]');
  const pluginsDetailRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-plugins-detail"]');
  const minimumConnectionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const minimumResolutionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-desktop-resolution"]');
  const hardwareRequirementsDescriptionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements-description"]');
  const additionalInformationRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(await extractInnerText(clientApplicationTypesSection.find('h3'))).eql('Client application type')

    .expect(browserBasedExpandableSection.exists).ok()
    .expect(await extractInnerText(browserBasedExpandableSection)).eql('Browser based application')
    .expect(browserBasedExpandableSection.find('details[open]').exists).notOk()
    .click(browserBasedExpandableSection.find('summary'))
    .expect(browserBasedExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Browsers Supported')
    .expect(await extractInnerText(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Google Chrome')
    .expect(await extractInnerText(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Mozilla Firefox')
    .expect(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Mobile responsive')
    .expect(await extractInnerText(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Yes')
    .expect(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(mobileFirstRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Designed with a mobile first approach')
    .expect(await extractInnerText(mobileFirstRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Yes')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Plug-ins or extensions required')
    .expect(await extractInnerText(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Yes')
    .expect(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(pluginsDetailRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Plug-ins or extensions information')
    .expect(await extractInnerText(pluginsDetailRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('The plugin detail')
    .expect(pluginsDetailRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Minimum connection speed required')
    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('1Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumResolutionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Recommended desktop aspect ratio and screen resolution')
    .expect(await extractInnerText(minimumResolutionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('4:3 800 x 600')
    .expect(minimumResolutionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Hardware requirements')
    .expect(await extractInnerText(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Some hardware requirement description')
    .expect(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Additional information')
    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Some browser additional information')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('when existing marketing data - The client application type section and native-mobile section should be rendered', async (t) => {
  await pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const nativeMobileExpandableSection = Selector('[data-test-id="view-section-native-mobile"]');
  const nativeMobileExpandaleSectionTable = Selector('[data-test-id="view-section-table-native-mobile"]');
  const operatingSystemRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-operating-systems"]');
  const operatingSystemDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-operating-systems-description"]');
  const mobileFirstRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-first-design"]');
  const minimumMemoryRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-memory-requirement"]');
  const storageDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-storage-requirements-description"]');
  const minimumConnectionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const connectionRequirementsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-connection-types"]');
  const connectionDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-connection-requirements-description"]');
  const thirdPartyComponentsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-third-party-components"]');
  const deviceCapabilitiesRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-device-capabilities"]');
  const hardwareRequirementsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements"]');
  const additionalInformationRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(await extractInnerText(clientApplicationTypesSection.find('h3'))).eql('Client application type')

    .expect(nativeMobileExpandableSection.exists).ok()
    .expect(await extractInnerText(nativeMobileExpandableSection)).eql('Native mobile or tablet application')
    .expect(nativeMobileExpandableSection.find('details[open]').exists).notOk()
    .click(nativeMobileExpandableSection.find('summary'))
    .expect(nativeMobileExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(operatingSystemRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Supported operating systems')
    .expect(await extractInnerText(operatingSystemRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Apple')
    .expect(await extractInnerText(operatingSystemRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Android')
    .expect(await extractInnerText(operatingSystemRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Other')
    .expect(operatingSystemRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Additional operating system information')
    .expect(await extractInnerText(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Android 4.1 and above, IOS 10.6 and above.')
    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(mobileFirstRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Designed with a mobile first approach')
    .expect(await extractInnerText(mobileFirstRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Yes')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumMemoryRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Minimum memory requirement')
    .expect(await extractInnerText(minimumMemoryRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('4GB')
    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(storageDescriptionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Additional storage requirements')
    .expect(await extractInnerText(storageDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('You will need at least 4GB of free space on each device the application is installed. It is advised to use an external SD card for additional storage.')
    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Minimum connection speed required')
    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('1Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Connection types supported')
    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('GPRS')
    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('3G')
    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('4G')
    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Wifi')
    .expect(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Additional information about connection types')
    .expect(await extractInnerText(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Average data usage will vary depending on application activity.')
    .expect(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Third party components required')
    .expect(await extractInnerText(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('The application supports and requires an authenticator on each device the application is installed. You will need a software-based authenticator that implements a two-step verification service.')
    .expect(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Device capabilities required')
    .expect(await extractInnerText(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('In order to use our file hosting services, the application will require permission to access device storage.')
    .expect(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Hardware requirements')
    .expect(await extractInnerText(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('To fully utilise our print functionality within the application, you will need a WiFi or Bluetooth connected printer to connect and print documents straight from the device.')
    .expect(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Additional information')
    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('It is possible that it may install on other platforms or versions not listed in this section. However, support is limited to systems that meet the minimum requirements.')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok();
});

test('when existing marketing data - The client application type section and native-desktop section should be rendered', async (t) => {
  await pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const nativeDesktopExpandableSection = Selector('[data-test-id="view-section-native-desktop"]');
  const nativeDesktopExpandableSectionTable = Selector('[data-test-id="view-section-table-native-desktop"]');
  const operatingSystemDescriptionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-operating-systems-description"]');
  const minimumConnectionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const minimumMemoryRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-memory-requirement"]');
  const storageDescriptionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-storage-requirements-description"]');
  const minimumCPURow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-cpu"]');
  const recommendedResolutionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-recommended-resolution"]');
  const thirdPartyComponentsRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-third-party-components"]');
  const deviceCapabilitiesRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-device-capabilities"]');
  const hardwareRequirementsRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements"]');
  const additionalInformationRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(await extractInnerText(clientApplicationTypesSection.find('h3'))).eql('Client application type')

    .expect(nativeDesktopExpandableSection.exists).ok()
    .expect(await extractInnerText(nativeDesktopExpandableSection)).eql('Native desktop application')
    .expect(nativeDesktopExpandableSection.find('details[open]').exists).notOk()
    .click(nativeDesktopExpandableSection.find('summary'))
    .expect(nativeDesktopExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Supported operating systems')
    .expect(await extractInnerText(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Windows 7 and above.')
    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Minimum connection speed required')
    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('2Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumMemoryRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Minimum memory requirement')
    .expect(await extractInnerText(minimumMemoryRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('4GB')
    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(storageDescriptionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Additional storage requirements')
    .expect(await extractInnerText(storageDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('You will need at least 2.5GB of free space on each device the application is installed.')
    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumCPURow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Minimum necessary CPU power')
    .expect(await extractInnerText(minimumCPURow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Intel Core i5-4460 (3.4GHz) Quad-core or Better.')
    .expect(minimumCPURow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(recommendedResolutionRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Recommended desktop aspect ratio and screen resolution')
    .expect(await extractInnerText(recommendedResolutionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('16:9 - 1920 x 1080')
    .expect(recommendedResolutionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Third party components required')
    .expect(await extractInnerText(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('To fully utilise the letter template functionality, you will need a fully licensed version of Microsoft Word 2013 or higher.')
    .expect(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Device capabilities required')
    .expect(await extractInnerText(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('In order to use our branded wireless Dictaphone, the device will require Bluetooth.')
    .expect(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Hardware requirements')
    .expect(await extractInnerText(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('To fully utilise the transcribing functionality within the application, you will need to purchase our branded wireless Dictaphone.')
    .expect(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Additional information')
    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('It is possible that it may install on other platforms or versions not listed in this section. However, support is limited to systems that meet the minimum requirements.')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok();
});

test('when existing marketing data - The hosting type public cloud section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypePublicCloudExpandableSection = Selector('[data-test-id="view-section-hosting-type-public-cloud"]');
  const hostingTypePublicCloudExpandableSectionTable = Selector('[data-test-id="view-section-hosting-type-public-cloud"]');

  const summaryRow = hostingTypePublicCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-summary"]');
  const requiresHSCNRow = hostingTypePublicCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-requires-hscn"]');

  await t
    .expect(hostingTypesSection.exists).ok()
    .expect(await extractInnerText(hostingTypesSection.find('h3'))).eql('Hosting type')

    .expect(hostingTypePublicCloudExpandableSection.exists).ok()
    .expect(await extractInnerText(hostingTypePublicCloudExpandableSection)).eql('Public cloud')
    .expect(hostingTypePublicCloudExpandableSection.find('details[open]').exists).notOk()
    .click(hostingTypePublicCloudExpandableSection.find('summary'))
    .expect(hostingTypePublicCloudExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-summary"]'))).eql('Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-link"]'))).eql('www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting')
    .expect(summaryRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(requiresHSCNRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('This Solution requires a HSCN/N3 connection')
    .expect(requiresHSCNRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('when existing marketing data - The hosting type private cloud section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypePrivateCloudExpandableSection = Selector('[data-test-id="view-section-hosting-type-private-cloud"]');
  const hostingTypePrivateCloudExpandableSectionTable = Selector('[data-test-id="view-section-hosting-type-private-cloud"]');

  const summaryRow = hostingTypePrivateCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-summary"]');
  const hostingModelRow = hostingTypePrivateCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-hosting-model"]');
  const requiresHSCNRow = hostingTypePrivateCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-requires-hscn"]');

  await t
    .expect(hostingTypesSection.exists).ok()
    .expect(await extractInnerText(hostingTypesSection.find('h3'))).eql('Hosting type')

    .expect(hostingTypePrivateCloudExpandableSection.exists).ok()
    .expect(await extractInnerText(hostingTypePrivateCloudExpandableSection)).eql('Private cloud')
    .expect(hostingTypePrivateCloudExpandableSection.find('details[open]').exists).notOk()
    .click(hostingTypePrivateCloudExpandableSection.find('summary'))
    .expect(hostingTypePrivateCloudExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-summary"]'))).eql('Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-link"]'))).eql('www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting')
    .expect(summaryRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Data center hosting model')
    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Our managed data center is hosted in two separate geographical locations, they both comply to the highest standards to ensure that even if one of our data centers suffers an outage, we can ensure that your daily activities are not interrupted. We also create a back up of all of our data every evening and store it separately, so in the result of any catastrophic failure, we can ensure that patient confidential information is kept secure.')
    .expect(hostingModelRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(requiresHSCNRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('This Solution requires a HSCN/N3 connection')
    .expect(requiresHSCNRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('when existing marketing data - The hosting type hybrid section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypeHybridExpandableSection = Selector('[data-test-id="view-section-hosting-type-hybrid"]');
  const hostingTypeHybridExpandableSectionTable = Selector('[data-test-id="view-section-hosting-type-hybrid"]');
  const summaryRow = hostingTypeHybridExpandableSectionTable.find('[data-test-id="view-section-table-row-summary"]');
  const hostingModelRow = hostingTypeHybridExpandableSectionTable.find('[data-test-id="view-section-table-row-hosting-model"]');
  const requiresHSCNRow = hostingTypeHybridExpandableSectionTable.find('[data-test-id="view-section-table-row-requires-hscn"]');

  await t
    .expect(hostingTypesSection.exists).ok()
    .expect(await extractInnerText(hostingTypesSection.find('h3'))).eql('Hosting type')

    .expect(hostingTypeHybridExpandableSection.exists).ok()
    .expect(await extractInnerText(hostingTypeHybridExpandableSection)).eql('Hybrid')
    .expect(hostingTypeHybridExpandableSection.find('details[open]').exists).notOk()
    .click(hostingTypeHybridExpandableSection.find('summary'))
    .expect(hostingTypeHybridExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-summary"]'))).eql('Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-link"]'))).eql('www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting')
    .expect(summaryRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Data center hosting model')
    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Our managed data center is hosted in two separate geographical locations, they both comply to the highest standards to ensure that even if one of our data centers suffers an outage, we can ensure that your daily activities are not interrupted. We also create a back up of all of our data every evening and store it separately, so in the result of any catastrophic failure, we can ensure that patient confidential information is kept secure.')
    .expect(hostingModelRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(requiresHSCNRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('This Solution requires a HSCN/N3 connection')
    .expect(requiresHSCNRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('when existing marketing data - The hosting type on premise section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypeOnPremiseExpandableSection = Selector('[data-test-id="view-section-hosting-type-on-premise"]');
  const hostingTypeOnPremiseExpandableSectionTable = Selector('[data-test-id="view-section-hosting-type-on-premise"]');
  const summaryRow = hostingTypeOnPremiseExpandableSectionTable.find('[data-test-id="view-section-table-row-summary"]');
  const hostingModelRow = hostingTypeOnPremiseExpandableSectionTable.find('[data-test-id="view-section-table-row-hosting-model"]');
  const requiresHSCNRow = hostingTypeOnPremiseExpandableSectionTable.find('[data-test-id="view-section-table-row-requires-hscn"]');

  await t
    .expect(hostingTypesSection.exists).ok()
    .expect(await extractInnerText(hostingTypesSection.find('h3'))).eql('Hosting type')

    .expect(hostingTypeOnPremiseExpandableSection.exists).ok()
    .expect(await extractInnerText(hostingTypeOnPremiseExpandableSection)).eql('On premise')
    .expect(hostingTypeOnPremiseExpandableSection.find('details[open]').exists).notOk()
    .click(hostingTypeOnPremiseExpandableSection.find('summary'))
    .expect(hostingTypeOnPremiseExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-summary"]'))).eql('Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-link"]'))).eql('www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting')
    .expect(summaryRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-title"]'))).eql('Data center hosting model')
    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Our managed data center is hosted in two separate geographical locations, they both comply to the highest standards to ensure that even if one of our data centers suffers an outage, we can ensure that your daily activities are not interrupted. We also create a back up of all of our data every evening and store it separately, so in the result of any catastrophic failure, we can ensure that patient confidential information is kept secure.')
    .expect(hostingModelRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(requiresHSCNRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('This Solution requires a HSCN/N3 connection')
    .expect(requiresHSCNRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('when no existing marketing data - The About supplier section should not be rendered', async (t) => {
  await pageSetup(t);

  const aboutSupplierSection = Selector('[data-test-id="view-about-supplier"]');

  await t
    .expect(aboutSupplierSection.exists).notOk();
});

test('when existing marketing data - The About supplier section and all questions should be rendered', async (t) => {
  await pageSetup(t, true);

  const aboutSupplierSection = Selector('[data-test-id="view-about-supplier"]');
  const descriptionQuestion = aboutSupplierSection.find('[data-test-id="view-section-question-description"]');
  const linkQuestion = aboutSupplierSection.find('[data-test-id="view-section-question-link"]');

  await t
    .expect(aboutSupplierSection.exists).ok()
    .expect(await extractInnerText(aboutSupplierSection.find('h3'))).eql('About supplier')

    .expect(descriptionQuestion.exists).ok()
    .expect(descriptionQuestion.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(await extractInnerText(descriptionQuestion.find('[data-test-id="view-question-data-text-description"]'))).eql('The supplier description data')

    .expect(linkQuestion.exists).ok()
    .expect(linkQuestion.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(await extractInnerText(linkQuestion.find('[data-test-id="view-question-data-link"]'))).eql('http://www.supplier.com');
});

test('when no existing marketing data - The contact-details section should not be rendered', async (t) => {
  await pageSetup(t);

  const contactDetailsSection = Selector('[data-test-id="view-solution-contact-details"]');

  await t
    .expect(contactDetailsSection.exists).notOk();
});

test('when existing marketing data - The contact-details section should be rendered', async (t) => {
  await pageSetup(t, true);

  const contactDetailsSection = Selector('[data-test-id="view-solution-contact-details"]');
  const contact1Details = contactDetailsSection.find('[data-test-id="view-section-question-contact-1"]');
  const contact1DepartmentName = contact1Details.find('[data-test-id="view-question-data-text-department-name"]');
  const contact1ContactName = contact1Details.find('[data-test-id="view-question-data-text-contact-name"]');
  const contact1PhoneNumber = contact1Details.find('[data-test-id="view-question-data-text-phone-number"]');
  const contact1EmailAddress = contact1Details.find('[data-test-id="view-question-data-text-email-address"]');

  const contact2Details = contactDetailsSection.find('[data-test-id="view-section-question-contact-2"]');
  const contact2DepartmentName = contact2Details.find('[data-test-id="view-question-data-text-department-name"]');
  const contact2ContactName = contact2Details.find('[data-test-id="view-question-data-text-contact-name"]');
  const contact2PhoneNumber = contact2Details.find('[data-test-id="view-question-data-text-phone-number"]');
  const contact2EmailAddress = contact2Details.find('[data-test-id="view-question-data-text-email-address"]');

  await t
    .expect(contactDetailsSection.exists).ok()
    .expect(await extractInnerText(contactDetailsSection.find('h3'))).eql('Contact details')

    .expect(contact1Details.exists).ok()
    .expect(await extractInnerText(contact1DepartmentName)).eql('One Department')
    .expect(await extractInnerText(contact1ContactName)).eql('Contact One')
    .expect(await extractInnerText(contact1PhoneNumber)).eql('111111111')
    .expect(await extractInnerText(contact1EmailAddress)).eql('contact@one.com')

    .expect(contact2Details.exists).ok()
    .expect(await extractInnerText(contact2DepartmentName)).eql('Two Department')
    .expect(await extractInnerText(contact2ContactName)).eql('Contact Two')
    .expect(await extractInnerText(contact2PhoneNumber)).eql('222222222')
    .expect(await extractInnerText(contact2EmailAddress)).eql('contact@two.com');
});

test('when no existing marketing data - The roadmap section should not be rendered', async (t) => {
  await pageSetup(t);

  const roadmapSection = Selector('[data-test-id="view-roadmap"]');

  await t
    .expect(roadmapSection.exists).notOk();
});

test('when existing marketing data - The roadmap section should be rendered', async (t) => {
  await pageSetup(t, true);

  const roadmapSection = Selector('[data-test-id="view-roadmap"]');
  const summaryQuestion = roadmapSection.find('[data-test-id="view-section-question-summary"]');

  await t
    .expect(roadmapSection.exists).ok()
    .expect(await extractInnerText(roadmapSection.find('h3'))).eql('Roadmap')

    .expect(summaryQuestion.exists).ok()
    .expect(await extractInnerText(summaryQuestion.find('[data-test-id="view-question-data-text-summary"]'))).eql('The roadmap summary details');
});

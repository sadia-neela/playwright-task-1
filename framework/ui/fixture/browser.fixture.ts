import { test as base, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import Browser from '../../ui/browser/browser';

type CustomFixtures = {
  customBrowser: Browser;
};

export const test = base.extend<CustomFixtures>({
  customBrowser: async ({ page, baseURL }, use, testInfo) => {
    const downloadDir = path.join(testInfo.outputDir, 'downloads');
    await fs.mkdir(downloadDir, { recursive: true });

    const myBrowser = new Browser(page, downloadDir);

    if (baseURL) {
      await myBrowser.openUrl(baseURL);
    }

    await use(myBrowser);
  },
});

export { expect };

// browser.fixture.ts
import { test as base, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import Browser from '../../ui/browser/browser';
import UserApiClient from '../../api/userApiClient';
import { user } from '../../../testData/userInfo';
import { USER } from '../../../types/userInfotype';

type CustomFixtures = {
  customBrowser: Browser;
  testUser: USER;
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

  testUser: async ({ request, baseURL }, use) => {
    const apiClient = new UserApiClient(request, baseURL ?? 'https://automationexercise.com/');
    const newUser: USER = { ...user, email: `fusefabric${Date.now()}@gmail.com` };

    const response = await apiClient.createUser(newUser);
    expect(response.responseCode, 'User should be created successfully via API').toBe(201);
    console.log(`User with email '${newUser.email}' created successfully`);

    await use(newUser);

    try {
      const deleteResponse = await apiClient.deleteUser(newUser.email, newUser.password);
      console.log(`User with email '${newUser.email}' deleted successfully with message: ${deleteResponse.message}`);
    } catch (cleanupError) {
      console.error(`Cleanup failed for user '${newUser.email}':`, cleanupError);
    }
  },
});

export { expect };

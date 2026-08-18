import * as path from 'path';
import { test, Page, BrowserContext } from '@playwright/test';

export default class Browser {
  private _page: Page;
  private _pages: Page[];
  private _downloadDir: string;

  /**
   * Initializes the Browser wrapper and tracks open tabs.
   * @param page - Playwright Page instance
   * @param downloadDir - Isolated directory for downloads
   */
  constructor(page: Page, downloadDir: string) {
    this._page = page;
    this._pages = [page];
    this._page.on('close', () => { 
      this._pages = this._pages.filter(p => p !== this._page); 
    });
    this._downloadDir = downloadDir;

    // Subscribe to the 'page' event to track newly opened tabs
    page.context().on('page', (newPage: Page) => {
      if (!this._pages.includes(newPage)) {
        this._pages.push(newPage);
      }

      // Subscribe to the 'close' event to remove the tab from the tracking array
      newPage.on('close', () => {
        this._pages = this._pages.filter(p => p !== newPage);
      });
    });
  }

  /**
   * Gets the currently active Playwright Page instance.
   * @returns The active page
   */
  get page(): Page {
    return this._page;
  }

  /**
   * Navigates to the specified URL, encapsulated within a reporting step.
   * @param url - The URL to navigate to
   * @returns Promise that resolves when navigation completes
   */
  async openUrl(url: string): Promise<void> {
    await test.step(`Browser — Open URL: "${url}"`, async () => {
      await this._page.goto(url, { waitUntil: 'domcontentloaded' });
    });
  }

  /**
   * Retrieves the current URL of the active tab, encapsulated within a reporting step.
   * @returns The current URL
   */
  async getCurrentUrl(): Promise<string> {
    return await test.step('Browser — Get current URL', async () => {
      return this._page.url();
    });
  }

  /**
   * Reloads the current page, encapsulated within a reporting step.
   * @returns Promise that resolves when reload completes
   */
  async refresh(): Promise<void> {
    await test.step('Browser — Refresh page', async () => {
      await this._page.reload();
    });
  }

  /**
   * Navigates to the previous page in history, encapsulated within a reporting step.
   * @returns Promise that resolves when navigation completes
   */
  async navigateBack(): Promise<void> {
    await test.step('Browser — Navigate back', async () => {
      await this._page.goBack();
    });
  }

  /**
   * Navigates to the next page in history, encapsulated within a reporting step.
   * @returns Promise that resolves when navigation completes
   */
  async navigateForward(): Promise<void> {
    await test.step('Browser — Navigate forward', async () => {
      await this._page.goForward();
    });
  }

  /**
   * Accepts an alert dialog triggered by the provided action, encapsulated within a reporting step.
   * @param actionCallback - Action that triggers the alert
   * @returns Promise that resolves when alert is handled
   */
  async acceptAlert(actionCallback: () => Promise<void> | void): Promise<void> {
    await test.step('Browser — Accept alert dialog', async () => {
      const listener = async (dialog: any) => await dialog.accept();
      this._page.on('dialog', listener);

      try {
        await actionCallback();
      } finally {
        this._page.off('dialog', listener);
      }
    });
  }

  /**
   * Opens a new tab and optionally navigates to a URL, encapsulated within a reporting step.
   * @param url - Optional URL to navigate to after opening the tab
   * @returns The new page instance
   */
  async newTab(url?: string): Promise<Page> {
    return await test.step(
      url ? `Browser — Open new tab and navigate to: "${url}"` : 'Browser — Open new tab',
      async () => {
        const newPage = await this._page.context().newPage();

        // Explicitly add to tracking in case the context 'page' event hasn't fired yet
        if (!this._pages.includes(newPage)) {
          this._pages.push(newPage);
        }

        // Update the active page reference immediately
        this._page = newPage;

        if (url) {
          await this.openUrl(url);
        }

        return newPage;
      }
    );
  }

  /**
   * Switches focus to the tab at the specified index, encapsulated within a reporting step.
   * @param index - Index of the tab to switch to
   * @returns Promise that resolves when tab switching completes
   * @throws {Error} If the index is out of bounds
   */
  async switchToTab(index: number): Promise<void> {
    await test.step(`Browser — Switch to tab index [${index}]`, async () => {
      this._pages = this._pages.filter(p => !p.isClosed());

      if (index < 0 || index >= this._pages.length) {
        throw new Error(`Tab index ${index} is out of bounds. Open tabs: ${this._pages.length}`);
      }

      // Update the single source of truth for the active page
      this._page = this._pages[index];
      await this._page.bringToFront();
    });
  }

  /**
   * Clicks a link that opens a new tab and waits for it to load, encapsulated within a reporting step.
   * @param clickCallback - Action that triggers the new tab
   * @returns The new page instance
   */
  async openLinkInNewTab(clickCallback: () => Promise<void> | void): Promise<Page> {
    return await test.step('Browser — Open link in new tab', async () => {
      const context: BrowserContext = this._page.context();
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        clickCallback(),
      ]);

      await newPage.waitForLoadState();

      // Update the single source of truth for the active page
      this._page = newPage;
      return newPage;
    });
  }

  /**
   * Closes the tab at the specified index, encapsulated within a reporting step.
   * @param index - Index of the tab to close
   * @returns Promise that resolves when tab is closed
   * @throws {Error} If the index is out of bounds
   */
  async closeTab(index: number): Promise<void> {
    await test.step(`Browser — Close tab index [${index}]`, async () => {
      if (index < 0 || index >= this._pages.length) {
        throw new Error(`Tab index ${index} is out of bounds. Open tabs: ${this._pages.length}`);
      }

      const pageToDelete = this._pages[index];
      if (!pageToDelete.isClosed()) await pageToDelete.close();

      this._pages = this._pages.filter(p => !p.isClosed());
      if (this._page?.isClosed()) {
        this._page = this._pages.at(-1) ?? null as any;
      }
    });
  }

  /**
   * Returns the count of currently open tabs, encapsulated within a reporting step.
   * @returns The number of open tabs
   */
  async getTabsCount(): Promise<number> {
    return await test.step('Browser — Get tabs count', async () => {
      return this._pages.filter(p => !p.isClosed()).length;
    });
  }

  /**
   * Waits for a download event triggered by the action and saves the file, encapsulated within a reporting step.
   * @param action - Action that triggers the download
   * @param fileName - Name of the file to save
   * @returns The file path where the download was saved
   */
  async downloadAndSave(action: () => Promise<void> | void, fileName: string): Promise<string> {
    return await test.step(`Browser — Download and save file: "${fileName}"`, async () => {
      const [download] = await Promise.all([
        this._page.waitForEvent('download'),
        action(),
      ]);

      const filePath: string = path.join(this._downloadDir, fileName);
      await download.saveAs(filePath);

      return filePath;
    });
  }
}

import Element from './Element';
import { Locator } from '@playwright/test';
import { test } from '@playwright/test';

export class TextBox extends Element {
	constructor(locator: Locator, name: string) {
      super(locator, name);
	}

	async typeText(text: string): Promise<void> {
		await test.step(`type '${this._name}' — Type text: "${text}"`, async () => {
			await this._locator.pressSequentially(text);
		});
	}

	async setText(text: string): Promise<void> {
		await test.step(`set '${this._name}' — Set text: "${text}"`, async () => {
			await this._locator.fill(text);
		});
	}

	async getValue(): Promise<string> {
		return await test.step(`get '${this._name}' — Get value`, async () => {
			return await this._locator.inputValue();
		});
	}
}

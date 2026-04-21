import { Locator, Page } from '@playwright/test';
import { expect } from '@fixtures/base';

export class LoginPage {
    readonly page: Page;
    readonly root: Locator;

    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('div#kc-content');

        this.usernameInput = this.root.getByRole('textbox', { name: /Username or email/i });
        this.passwordInput = this.root.getByRole('textbox', { name: /Password/i });
        this.signInButton = this.root.getByRole('button', { name: /Sign In/i });
    }
}

import { APIRequestContext, test } from '@playwright/test';
import  { USER } from '../../types/userInfotype';

export type ApiResponseType = {
  responseCode: number;
  message: string;
};
export default class UserApiClient {
    private readonly request: APIRequestContext;
    private readonly baseUrl: string;

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    async createUser(userData: USER): Promise<ApiResponseType> {
        return await test.step('Create a new user via API', async () => {
            const response = await this.request.post(`${this.baseUrl}api/createAccount`, {
                form: userData as unknown as Record<string, string>,
            });
            const body: ApiResponseType = await response.json();
            if (body.responseCode !== 201) {
                throw new Error(`Failed to create user. Response code: ${body.responseCode}, Message: ${body.message}`);
            }
            return {
                responseCode: body.responseCode,
                message: body.message,
            };
        });
    }

    async deleteUser(email: string, password: string): Promise<ApiResponseType> {
        return await test.step('Delete user via API', async () => {
            const response = await this.request.delete(`${this.baseUrl}api/deleteAccount`, {
                form: { email, password },
            });
            const body: ApiResponseType = await response.json();
            if (body.responseCode !== 200) {
                throw new Error(`Failed to delete user with email '${email}'. Response code: ${body.responseCode}, Message: ${body.message}`);
            }
            return {
                responseCode: body.responseCode,
                message: body.message,
            };
        });
    }
}

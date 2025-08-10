import { Client, Account, Databases, Functions } from 'https://esm.sh/appwrite@14.0.1';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from './utils/config';

const client = new Client();

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export default client;

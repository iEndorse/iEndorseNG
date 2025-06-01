import { Client, Account} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6740872e00170c4e822f'); // Replace with your project ID

export const  account = new Account(client);
export { ID } from 'appwrite';

/* Import Appwrite modules */
import { Account, ID } from "react-native-appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';

/* Import the client */
import client from "@/lib/backend/client";

/* Define the account object */
const account = new Account(client);

/* Define and export the Auth class */
export default class Auth {
    /* Define the authentication methods */
    static async pswauth(email: string, password: string) {
        const session = await account.createEmailPasswordSession(email, password);  // Create the session    

        /* Save information about the session */
        await AsyncStorage.setItem("expire", session["expire"]);
    }

    /* Define the method to get the user data */
    static async getData() : Promise<any> {
        const expiration = await AsyncStorage.getItem("expire");
        if (!expiration) return null;
        if (expiration && new Date(expiration) < new Date()) {
            await AsyncStorage.removeItem("expire"); // Remove the information about the session expiration
            return null;
        } else {
            return await account.get();
        }
    }

    /* Define the new user registration method */
    static async register(username: string, email: string, password: string) {
        await account.create(ID.unique(), email, password, username); // Create the user

        // TODO: Remove the next part and add the verification steps (e.g. email verification)

        await Auth.pswauth(email, password); // Log in the user
    }

    /* Define the logout method */
    static async logout() {
        await AsyncStorage.removeItem("expire"); // Remove the information about the session expiration
        await account.deleteSession("current"); // Delete the current session
    }
}
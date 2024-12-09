/* Import Appwrite modules */
import { Account, ID , Client} from "react-native-appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';

/* Import the client */
import client from "@/lib/backend/client";
import Profile from "@/lib/backend/profile";

/* Define the account object */
const account = new Account(client);
const profile = new Profile();

/* Define and export the Auth class */
export default class Auth {
    /* Define the authentication methods */
    static async pswauth(email: string, password: string) {
        /* Delete the session if it exists */
        await account.deleteSession("current");

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
            const account_info = await account.get();
            const profile_info = await profile.getInfo(account_info.email);
            return {...account_info, ...profile_info};
        }
    }

    /* Define the new user registration method */
    static async register(username: string, email: string, password: string) {
        await account.create(ID.unique(), email, password, username); // Create the user
        // TODO: Remove the next part and add the verification steps (e.g. email verification)
        await Auth.pswauth(email, password); // Log in the user
        await profile.create(email, username); // Create the user profile
    }

    /* Define the logout method */
    static async logout() {
        await AsyncStorage.removeItem("expire"); // Remove the information about the session expiration
        await account.deleteSession("current"); // Delete the current session
    }

    /* Define the password reset method */
    static async changePassword(currentPassword: string, newPassword: string) {
        try {
            // Retrieve the current user's email
            const user = await account.get();
            const email = user.email;
    
            // Step 1: Update the password directly using the current password and the new password
            await account.updatePassword(newPassword, currentPassword); // This is the correct method
    
            // Step 2: Log out the current session (optional, depends on your app's requirements)
            await account.deleteSession("current");
    
            // Step 3: Log back in with the new password if required by your app
            const newSession = await account.createEmailPasswordSession(email, newPassword);
    
        } catch (error: any) {
            // Log the actual error to understand what went wrong
            console.error("Error in changePassword:", error.response ? error.response : error.message);
    
            // Provide the user with a more specific error message
            if (error.message.includes("Invalid credentials")) {
                throw new Error("Current password is incorrect. Please try again.");
            } else if (error.message.includes("session is active")) {
                throw new Error("A session is still active. Please log out and try again.");
            } else if (error.message.includes("password")) {
                throw new Error("Password update failed. Please ensure your new password is valid.");
            } else {
                throw new Error("Failed to update password. Please try again later.");
            }
        }
    }    
}
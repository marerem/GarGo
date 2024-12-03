import client from "@/lib/backend/client";
import { Storage, ID, Permission, Role } from "react-native-appwrite";
import { DB_SETTINGS } from "@/constants/ProfilePicture"; // Import your profile settings


/* Define the ProfilePicture class */
export default class ProfilePicture {
    id: string | null = null; // ID of the profile picture in storage
    userID: string | null = null; // ID of the associated user
    previewUrl: string | null = null; // Store the preview URL for the profile picture

    constructor(userID: string) {
        if (!userID) {
            throw new Error("User ID is required to create a ProfilePicture instance.");
        }
        this.userID = userID;
    }

    /* Upload image to Appwrite storage */
    public async uploadImage(image: { uri: string; type: string; size: number }) {
        if (!this.userID) {
            throw new Error("User ID is required to upload a profile picture.");
        }
        const storage = new Storage(client);
        const imageID = ID.unique();
        try {
            console.log('Uploading image:', image); // Debugging statement
            const result = await storage.createFile(
                DB_SETTINGS.PROFILE_BUCKET_ID,
                imageID,
                {
                    name: `${this.userID}_profile_picture`,
                    uri: image.uri,
                    type: image.type,
                    size: image.size,
                },
                [
                    Permission.read(Role.user(this.userID)),
                    Permission.write(Role.user(this.userID))
                ]
            );

            this.id = result.$id; // Store the document ID of the uploaded image

            this.previewUrl = this.getAppwritePreviewUrl(
                DB_SETTINGS.PROFILE_BUCKET_ID,
                result.$id,
                DB_SETTINGS.PROJECT_ID
            );
            console.log("Image uploaded successfully:", this.previewUrl);
            return result;
        } catch (error) {
            console.error(`Error uploading image: ${error.message}`); // Debugging statement
            throw new Error(`Error uploading image: ${error.message}`);
        }
    }

     /* Generate the preview URL for the image */
    private getImagePreview(imageID: string) {
        return new Storage(client).getFilePreview(DB_SETTINGS.PROFILE_BUCKET_ID, imageID);
    }

    private getAppwritePreviewUrl(bucketID: string, fileID: string, projectID: string): string {
        return `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${fileID}/view?project=${projectID}`;
    }
    
    /* Create a new profile picture */
    async createProfilePicture(image: { uri: string; type: string; size: number }) {
        // If the user already has a profile picture, remove the old one first
        if (this.id) {
            await this.removeProfilePicture();
        }

        // Upload the new profile picture
        const result = await this.uploadImage(image);

        // Optionally: Create a document in the database to associate the image with the user (if required)
        // Here, we are just tracking the profile picture for simplicity.

        return result;
    }

    /* Remove the profile picture */
    async removeProfilePicture() {
        if (!this.id) {
            throw new Error("No profile picture to remove.");
        }

        const storage = new Storage(client);
        await storage.deleteFile(DB_SETTINGS.PROFILE_BUCKET_ID, this.id); // Remove the image from storage

        // Clear the ID and preview URL after deletion
        this.id = null;
        this.previewUrl = null;

        // Optionally: Remove the database document if you created one (not implemented here)
    }

    /* Update the current profile picture with a new one */
    async update(image: { uri: string; type: string; size: number }) {
        if (this.id) {
            await this.removeProfilePicture(); // Delete the existing profile picture if it exists
        }

        await this.uploadImage(image); // Upload the new profile picture
    }

    /* Get the preview URL of the profile picture */
    async getProfilePicturePreview() {
        if (!this.previewUrl) {
            throw new Error("No profile picture preview found.");
        }

        return this.previewUrl; // Return the preview URL
    }
    /* Images management functions */
}

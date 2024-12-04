/* Import Appwrite modules */
import { Databases, ID , Query, Client} from "react-native-appwrite";

/* Import the client */
import client from "@/lib/backend/client";
import { DB_SETTINGS } from "@/constants/auth";

/* Define the profile class */
class Profile {
    async create(email: string, username: string) {
        /* Connect to the DB */
        const DB = new Databases(client);

        /* Create the user document */
        await DB.createDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.USER_COLLECTION_ID,
            ID.unique(),
            {
                email: email,
                username: username
            }
        );

    }

    async getInfo(email: string) {
        const DB = new Databases(client);
        const user = await DB.listDocuments(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.USER_COLLECTION_ID,
            [Query.equal("email", email)]
        );        
        return user;
    }
}

export default Profile;
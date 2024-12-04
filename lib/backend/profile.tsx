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

    async set_name(email: string, first_name: string, last_name: string) {  
        const DB = new Databases(client);
        const user = await DB.listDocuments(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.USER_COLLECTION_ID,
            [Query.equal("email", email)]
        );        
        await DB.updateDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.USER_COLLECTION_ID,
            user.documents[0].$id,
            {
                first_name: first_name,
                last_name: last_name
            }
        );
    }

    async set_phone(email: string, phone: string) {
        const DB = new Databases(client);
        const user = await DB.listDocuments(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.USER_COLLECTION_ID,
            [Query.equal("email", email)]
        );        
        await DB.updateDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.USER_COLLECTION_ID,
            user.documents[0].$id,
            {
                phone: phone
            }
        );
    }
}

export default Profile;
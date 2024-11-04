/* Import Appwrite modules */
import { Client } from "react-native-appwrite";

/* Define the settings for the Appwrite client */
const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    project: "6728e2c90039161a6de4",
    platform: "com.jsm.cargo",
};

/* Create the Appwrite client */
const client = new Client();

/* Set the Appwrite configuration */
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.project)
  .setPlatform(appwriteConfig.platform);

/* Export the Appwrite client */
export default client;
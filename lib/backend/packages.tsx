/* Import all the required modules */
import client from "@/lib/backend/client";
import { Databases, ID, Storage, Query } from "react-native-appwrite";
import { DB_SETTINGS, LIMIT_IMAGES, PackageStatus, Volume} from "@/constants/packages";

/* Define the package class */
export default class Package {
    /**
     * This class defines the Package entity and should be used as a wrapper to communcate with the database.
     * Don't modify the data directly but rather use the setters. They will check the validity of the data and will throw an error if it is not valid.
     * For this reason it's useful to wrap the setters in a try-catch block and display the error message to the user if the data is not valid.
     * 
     * The main functions of this class are:
     * - Create a new package (create): This will upload the images to the server and create a new document in the database. This function should be called after creating the object and setting all the data.
     * - Update an existing package (update): This will update the document in the database. This function should be called after setting all the modified data.
     * - Delete an existing package (delete): This will delete the document in the database and all the images associated with the package.
     * - Get a list of packages and define the filters (getPackages): This will return a list of packages that match the filters. No need to limit the number of packages returned as the function will do it automatically.
     */


    /* Define all the variables */
    id: string | null = null;
    senderID: string | null = null;
    title: string | null = null;
    description: string | null = null;
    src_lang: number | null = null;
    src_long: number | null = null;
    src_full_address: string | null = null;
    dest_lang: number | null = null;
    dest_long: number | null = null;
    dest_full_address: string | null = null;
    weight: number | null = null;
    volume: Volume | null = null;
    status: PackageStatus = PackageStatus.Pending;
    imagesIDs: string[] = [];
    previewsUrls: URL[] = [];

    /* Define create, modify and delete methods */
    async create(senderID: string, images: { uri: string; type: string; size: number }[]) {
        /* Check that there is the right number of images */
        if (images.length > LIMIT_IMAGES.MAX || images.length < LIMIT_IMAGES.MIN) {
            throw new Error("The number of uploaded images is not valid (min: "+LIMIT_IMAGES.MIN+", max: "+LIMIT_IMAGES.MAX+")")
        }

        /* Set the senderID */
        this.senderID = senderID;

        /* Create a storage object */
        const storage = new Storage(client);

        /* Upload all the images to the server */
        for(let i = 0; i < images.length; i++) {
            /* Modify some stuff of the image */
            let image = images[i];
            const imageID = ID.unique()
            
            /* Resize the image to a smaller size to reduce the storage and bandwidth usage */
            image.uri = this.getImageResized(image.uri);

            /* Create the file */
            await storage.createFile(DB_SETTINGS.PACKAGES_BUCKET_ID, imageID, {
                name: imageID,
                uri: image.uri,
                type: image.type,
                size: image.size
            });

            /* Generate the preview url */
            this.previewsUrls.push(this.getImagePreview(imageID));
            this.imagesIDs.push(imageID);
        }

        /* Create the package in the database */
        const database = new Databases(client);
        this.id = ID.unique(); // Upload the document with a unique ID
        await database.createDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.PACKAGES_COLLECTION_ID,
            this.id,
            {
                title: this.title,
                description: this.description,
                src_lang: this.src_lang,
                src_long: this.src_long,
                src_full_address: this.src_full_address,
                dest_lang: this.dest_lang,
                dest_long: this.dest_long,
                dest_full_address: this.dest_full_address,
                weight: this.weight,
                volume: this.volume,
                images_ids: this.imagesIDs,
                status: this.status,
                senderID: this.senderID
            }
        );
    }

    async update() {
        /* Check if the package is valid */
        if (this.id === null) {
            throw new Error("You cannot update a package that has not been created yet");
        }

        /* Update the package in the database */
        const database = new Databases(client);
        await database.updateDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.PACKAGES_COLLECTION_ID,
            this.id,
            {
                title: this.title,
                description: this.description,
                src_lang: this.src_lang,
                src_long: this.src_long,
                src_full_address: this.src_full_address,
                dest_lang: this.dest_lang,
                dest_long: this.dest_long,
                dest_full_address: this.dest_full_address,
                weight: this.weight,
                volume: this.volume,
                images_ids: this.imagesIDs,
                status: this.status,
                senderID: this.senderID
            }
        );
    }

    async delete() {
        /* Check if the package is valid */
        if (this.id === null) {
            throw new Error("You cannot delete a package that has not been created yet");
        }

        /* Delete all the images associated with the package */
        for(let i = 0; i < this.imagesIDs.length; i++) {
            (new Storage(client)).deleteFile(DB_SETTINGS.PACKAGES_BUCKET_ID, this.imagesIDs[i]);
        }

        /* Delete the package from the database */
        const database = new Databases(client);
        await database.deleteDocument(DB_SETTINGS.DB_ID, DB_SETTINGS.PACKAGES_COLLECTION_ID, this.id);
    }

    /* Define the setter for the title */
    setTitle(title: string) {
        /* Check presence of the title */
        if (title === null) {
            throw new Error("The title is missing");
        }

        /* Check that the title length is valid */
        if (title.length > 100) {
            throw new Error("The title is too long");
        } else if (title.length === 0) {
            throw new Error("The title is too short");
        }

        this.title = title;
    }

    /* Define the setter for the description */
    setDescription(description: string) {
        /* Check presence of the description */
        if (description === null) {
            throw new Error("The description is missing");
        }

        /* Check that the description length is valid */
        if (description.length > 500) {
            throw new Error("The description is too long");
        } else if (description.length === 0) {
            throw new Error("The description is too short");
        }

        this.description = description;
    }

    /* Define the setter for the weight */
    setWeight(weight: number) {
        /* Check presence of the weight */
        if (weight === null) {
            throw new Error("The weight is missing");
        }

        /* Check that the weight is valid */
        if (weight <= 0) {
            throw new Error("The weight is invalid");
        }

        this.weight = weight;
    }

    /* Define the setter for the volume */
    setVolume(volume: Volume) {
        /* Check presence of the volume */
        if (volume === null) {
            throw new Error("The volume is missing");
        }

        /* Check that the volume is valid */
        if (!Object.values(Volume).includes(volume)) {
            throw new Error("The volume is invalid");
        }

        this.volume = volume;
    }

    setInfo(title: string, description: string, weight: number, volume: Volume) {
        this.setTitle(title);
        this.setDescription(description);
        this.setWeight(weight);
        this.setVolume(volume);
    }

    /* Define the source location setter */
    setSourceLocation(lang: number, long: number, full_address: string) {
        /* Check that the parameters are valid */
        this.destinationValid(lang, long, full_address)

        /* Set the source location */
        this.src_lang = lang;
        this.src_long = long;
        this.src_full_address = full_address;
    }

    /* Define the destination location setter */
    destinationValid(lang: number | null = null, long: number | null = null, full_address: string | null = null) {
        /* Check if the destination location is valid */
        if (lang === null || long === null || full_address === null) {
            throw new Error("One or more required fields are missing");
        }

        /* Check that the values are within the valid range */
        if (lang < -90 || lang > 90 || long < -180 || long > 180) {
            throw new Error("The latitude and longitude values are invalid");
        }

        /* Check that the length of the address is valid */
        if (full_address.length > 150) {
            throw new Error("The address is too long");
        } else if (full_address.length === 0) {
            throw new Error("The address is too short");
        }        
    }

    setDestinationLocation(lang: number, long: number, full_address: string) {
        /* Check that the parameters are valid */
        this.destinationValid(lang,long,full_address)

        /* Set the destination location */
        this.dest_lang = lang;
        this.dest_long = long;
        this.dest_full_address = full_address;
    }

    /* Images management functions */
    getImagePreview(id: string) {
        return (new Storage(client)).getFilePreview(DB_SETTINGS.PACKAGES_BUCKET_ID, id);
    }
    getImageResized(uri: string) {
        // TODO: Implement the image resizing function
        return uri;
    }

    /* Remove an image */
    removeImage(id: string) {
        /* Check if the object is valid */
        if (this.id === null) {
            throw new Error("You cannot remove an image from an object that has not been created yet");
        }

        /* Check if the number of images is valid */
        if (this.imagesIDs.length <= LIMIT_IMAGES.MIN) {
            throw new Error("The minimum number of images has been reached");
        }

        /* Check if the image exists */
        if (!this.imagesIDs.includes(id)) {
            throw new Error("The image does not exist");
        }

        /* Remove the image from the list */
        this.imagesIDs.splice(this.imagesIDs.indexOf(id), 1);

        /* Remove the preview url */
        this.previewsUrls.splice(this.imagesIDs.indexOf(id), 1);

        /* Remove the image from the server */
        (new Storage(client)).deleteFile(DB_SETTINGS.PACKAGES_BUCKET_ID, id);

        /* Update the database image list */
        (new Databases(client)).updateDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.PACKAGES_COLLECTION_ID,
            this.id,
            {
                images_ids: this.imagesIDs
            }
        );
    }
    uploadImage(image: { uri: string; type: string; size: number }) {
        /* Check if the object is valid */
        if (this.id === null) {
            throw new Error("You cannot upload an image to an object that has not been created yet");
        }

        /* Check that there is space for the image */
        if (this.imagesIDs.length >= LIMIT_IMAGES.MAX) {
            throw new Error("The maximum number of images has been reached");
        }

        /* Create a storage object */
        const storage = new Storage(client);

        /* Modify some stuff of the image */
        const imageID = ID.unique()
        
        /* Resize the image to a smaller size to reduce the storage and bandwidth usage */
        image.uri = this.getImageResized(image.uri);

        /* Create the file */
        storage.createFile(DB_SETTINGS.PACKAGES_BUCKET_ID, imageID, {
            name: imageID,
            uri: image.uri,
            type: image.type,
            size: image.size
        });

        /* Generate the preview url */
        this.previewsUrls.push(this.getImagePreview(imageID));
        this.imagesIDs.push(imageID);

        /* Update the database image list */
        (new Databases(client)).updateDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.PACKAGES_COLLECTION_ID,
            this.id,
            {
                images_ids: this.imagesIDs
            }
        );
        
        /* Return the ID of the newly created image */
        return imageID;
    }

    /* Selection methods */
    static async getPackages(queries: Array<string>, limit=10) {
        /* Note: Never load all the packages at once, always use a query to filter the results */

        /* Create the database object */
        const database = new Databases(client);

        /* Append the limit query to the queries */
        queries.push(Query.limit(limit));

        /* Get the results */
        const result = await database.listDocuments(
            DB_SETTINGS.DB_ID, // databaseId
            DB_SETTINGS.PACKAGES_COLLECTION_ID, // collectionId
            queries // filters
        );

        /* Convert the results to packages */
        let packages: Package[] = []
        for (let i = 0; i < result.documents.length; i++) {
            /* Create a new package */
            packages.push(new Package())
            
            /* Set the other information */
            packages[i].id = result.documents[i].$id
            packages[i].senderID = result.documents[i].senderID
            packages[i].title = result.documents[i].title
            packages[i].description = result.documents[i].description
            packages[i].src_lang = result.documents[i].src_lang
            packages[i].src_long = result.documents[i].src_long
            packages[i].src_full_address = result.documents[i].src_full_address
            packages[i].dest_lang = result.documents[i].dest_lang
            packages[i].dest_long = result.documents[i].dest_long
            packages[i].dest_full_address = result.documents[i].dest_full_address
            packages[i].weight = result.documents[i].weight
            packages[i].volume = result.documents[i].volume
            packages[i].status = result.documents[i].status
            packages[i].imagesIDs = result.documents[i].images_ids
            packages[i].previewsUrls = []
            for (let j = 0; j < packages[i].imagesIDs.length; j++) {
                packages[i].previewsUrls.push(packages[i].getImagePreview(packages[i].imagesIDs[j]))
            }
        }

        /* Return the packages */
        return packages;
    }
}
export { PackageStatus, Volume };
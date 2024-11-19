/* Import all the required modules */
import client from "@/lib/backend/client";
import { Databases, ID, Storage } from "react-native-appwrite";

/* Define the database ID and collection name */
const DB_ID = "672906a800238300cad3";
const PACKAGES_COLLECTION_ID = "673b99e8000a42e78980";
const PACKAGES_BUCKET_ID = "673baa3d001086dde1d9";
const MIN_IMAGES = 1;
const MAX_IMAGES = 5;

enum PackageStatus {
    Pending = "created", // The package is waiting for a driver to be assigned
    InTransit = "assigned", // The package is being delivered
    Delivered = "delivered", // The package has been delivered
    Cancelled = "cancelled", // The package has been cancelled
    Assigned = "assigned" // The package has been assigned to a driver
}

enum Volume {
    XS = "XS", // Extra small
    S = "S", // Small
    M = "M", // Medium
    L = "L", // Large
    XL = "XL", // Extra large
    XXL = "XXL", // Extra extra large
    XXXL = "XXXL" // Extra extra extra large
}

export default class Package {
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
        /* Check if the package is valid */
        this.infoValid(this.title, this.description, this.weight, this.volume)
        this.destinationValid(this.dest_lang, this.dest_long, this.dest_full_address)
        this.destinationValid(this.src_lang, this.src_long, this.src_full_address)

        /* Check that there is the right number of images */
        if (images.length > MAX_IMAGES || images.length < MIN_IMAGES) {
            throw new Error("The number of uploaded images is not valid (min: "+MIN_IMAGES+", max: "+MAX_IMAGES+")")
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
            //console.log(image.uri)

            /* Create the file */
            await storage.createFile(PACKAGES_BUCKET_ID, imageID, {
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
            DB_ID,
            PACKAGES_COLLECTION_ID,
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

        /* Clear internal variables needed for uploading */
        images = []
    }

    async update() {
        /* Check if the package is valid */
        if (this.id === null) {
            throw new Error("You cannot update a package that has not been created yet");
        }
        this.infoValid(this.title, this.description, this.weight, this.volume)
        this.destinationValid(this.dest_lang, this.dest_long, this.dest_full_address)
        this.destinationValid(this.src_lang, this.src_long, this.src_full_address)

        /* Update the package in the database */
        const database = new Databases(client);
        await database.updateDocument(
            DB_ID,
            PACKAGES_COLLECTION_ID,
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
            (new Storage(client)).deleteFile(PACKAGES_BUCKET_ID, this.imagesIDs[i]);
        }

        /* Delete the package from the database */
        const database = new Databases(client);
        await database.deleteDocument(DB_ID, PACKAGES_COLLECTION_ID, this.id);
    }

    /* Define the general information setter */
    infoValid(title: string | null = null, description: string | null = null, weight: number | null = null, volume: Volume | null = null) {
        /* Check if the general information is valid */
        if (title === null || description === null || weight === null || volume === null) {
            throw new Error("One or more required fields are missing");
        }
        
        /* Check that the title length is valid */
         if (title.length > 100) {
            throw new Error("The title is too long");
        } else if (title.length === 0) {
            throw new Error("The title is too short");
        }
        
        /* Check that the weight is valid */
        if (weight <= 0) {
            throw new Error("The weight and volume must be greater than 0");
        }
    }

    setInfo(title: string, description: string, weight: number, volume: Volume) {
        /* Check the validity of the attributes */
        this.infoValid(title, description, weight, volume)

        /* Set the general information */
        this.title = title;
        this.description = description;
        this.weight = weight;
        this.volume = volume;
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
        return (new Storage(client)).getFilePreview(PACKAGES_BUCKET_ID, id);
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
        if (this.imagesIDs.length <= MIN_IMAGES) {
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
        (new Storage(client)).deleteFile(PACKAGES_BUCKET_ID, id);

        /* Update the database image list */
        (new Databases(client)).updateDocument(
            DB_ID,
            PACKAGES_COLLECTION_ID,
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
        if (this.imagesIDs.length >= MAX_IMAGES) {
            throw new Error("The maximum number of images has been reached");
        }

        /* Create a storage object */
        const storage = new Storage(client);

        /* Modify some stuff of the image */
        const imageID = ID.unique()
        
        /* Resize the image to a smaller size to reduce the storage and bandwidth usage */
        image.uri = this.getImageResized(image.uri);

        /* Create the file */
        storage.createFile(PACKAGES_BUCKET_ID, imageID, {
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
            DB_ID,
            PACKAGES_COLLECTION_ID,
            this.id,
            {
                images_ids: this.imagesIDs
            }
        );
    }

    /** SELECTION PART BELOW **/
    // Note: Always return an array of objects of the Package class (unless it's clear that only one element it's expected)
    static loadById(id: string) {
        throw new Error("Function not yet implemented");
    }
}

export { PackageStatus, Volume };
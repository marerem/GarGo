/* Import all the required modules */
import client from "@/lib/backend/client";
import { Databases, ID, Storage, Query } from "react-native-appwrite";
import { DB_SETTINGS, LIMIT_IMAGES, PackageStatus, Volume} from "@/constants/packages";

/* Define the Delivery class */
class Delivery {
    /* Define all the variables */
    id: string | null = null;
    src_lang: number | null = null;
    src_long: number | null = null;
    src_full_address: string | null = null;
    dst_lang: number | null = null;
    dst_long: number | null = null;
    dst_full_address: string | null = null;
    packageId: string | null = null;
    seatAvailability: boolean[] = [];
    travelMethods: string | null = null;
    travelTime: string | null = null;

    /* Define create, update, delete methods */

    async create(packageId: string) {
        /* Set the package ID */
        this.packageId = packageId;

        /* Validate required fields */
        if (!this.src_full_address || !this.dst_full_address ) {
            throw new Error("Missing required fields to create a delivery");
        }
        /* Generate a unique ID for the delivery */
        this.id = ID.unique();

        /* Create the delivery in the database */
        const database = new Databases(client);
        
        try {

        await database.createDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.DELIVERY_COLLECTION_ID,
            this.id,
            {
                src_lang: this.src_lang,
                src_long: this.src_long,
                src_full_address: this.src_full_address,
                dst_lang: this.dst_lang,
                dst_long: this.dst_long,
                dst_full_address: this.dst_full_address,
                packageId: this.packageId,
                seatAvailability: this.seatAvailability,
                travelMethods: this.travelMethods,
                travelTime: this.travelTime,
            }
        );
    }
    catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
    }

    async update() {
        /* Ensure the delivery exists */
        if (!this.id) {
            throw new Error("Cannot update a delivery that has not been created yet");
        }

        /* Update the delivery in the database */
        const database = new Databases(client);
        await database.updateDocument(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.DELIVERY_COLLECTION_ID,
            this.id,
            {
                src_lang: this.src_lang,
                src_long: this.src_long,
                src_full_address: this.src_full_address,
                dst_lang: this.dst_lang,
                dst_long: this.dst_long,
                dst_full_address: this.dst_full_address,
                packageId: this.packageId,
                seatAvailability: this.seatAvailability,
                travelMethods: this.travelMethods,
                travelTime: this.travelTime,
            }
        );
    }

    async delete() {
        /* Ensure the delivery exists */
        if (!this.id) {
            throw new Error("Cannot delete a delivery that has not been created yet");
        }

        /* Delete the delivery from the database */
        const database = new Databases(client);
        await database.deleteDocument(DB_SETTINGS.DB_ID, DB_SETTINGS.DELIVERY_COLLECTION_ID, this.id);
    }

    /* Define setters */

    setSourceLocation(lang: number, long: number, full_address: string) {
        this.validateLocation(lang, long, full_address);
        this.src_lang = lang;
        this.src_long = long;
        this.src_full_address = full_address;
    }

    setDestinationLocation(lang: number, long: number, full_address: string) {
        this.validateLocation(lang, long, full_address);
        this.dst_lang = lang;
        this.dst_long = long;
        this.dst_full_address = full_address;
    }

    setSeatAvailability(seatAvailability: boolean[]) {
        if (!Array.isArray(seatAvailability)) {
            throw new Error("Seat availability must be an array of booleans");
        }
        this.seatAvailability = seatAvailability;
    }

    setTravelMethods(travelMethods: string) {
        if (!travelMethods) {
            throw new Error("Travel methods cannot be empty");
        }
        this.travelMethods = travelMethods;
    }

    setTravelTime(travelTime: string) {
        if (!travelTime) {
            throw new Error("Travel time cannot be empty");
        }
        this.travelTime = travelTime;
    }

    /* Validation helper */
    validateLocation(lang: number, long: number, full_address: string) {
        if (lang < -90 || lang > 90 || long < -180 || long > 180) {
            throw new Error("Invalid latitude or longitude");
        }
        if (!full_address || full_address.length > 150) {
            throw new Error("Invalid full address");
        }
    }

    /* Static method to fetch deliveries */
    static async getDeliveries(queries: Array<string>, limit = 10) {
        /* Create the database object */
        const database = new Databases(client);

        /* Append the limit query to the queries */
        queries.push(Query.limit(limit));

        /* Get the results */
        const result = await database.listDocuments(
            DB_SETTINGS.DB_ID,
            DB_SETTINGS.DELIVERY_COLLECTION_ID,
            queries
        );

        /* Convert the results to Delivery objects */
        return result.documents.map((doc: any) => {
            const delivery = new Delivery();
            delivery.id = doc.$id;
            delivery.src_lang = doc.src_lang;
            delivery.src_long = doc.src_long;
            delivery.src_full_address = doc.src_full_address;
            delivery.dst_lang = doc.dst_lang;
            delivery.dst_long = doc.dst_long;
            delivery.dst_full_address = doc.dst_full_address;
            delivery.packageId = doc.packageId;
            delivery.seatAvailability = doc.seatAvailability;
            delivery.travelMethods = doc.travelMethods;
            delivery.travelTime = doc.travelTime;
            return delivery;
        });
    }
}

export default Delivery;

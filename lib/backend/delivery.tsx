/* Import all the required modules */
import client from "@/lib/backend/client";
import { Databases, ID, Storage, Query } from "react-native-appwrite";

/* Define the delivery class */
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
}
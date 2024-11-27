/* Define some DB settings */
export const DB_SETTINGS = {
    "DB_ID": "672906a800238300cad3",
    "PACKAGES_COLLECTION_ID": "673b99e8000a42e78980",
    "PACKAGES_BUCKET_ID": "673baa3d001086dde1d9",
    "DELIVERY_COLLECTION_ID" : "6743821b0039cd6a570f"
}

/* Define some constants */
export const LIMIT_IMAGES = { "MIN": 1, "MAX": 5 }

/* Define some enums */
export enum PackageStatus { Pending = "created", InTransit = "assigned", Delivered = "delivered", Cancelled = "cancelled"}
export enum Volume { XS = "XS", S = "S", M = "M", L = "L", XL = "XL", XXL = "XXL", XXXL = "XXXL" }
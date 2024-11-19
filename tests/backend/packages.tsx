import Package, {PackageStatus, Volume} from "@/lib/backend/packages"
import * as DocumentPicker from "expo-document-picker";
import { Query } from "react-native-appwrite";

export async function testCreation(idUser: string) {
    /* Create a new package */
    const p = new Package()

    /* Add the information */
    p.setInfo("Package title", "Package description", 0.4, Volume.XL)
    p.setSourceLocation(46.52057464463359, 6.567904750445805,"Av. Piccard, 1015 Lausanne (Bar Satellite)")
    p.setDestinationLocation(46.524651379631365, 6.575738129312184,"Rte de Praz Véguey 29, 1022 Chavannes-près-Renens")

    /* Pick some images */
    const images = await DocumentPicker.getDocumentAsync({type: "image/*", multiple: true})
    let images_info : {uri: string, type: string, size: number}[] = []
    images['assets']!.forEach((image: any) => {
        console.log(image)
        images_info.push({uri: image.uri, type: image.mimeType, size: image.size})
    });

    /* Create the package */
    await p.create(idUser, images_info)

    /* Modify the title of the package */
    p.setInfo("New title", "New description", p.weight!, p.volume!)

    /* Modify the package */
    await p.update()

    /* Delete the package */
    await p.delete()
}

export async function testLoading() {
    let packages = await Package.getPackages([
        Query.equal('title', ['Package title box']),
    ])
    console.log(packages)
}
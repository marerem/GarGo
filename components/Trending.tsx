import { ScrollView, View, TouchableOpacity } from "react-native";
import ParcelCard from "./ParcelCard";

const Trending = ({ packages, onParcelPress }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {packages.map((pkg, index) => (
        <View key={pkg.id || index} style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={() => onParcelPress(pkg)}>
            <ParcelCard
              title={pkg.title}
              images={pkg.previewsUrls ? [pkg.previewsUrls[0].href] : []}
              creator={pkg.senderID}
              avatar={undefined}
              pickup={pkg.src_full_address}
              dropoff={pkg.dest_full_address}
              description={pkg.description}
              volume={pkg.volume}
              weight={pkg.weight}
            />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default Trending;
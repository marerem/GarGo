import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, Alert, TouchableOpacity, Modal, ScrollView } from "react-native";


import { images } from "../../constants";
import ParcelCard from "@/components/ParcelCard";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { useAuthContext } from "@/context/AuthProvider";
import Package, { PackageStatus } from "@/lib/backend/packages";
import { Query } from "react-native-appwrite";
import client from "@/lib/backend/client";

const Home = () => {

  const { user } = useAuthContext();
  const [packages, setPackages] = useState<Package[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to fetch all packages
  const fetchPackages = async () => {
    if (!user?.$id) {
      return;
    }

    try {
      const pkgs = await Package.getPackages([
        Query.limit(100)
      ]);
      
      // Log the complete raw package object
      pkgs.forEach(pkg => {
        console.log('Complete Package Object:', JSON.stringify(pkg, null, 2));
      });
      
      const userPackages = pkgs.filter(pkg => 
        pkg.senderID === user.$id || pkg.deliverID === user.$id
      );
      setPackages(userPackages);
      
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPackages();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPackages();
    setRefreshing(false);
  };

  const handleDelete = async (parcel) => {
    try {
      Alert.alert(
        "Delete Parcel",
        "Are you sure you want to delete this parcel?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await parcel.delete();
              setModalVisible(false);
              await fetchPackages();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete parcel");
    }
  };

  // Get latest packages from the main packages array
  const latestPackages = packages.slice(0, 5);  // Take first 5 packages for trending

  const handleParcelPress = (parcel) => {
    setSelectedParcel(parcel);
    setModalVisible(true);
  };

  const renderParcelCard = ({ item }) => (
    <View key={item.id} style={{ marginBottom: 10 }}>
      <ParcelCard
        title={item.title}
        images={item.previewsUrls ? [item.previewsUrls[0].href] : []}
        creator={item.senderID}
        deliver={item.deliverID}
        avatar={undefined}
        pickup={item.src_full_address}
        dropoff={item.dest_full_address}
        description={item.description}
        volume={item.volume}
        weight={item.weight}
        onPress={() => handleParcelPress(item)}
        onMenuPress={() => handleParcelPress(item)}
      />
    </View>
  );

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id}
        renderItem={renderParcelCard}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.name || "Guest"}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Packages
              </Text>

              <Trending packages={latestPackages} onParcelPress={handleParcelPress} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Packages Found"
            subtitle="No packages created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-11/12 max-h-[80%]">
            <ScrollView>
              <Text className="text-xl font-bold mb-4">{selectedParcel?.title}</Text>
              
              <Text className="font-bold mt-4 mb-2">Package Images:</Text>
              <ScrollView horizontal className="mb-4">
                {selectedParcel?.previewsUrls?.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url.href }}
                    className="w-40 h-40 rounded-lg mr-2"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              <Text className="font-bold">Details:</Text>
              <Text>Created by: {user?.name}</Text>
              <Text>Description: {selectedParcel?.description}</Text>
              <Text>Pickup: {selectedParcel?.src_full_address}</Text>
              <Text>Dropoff: {selectedParcel?.dest_full_address}</Text>
              <Text>Volume: {selectedParcel?.volume}</Text>
              <Text>Weight: {selectedParcel?.weight}kg</Text>
              <Text>
                Delivered by: {selectedParcel?.deliverID ? selectedParcel.deliverID : 'Not assigned yet'}
              </Text>
              <Text className="text-gray-500">
                (Debug - Raw deliverID value: {JSON.stringify(selectedParcel?.deliverID)})
              </Text>
              
              <View className="flex-row items-center mt-2">
                <Text className="font-bold">Delivery Status: </Text>
                <View className={`w-3 h-3 rounded-full ml-2 ${selectedParcel?.status === 'assigned' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <Text className="ml-2">
                  {selectedParcel?.status === 'assigned' ? 'Assigned' : 'Pending'}
                </Text>
              </View>
              
              {selectedParcel?.status === 'assigned' && (
                <Text className="mt-1">Assigned to: {selectedParcel?.deliverName || 'Unknown Courier'}</Text>
              )}
              
              <View className="flex-row space-x-2 mt-6">
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  className="flex-1 bg-gray-500 py-3 rounded-lg"
                >
                  <Text className="text-white text-center">Close</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleDelete(selectedParcel)}
                  className="flex-1 bg-red-500 py-3 rounded-lg"
                >
                  <Text className="text-white text-center">Delete</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

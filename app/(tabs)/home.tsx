import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, Alert, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Databases, Query } from "react-native-appwrite";

import { images } from "../../constants";
import ParcelCard from "@/components/ParcelCard";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { useAuthContext } from "@/context/AuthProvider";
import Package, { PackageStatus } from "@/lib/backend/packages";
import client from "@/lib/backend/client";

const Home = () => {

  const { user } = useAuthContext();
  const [packages, setPackages] = useState<Package[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [delivererName, setDelivererName] = useState("");
  const [delivererPhone, setDelivererPhone] = useState("");

  // Function to fetch all packages
  const fetchPackages = async () => {
    if (!user?.$id) {
      return;
    }

    try {
      const pkgs = await Package.getPackages([
        Query.limit(100)
      ]);
      
      
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

  const handleCancelDelivery = async (parcel) => {
    try {
      Alert.alert(
        "Cancel Delivery",
        "Are you sure you want to cancel this delivery?",
        [
          {
            text: "No",
            style: "cancel"
          },
          {
            text: "Yes",
            style: "destructive",
            onPress: async () => {
              try {
                console.log('Attempting to update package:', parcel.id);
                console.log('Current status:', parcel.status);
                console.log('Current deliverID:', parcel.deliverID);
                
                // Fetch packages (since it's async, you must await it)
                const packages = await Package.getPackages([Query.equal('$id', [parcel.id])]);
          
                if (packages && packages.length > 0) {
                  // Update the package status
                  packages[0].setStatus(PackageStatus.Pending);
                  packages[0].setDeliverID(null);
                  await packages[0].update();
                }
                
                console.log('Update successful');
                setModalVisible(false);
                await fetchPackages();
              } catch (updateError) {
                console.error('Error during update:', updateError);
                Alert.alert("Error", "Failed to update package status");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in cancel delivery:', error);
      Alert.alert("Error", "Failed to cancel delivery");
    }
  };

  const handleMarkDelivered = async (parcel) => {
    try {
      Alert.alert(
        "Delivered",
        "Are you sure you want to mark this package as delivered?",
        [
          {
            text: "No",
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                const packages = await Package.getPackages([Query.equal('$id', [parcel.id])]);
        
                if (packages && packages.length > 0) {
                  packages[0].setStatus(PackageStatus.Delivered);
                  await packages[0].update();
                }
                
                console.log('Package marked as delivered');
                setModalVisible(false);
                await fetchPackages();
              } catch (updateError) {
                console.error('Error marking as delivered:', updateError);
                Alert.alert("Error", "Failed to update package status");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error marking as delivered:', error);
      Alert.alert("Error", "Failed to mark as delivered");
    }
  };

  // Modify the trending packages section to exclude delivered packages
  const senderPackages = packages
    .filter(pkg => pkg.senderID === user.$id)
    .slice(0, 5);  // Take first 5 packages for trending

  const delivererPackages = packages
    .filter(pkg => 
      pkg.deliverID === user.$id && 
      pkg.status !== 'delivered'  // Add this condition to exclude delivered packages
    )
    .slice(0, 5);  // Take first 5 packages for trending

  const handleParcelPress = async (parcel) => {
    setSelectedParcel(parcel);
    setModalVisible(true);
    const senderDetails = await fetchUserName(parcel.senderID);
    setSenderName(senderDetails.name);
    setSenderPhone(senderDetails.phone);

    // Fetch deliverer details if deliverID exists
    if (parcel.deliverID) {
      const delivererDetails = await fetchUserName(parcel.deliverID);
      setDelivererName(delivererDetails.name);
      setDelivererPhone(delivererDetails.phone);
    } else {
      setDelivererName("");
      setDelivererPhone("");
    }
  };

  // Add this helper function to determine if delete is allowed
  const isDeleteAllowed = (parcel) => {
    return parcel.senderID === user.$id && parcel.status !== PackageStatus.InTransit;
  };

  // Modify the fetchUserName function to also fetch phone
  const fetchUserName = async (userId) => {
    try {
      console.log('Fetching user details for ID:', userId);
      const databases = new Databases(client);
      
      // First try to list documents with a query to find matching userID
      const users = await databases.listDocuments(
        '672906a800238300cad3',    // your database ID
        '673b9b9d003ac5d78762',    // your users collection ID
        [
          Query.equal('userID', userId)  // Assuming 'userID' is the field name in your users collection
        ]
      );

      if (users.documents.length > 0) {
        const user = users.documents[0];
        return {
          name: `${user.first_name} ${user.last_name}`,
          phone: user.phone || 'No phone number'
        };
      }
      
      throw new Error('User not found');
    } catch (error) {
      console.error('Error fetching user details:', error);
      return { 
        name: 'Unknown User', 
        phone: 'No phone number' 
      };
    }
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
        onMenuPress={
          item.status === PackageStatus.Delivered 
            ? undefined 
            : () => handleParcelPress(item)
        }
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
                Your Sent Packages
              </Text>
              <Trending 
                packages={senderPackages} 
                onParcelPress={handleParcelPress}
                disableDelete={(pkg) => !isDeleteAllowed(pkg)}
              />

              <Text className="text-lg font-pregular text-gray-100 mb-3 mt-6">
                Your Delivery Jobs
              </Text>
              <Trending packages={delivererPackages} onParcelPress={handleParcelPress} />
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
          <View className="bg-white rounded-lg p-6 w-11/12 max-h-[80%] relative">
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              className="absolute right-4 top-4 z-10"
            >
              <Text className="text-red-500 text-xl font-bold">✕</Text>
            </TouchableOpacity>

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
              <Text>Created by: {senderName || selectedParcel?.senderID}</Text>
              <Text>Phone: {senderPhone}</Text>
              
              <Text>Description: {selectedParcel?.description}</Text>
              <Text>Pickup: {selectedParcel?.src_full_address}</Text>
              <Text>Dropoff: {selectedParcel?.dest_full_address}</Text>
              <Text>Volume: {selectedParcel?.volume}</Text>
              <Text>Weight: {selectedParcel?.weight}kg</Text>
              <Text>
                Delivered by: {delivererName || 'Not assigned yet'}
              </Text>
              {delivererName && <Text>Deliverer Phone: {delivererPhone}</Text>}
              
              <View className="flex-row items-center mt-2">
                <Text className="font-bold">Delivery Status: </Text>
                <View className={`w-3 h-3 rounded-full ml-2 ${
                  selectedParcel?.status === 'delivered' 
                    ? 'bg-blue-500'
                    : selectedParcel?.status === 'assigned' 
                      ? 'bg-green-500' 
                      : 'bg-yellow-500'
                }`} />
                <Text className="ml-2">
                  {selectedParcel?.status === 'delivered'
                    ? 'Delivered'
                    : selectedParcel?.status === 'assigned'
                      ? 'Assigned'
                      : 'Pending'
                  }
                </Text>
              </View>
              
              <View className="mt-6 space-y-4">
                {selectedParcel?.status !== PackageStatus.Delivered && (
                  selectedParcel?.deliverID === user.$id ? (
                    // Show only delivery-related buttons when user is the deliverer
                    <>
                      <TouchableOpacity 
                        onPress={() => handleMarkDelivered(selectedParcel)}
                        className="w-full py-3 rounded-lg bg-green-500"
                      >
                        <Text className="text-white text-center">Delivered</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        onPress={() => handleCancelDelivery(selectedParcel)}
                        className="w-full py-3 rounded-lg bg-red-500"
                      >
                        <Text className="text-white text-center">Cancel Delivery</Text>
                      </TouchableOpacity>
                    </>
                  ) : selectedParcel?.senderID === user.$id && (
                    // Show delete button only when user is the sender
                    <TouchableOpacity 
                      onPress={() => handleDelete(selectedParcel)}
                      disabled={selectedParcel?.status === PackageStatus.InTransit}
                      className={`w-full py-3 rounded-lg ${
                        selectedParcel?.status === PackageStatus.InTransit
                          ? 'bg-gray-300'
                          : 'bg-red-500'
                      }`}
                    >
                      <Text className="text-white text-center">Delete</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

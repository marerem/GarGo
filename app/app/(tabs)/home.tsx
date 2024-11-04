import { StyleSheet, FlatList, Text, View, Image, RefreshControl, Alert } from 'react-native'
import React from 'react'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import History from '@/components/History';
import EmptyState from '@/components/EmptyState';
import { useState } from "react";
import { getAllPosts } from '@/lib/appwrite';
import useAppwrite  from '@/lib/useAppwrite';
import ParcelCard from '@/components/ParcelCard';
const Home = () => {
  const { data: posts, refetch} = useAppwrite(getAllPosts);
  

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (

    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          //<Text className="text-3xl text-white">{item.title}</Text>
          <ParcelCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View  className="my-6 px4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100 px-6">Welcome  Back</Text>
                <Text className="text-2xl font-psemibold text-white px-6">John Doe</Text>
              </View>
              <View className="mt-1.8">
                <Image
                  source={images.shortlogo}
                  className="w-24 h-10"
                  resizeMode="contain"
                />
              </View>
             </View>
             <SearchInput initialQuery="Search by name or ID" />
             <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                All history is here
              </Text>
              <History posts={[{id : 1},{id : 2},{id : 3}] ?? []}/>
              </View>
          </View>
        )}
        ListEmptyComponent={() => (
        <EmptyState
        title="No history found"
        subtitle="Explore the app, take your first delivery or send a package"
        />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})
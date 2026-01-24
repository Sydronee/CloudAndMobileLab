import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator, SafeAreaView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect } from 'react';

export default function App() {
  const [files, setFiles] = useState([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [loading, setLoading] = useState(false);

  // Initial request permission on load
  useEffect(() => {
    (async () => {
      if (!permissionResponse) {
        await requestPermission();
      }
    })();
  }, []);

  const loadImages = async () => {
    if (!permissionResponse || permissionResponse.status !== 'granted') {
      const response = await requestPermission();
      if (!response.granted) {
        alert('Permission to access media library is required!');
        return;
      }
    }

    setLoading(true);
    try {
      // Get assets (files). On Android, this queries the MediaStore which includes SD card images.
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        first: 20, // Limit to 20 for performance in this demo
        sortBy: [MediaLibrary.SortBy.creationTime]
      });

      // Get detailed info (including EXIF tags) for each asset
      const filesWithTags = await Promise.all(assets.assets.map(async (asset) => {
        try {
          // getAssetInfoAsync retrieves additional metadata including EXIF if available
          const info = await MediaLibrary.getAssetInfoAsync(asset.id);
          return {
            ...asset,
            tags: info.exif || null
          };
        } catch (error) {
          console.log(`Could not get info for ${asset.filename}`, error);
          return { ...asset, tags: null };
        }
      }));

      setFiles(filesWithTags);
    } catch (e) {
      console.error("Error loading images:", e);
      alert('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const renderTag = (tags) => {
    if (!tags || Object.keys(tags).length === 0) return "No tags found";
    
    // Convert tags object to a readable string format
    // taking a few common tags for display
    const interestingTags = [
      'DateTime', 'Model', 'Make', 'FNumber', 'ISOSpeedRatings', 'ExposureTime', 'Orientation'
    ];
    
    const displayTags = Object.entries(tags)
      .filter(([key]) => interestingTags.includes(key) || key.length < 15) // simple filter to keep it readable
      .slice(0, 5) // limit to 5 tags for display
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return displayTags || JSON.stringify(tags).substring(0, 50) + "...";
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.filename}>{item.filename}</Text>
      <Text style={styles.path}>Path: {item.uri}</Text>
      <Text style={styles.tagsHeader}>Tags: </Text>
      <Text style={styles.tags}>
        {renderTag(item.tags)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Image Explorer</Text>
        
        <View style={styles.buttonContainer}>
           <Button title="Load Images from Storage" onPress={loadImages} disabled={loading} />
        </View>

        {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
        
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !loading && <Text style={styles.emptyText}>No images loaded. Click the button to start.</Text>
          }
        />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingTop: 40, 
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  filename: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  path: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  tagsHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  tags: {
    fontSize: 12,
    color: '#e67e22',
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
});

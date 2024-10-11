/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import ManageWallpaper, {TYPE} from 'react-native-manage-wallpaper';

const App = (): React.JSX.Element => {
  const callback = (res: any) => {
    console.log('Response: ', res);
  };

  const setWallpaper = () => {
    ManageWallpaper.setWallpaper(
      {
        uri: 'https://pixabay.com/get/ge23e31f9a70cf93a0770c58ec598fe8f044ebad5515b03da237537aaf13fa641e4a6a51b747111fba8d29ebf5bc36f2cf060b2350af9a4fb7271c3c4c0ed090f_1280.jpg',
      },
      callback,
      TYPE.HOME,
    );
  };
  return (
    <View style={styles.VIEW}>
      <TouchableOpacity style={styles.BUTTON} onPress={setWallpaper}>
        <Text style={styles.TEXT}>Change Home Wallpaper</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  VIEW: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  BUTTON: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    marginBottom: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  TEXT: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default App;

/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {ReactElement, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import ManageWallpaper, {TYPE} from 'react-native-manage-wallpaper';
import * as ImagePicker from 'react-native-image-picker';
import MasonryList from '@react-native-seoul/masonry-list';
import {ImageLibraryOptions} from 'react-native-image-picker';

// file system
var RNFS = require('react-native-fs');

const App = (): React.JSX.Element => {
  const callback = (res: any) => {
    // console.log('Response: ', res);
  };

  // create file
  const createFile = (fileName: any, image: any) => {
    var path = RNFS.DocumentDirectoryPath + `/${fileName}`;
    // var path = RNFS.DownloadDirectoryPath + `/${fileName}`;

    // write the file
    RNFS.writeFile(path, image, 'base64')
      .then((success: any) => {})
      .catch((err: {message: any}) => {});
  };

  // delete file
  const deleteFile = (fileName: string) => {
    // create a path you want to delete
    var path = RNFS.DocumentDirectoryPath + `/${fileName}`;

    return (
      RNFS.unlink(path)
        .then(() => {})
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err: {message: any}) => {})
    );
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

  interface imgInterface {
    source: string;
    width: number | undefined;
    height: number | undefined;
  }
  // launch images library to pick images
  const pickImages = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 10,
    };
    const result: ImagePicker.ImagePickerResponse =
      await ImagePicker.launchImageLibrary(options);

    // we are interested in the 'assets' list from the response
    let imgLs: imgInterface[] = [];

    result?.assets?.map(img => {
      createFile(img.fileName, img.base64);
      imgLs.push({
        // source: RNFS.DocumentDirectoryPath + `/${img.fileName}`,
        source: 'file://' + RNFS.DocumentDirectoryPath + `/${img.fileName}`,
        width: img.width,
        height: img.height,
      });
    });
    // save to list and display

    setimages(imgLs);
    console.log(imgLs);
  };

  // image file list
  const [images, setimages] = useState<imgInterface[]>([]);
  // const [imgPath, setImgPath] = useState();

  const renderItem = ({item, i}): ReactElement => {
    return (
      <View style={styles.imgWrapper}>
        <Image
          src={item.source}
          style={{
            // width: '100%',
            height: Math.floor(Math.random() * (400 - 300)) + 300,
            alignSelf: 'stretch',
            // resizeMode: 'contain',
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.VIEW}>
      <TouchableOpacity onPress={() => pickImages()} style={styles.menuBtn}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
          }}>
          +
        </Text>
      </TouchableOpacity>
      {/* // <View style={styles.menu}>
        //   <TouchableOpacity style={styles.BUTTON} onPress={setWallpaper}>
        //     <Text style={styles.TEXT}>Change Home Wallpaper</Text>
        //   </TouchableOpacity>
        //   <TouchableOpacity style={styles.BUTTON} onPress={() => pickImages()}>
        //     <Text style={styles.TEXT}>Add Images</Text>
        //   </TouchableOpacity>
        // </View> */}

      <View>
        <Text>Header</Text>
      </View>

      <MasonryList
        keyExtractor={item => item.id}
        ListHeaderComponent={<View />}
        contentContainerStyle={{
          paddingHorizontal: 0,
          alignSelf: 'stretch',
        }}
        // onEndReached={() => console.log('onEndReached')}
        numColumns={2}
        data={images}
        renderItem={renderItem}
        // images={images}
      />
      {/* {imgPath && (
        <Image
          style={{width: 100, height: 100}}
          source={{uri: 'file://' + imgPath}}
        />
      )} */}
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  TEXT: {
    // fontSize: 20,
    margin: 5,
    textAlign: 'center',
    color: '#ffffff',
  },

  imgGrid: {},

  imgWrapper: {
    alignItems: 'center',
    alignSelf: 'stretch',
    margin: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },

  menuBtn: {
    position: 'absolute',
    width: 50,
    height: 50,
    elevation: 3,
    borderRadius: 25,
    backgroundColor: '#fff',
    top: 5,
    right: 5,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menu: {
    top: 5,
    right: 5,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
});

export default App;

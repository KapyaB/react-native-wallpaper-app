/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {ReactElement, useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import ManageWallpaper from 'react-native-manage-wallpaper';
import * as ImagePicker from 'react-native-image-picker';
import MasonryList from '@react-native-seoul/masonry-list';
import {ImageLibraryOptions} from 'react-native-image-picker';
import ImageCard from './components/ImageCard';

// file system
var RNFS = require('react-native-fs');

const App = (): React.JSX.Element => {
  const callback = (res: any) => {
    // console.log('Response: ', res);
    if (res.success) {
      onWallpaperSet();
    }
  };

  // display already picked images
  useEffect(() => {
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((result: any) => {
        let imgs: {source: string}[] = [];
        result?.map(img => {
          imgs.push({
            // source: RNFS.DocumentDirectoryPath + `/${img.fileName}`,
            source: 'file://' + img.path,
          });
        });
        setimages(imgs);
      })
      .catch((err: {message: any; code: any}) => {
        console.log(err.message, err.code);
      });
  }, []);

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
  const deleteFile = (filePath: string) => {
    // create a path you want to delete
    // var path = RNFS.DocumentDirectoryPath + `/${fileName}`;

    return (
      RNFS.unlink(filePath)
        .then(() => {})
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err: {message: any}) => {})
    );
  };

  const setWallpaper = (imgUri: string, type: any) => {
    ManageWallpaper.setWallpaper(
      {
        uri: imgUri,
      },
      callback,
      type,
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
  };

  // image file list
  const [images, setimages] = useState<imgInterface[]>([]);
  // const [imgPath, setImgPath] = useState();
  const [showSuccess, setShowSuccess] = useState(false);

  const onWallpaperSet = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const renderItem = ({item, i}): ReactElement => {
    return (
      <ImageCard
        item={item}
        setWallpaper={setWallpaper}
        deleteFile={deleteFile}
      />
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
      {showSuccess && (
        <Text
          style={{
            ...styles.TEXT,
            backgroundColor: '#fff',
            position: 'absolute',
            zIndex: 1,
            bottom: 5,
            fontSize: 16,
            borderRadius: 20,
            color: '#000',
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}>
          Wallpaper Set!
        </Text>
      )}
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
  },
  TEXT: {
    // fontSize: 20,
    margin: 5,
    textAlign: 'center',
    color: '#ffffff',
  },

  imgGrid: {},

  menuBtn: {
    position: 'absolute',
    width: 50,
    height: 50,
    elevation: 5,
    borderRadius: 25,
    backgroundColor: '#fff',
    bottom: 15,
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

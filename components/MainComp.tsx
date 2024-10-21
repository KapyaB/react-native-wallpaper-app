/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, {ReactElement, useEffect, useContext, FC} from 'react';

import {ImageLibraryOptions} from 'react-native-image-picker';
import ImageCard from './ImageCard';
import {AppContext} from '../globalState/AppContext';
import ManageWallpaper from 'react-native-manage-wallpaper';
import * as ImagePicker from 'react-native-image-picker';
import MasonryList from '@react-native-seoul/masonry-list';
import StatusMsg from './reusable/StatusMsg';
import FullScreen from './reusable/FullScreen';
import Header from './Header';

// file system
var RNFS = require('react-native-fs');

const MainComp = (): React.JSX.Element => {
  const {
    theme,
    mood,
    images,
    setImages,
    displayStatusMsg,
    showStatus,
    showFullscreenImg,
  } = useContext(AppContext);

  // const theme = useTheme();
  const styles = stylesHandler(theme);

  const callback = (res: any) => {
    // console.log('Response: ', res);
    if (res.status === 'success') {
      displayStatusMsg('Wallpaper Set!');
    }
  };

  // display already picked images
  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFiles = () => {
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((result: any) => {
        let imgs: {source: string}[] = [];
        // sort results by mtime (date modified)
        result.sort((a: any, b: any) => b.mtime - a.mtime); // b-a - newest first
        result?.map((img: any) => {
          imgs.push({
            // source: RNFS.DocumentDirectoryPath + `/${img.fileName}`,
            source: 'file://' + img.path,
          });
        });
        setImages(imgs);
      })
      .catch(() => {
        // arg- err: {message: any; code: any}
        // console.log(err.message, err.code);
        displayStatusMsg('Error');
      });
  };

  // create file
  const createFile = (fileName: any, image: any) => {
    var path = RNFS.DocumentDirectoryPath + `/${fileName}`;
    // var path = RNFS.DownloadDirectoryPath + `/${fileName}`;

    // write the file
    RNFS.writeFile(path, image, 'base64')
      .then(() => {
        // success: any
      })
      .catch(() => {
        // err: {message: any}
      });
  };

  // delete file
  const deleteFile = (filePath: string) => {
    return (
      RNFS.unlink(filePath)
        .then(() => {
          loadFiles();
          displayStatusMsg('Wallpaper Removed!');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch(() => {
          // err: {message: any}
        })
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
    result?.assets?.map(img => {
      createFile(img.fileName, img.base64);
    });
    // reload images from folder
    loadFiles();
    displayStatusMsg('Wallpaper(s) Added!');
  };

  const renderItem = ({item, i}: {item: any; i: number}): ReactElement => {
    return (
      <ImageCard
        item={item}
        setWallpaper={setWallpaper}
        deleteFile={deleteFile}
        key={i}
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

      <Header />
      {showFullscreenImg && <FullScreen />}
      {images && (
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
      )}
      {showStatus && <StatusMsg />}
    </View>
  );
};

const stylesHandler = (theme: any) =>
  StyleSheet.create({
    VIEW: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
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

export default MainComp;

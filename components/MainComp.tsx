/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, {ReactElement, useEffect, useContext} from 'react';

import {ImageLibraryOptions} from 'react-native-image-picker';
import ImageCard from './ImageCard';
import {AppContext} from '../globalState/AppContext';
import ManageWallpaper from 'react-native-manage-wallpaper';
import * as ImagePicker from 'react-native-image-picker';
import MasonryList from '@react-native-seoul/masonry-list';
import StatusMsg from './reusable/StatusMsg';
import FullScreen from './reusable/FullScreen';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

import uuid from 'react-native-uuid';

// file system
var RNFS = require('react-native-fs');

const MainComp = (): React.JSX.Element => {
  var {
    theme,
    handleThemeChange,
    images,
    setImages,
    displayStatusMsg,
    showStatus,
    showFullscreenImg,
    storeData,
    setHomeWallpaper,
    setLockWallpaper,
    moods,
    defaultMood,
    setMoods,
    currMood,
    setCurrMood,
  } = useContext(AppContext);

  // async storage values
  useEffect(() => {
    AsyncStorage.getItem('theme').then(value => {
      if (value === null) {
      } else {
        handleThemeChange(value);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // retrieve saved wallpapers
  useEffect(() => {
    AsyncStorage.multiGet(['home_wallpaper', 'lock_wallpaper']).then(value => {
      if (value === null) {
      } else {
        setHomeWallpaper(value[0][1]);
        setLockWallpaper(value[1][1]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get saved moods
  useEffect(() => {
    try {
      AsyncStorage.getItem('moods').then(value => {
        setMoods(value != null ? JSON.parse(value) : []);
      });
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface Mood {
    name: string;
    images: string[];
  }
  // get saved current mood, display images from said mood
  useEffect(() => {
    try {
      AsyncStorage.getItem('setMood').then(value => {
        if (value === null) {
        } else {
          const moodObj = moods?.find((m: Mood) => m.name === value);
          setImages((l: string[]) =>
            l.filter((item: string) => moodObj?.images?.includes(item)),
          );
        }
      });
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const theme = useTheme();
  const styles = stylesHandler(theme);

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
          const exts = ['jpg', 'jpeg', 'png', 'webp'];
          const fileExt = img.name.split('.').pop();
          if (exts.includes(fileExt)) {
            imgs.push({
              // source: RNFS.DocumentDirectoryPath + `/${img.fileName}`,
              source: 'file://' + img.path,
            });
          }
        });
        setImages(imgs);
        defaultMood = {name: 'All', images: imgs};
        setCurrMood(defaultMood);
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
    // setWallpaperType(type);
    ManageWallpaper.setWallpaper(
      {
        uri: imgUri,
      },
      (res: any) => {
        if (res.status === 'success') {
          displayStatusMsg('Wallpaper Set!');
          const filePath: string = res.url;
          // const pathLs: String[] = filePath.split('/');
          // const name: String = pathLs[pathLs.length - 1];
          // console.log(name);
          if (type === 'both') {
            try {
              const pair1: [string, string] = ['home_wallpaper', filePath];
              const pair2: [string, string] = ['lock_wallpaper', filePath];
              AsyncStorage.multiSet([pair1, pair2]);
              setHomeWallpaper(filePath);
              setLockWallpaper(filePath);
            } catch (e) {}
          } else {
            storeData(`${type}_wallpaper`, filePath);
            if (type === 'home') {
              setHomeWallpaper(filePath);
            } else if (type === 'lock') {
              setLockWallpaper(filePath);
            }
          }
        }
      },
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
      // create uninque file name from base64 string- first 30 chars after 100th index minus (/)
      const fileExt = img?.fileName?.split('.').pop();
      // const newFileName =
      //   img.base64?.replaceAll('/', '_').slice(100, 130) + `.${fileExt}`;
      const newFileName = uuid.v4().toString() + `.${fileExt}`;
      createFile(newFileName, img.base64);
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
            color: theme.txtColor,
          }}>
          +
        </Text>
      </TouchableOpacity>

      <Header />
      {showFullscreenImg && <FullScreen />}
      {images && (
        <MasonryList
          // keyExtractor={item => item.id}
          ListHeaderComponent={<View />}
          contentContainerStyle={{
            paddingHorizontal: 0,
            alignSelf: 'stretch',
          }}
          // onEndReached={() => console.log('onEndReached')}
          numColumns={2}
          data={currMood?.images}
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
      justifyContent: 'flex-start',
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
      backgroundColor: theme.backgroundColor,
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

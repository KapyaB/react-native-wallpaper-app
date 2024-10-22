/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';

import {TYPE} from 'react-native-manage-wallpaper';
import {AppContext} from '../globalState/AppContext';

import EntypoIcon from '@react-native-vector-icons/entypo';

const ImageCard = ({
  item,
  setWallpaper,
  deleteFile,
}: {
  item: any;
  setWallpaper: Function;
  deleteFile: Function;
}): React.JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);

  const {
    theme,
    setFullscreenImgSrc,
    setShowFullscreenImg,
    homeWallpaper,
    lockWallpaper,
  } = useContext(AppContext);

  // console.log(homeWallpaper, lockWallpaper);

  const styles = stylesHandler(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (!showMenu) {
          // if menu is showing just hide, else go fullscreen
          setFullscreenImgSrc(item.source);
          setShowFullscreenImg(true);
        }
        setShowMenu(false);
      }}>
      {!showMenu && (
        <TouchableOpacity
          style={styles.imgMenuBtn}
          onPress={() => setShowMenu(!showMenu)}>
          <EntypoIcon name="dots-three-horizontal" style={styles.menuBtnIcon} />
        </TouchableOpacity>
      )}
      {(homeWallpaper === item.source || lockWallpaper === item.source) && (
        <View style={styles.wallpaperTypeWrapper}>
          {homeWallpaper === item.source && (
            <EntypoIcon
              name="home"
              size={15}
              color={'#0f0'}
              style={{marginVertical: 3}}
            />
          )}
          {lockWallpaper === item.source && (
            <EntypoIcon
              name="lock"
              size={15}
              color={'#0f0'}
              style={{marginVertical: 3}}
            />
          )}
        </View>
      )}
      {showMenu && (
        <View style={styles.imgMenu}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setWallpaper(item.source, TYPE.HOME);
              setShowMenu(!showMenu);
            }}>
            <Text style={{...styles.text}}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setWallpaper(item.source, TYPE.LOCK);
              setShowMenu(!showMenu);
            }}>
            <Text style={{...styles.text}}>Lockscreen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setWallpaper(item.source, TYPE.BOTH);
              setShowMenu(!showMenu);
            }}>
            <Text style={{...styles.text}}>Both</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              deleteFile(item.source);
              setShowMenu(!showMenu);
            }}>
            <Text style={{...styles.text}}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      <Image
        src={item.source}
        style={{
          // width: '100%',
          height: Math.floor(Math.random() * (400 - 300)) + 300,
          alignSelf: 'stretch',
          // resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

export default ImageCard;

const stylesHandler = (theme: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      alignSelf: 'stretch',
      margin: 2,
      borderRadius: 20,
      overflow: 'hidden',
    },

    text: {
      // fontSize: 20,
      margin: 5,
      textAlign: 'center',
      color: theme.txtColor,
    },

    btn: {
      alignItems: 'center',
    },

    imgMenuBtn: {
      position: 'absolute',
      width: 40,
      height: 40,
      backgroundColor: theme.backgroundColor,
      zIndex: 1,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    menuBtnIcon: {
      color: theme.txtColor,
    },

    imgMenu: {
      width: '50%',
      position: 'absolute',
      zIndex: 1,
      bottom: 5,
      backgroundColor: theme.backgroundColor,
      alignSelf: 'center',
      borderRadius: 6,
    },

    wallpaperTypeWrapper: {
      backgroundColor: '#0008',
      position: 'absolute',
      zIndex: 1,
      left: 5,
      top: 5,
      padding: 5,
      width: 36,
      alignItems: 'center',
      borderRadius: 5,
    },
  });

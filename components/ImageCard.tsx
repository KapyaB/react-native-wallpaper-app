/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';

import {TYPE} from 'react-native-manage-wallpaper';
import {AppContext} from '../globalState/AppContext';

import EntypoIcon from '@react-native-vector-icons/entypo';
import AntDesignIcon from '@react-native-vector-icons/ant-design';

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

  const {setFullscreenImgSrc, setShowFullscreenImg} = useContext(AppContext);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setShowMenu(false);
        setFullscreenImgSrc(item.source);
        setShowFullscreenImg(true);
      }}>
      <TouchableOpacity
        style={styles.imgMenuBtn}
        onPress={() => setShowMenu(!showMenu)}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
          {showMenu ? (
            <AntDesignIcon name="close" style={{color: '#f00'}} />
          ) : (
            <EntypoIcon
              name="dots-three-horizontal"
              style={styles.menuBtnIcon}
            />
          )}
        </Text>
      </TouchableOpacity>
      {showMenu && (
        <View style={styles.imgMenu}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setWallpaper(item.source, TYPE.HOME);
              setShowMenu(!showMenu);
            }}>
            <Text style={{...styles.text, color: '#333'}}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setWallpaper(item.source, TYPE.LOCK);
              setShowMenu(!showMenu);
            }}>
            <Text style={{...styles.text, color: '#333'}}>Lockscreen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setWallpaper(item.source, TYPE.BOTH);
              setShowMenu(!showMenu);
            }}>
            <Text style={{...styles.text, color: '#333'}}>Both</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              deleteFile(item.source);
              setShowMenu(!showMenu);
            }}>
            <Text style={{...styles.text, color: '#333'}}>Delete</Text>
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

const styles = StyleSheet.create({
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
    color: '#ffffff',
  },

  btn: {
    alignItems: 'center',
  },

  imgMenuBtn: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#0008',
    zIndex: 1,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  menuBtnIcon: {
    color: '#fff',
  },

  imgMenu: {
    width: '50%',
    position: 'absolute',
    zIndex: 1,
    bottom: 5,
    backgroundColor: '#fffe',
    alignSelf: 'center',
    borderRadius: 6,
  },
});

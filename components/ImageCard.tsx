/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import {TYPE} from 'react-native-manage-wallpaper';

const ImageCard = ({item, setWallpaper, deleteFile}): React.JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imgMenuBtn}
        onPress={() => setShowMenu(!showMenu)}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
          {showMenu ? 'X' : '...'}
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
            <Text style={styles.text}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setWallpaper(item.source, TYPE.LOCK);
              setShowMenu(!showMenu);
            }}>
            <Text style={styles.text}>Lockscreen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setWallpaper(item.source, TYPE.BOTH);
              setShowMenu(!showMenu);
            }}>
            <Text style={styles.text}>Both</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              deleteFile(item.source);
              setShowMenu(!showMenu);
            }}>
            <Text style={styles.text}>Delete</Text>
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
    </View>
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

  imgMenu: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    backgroundColor: '#0008',
    alignSelf: 'center',
    borderRadius: 6,
  },
});

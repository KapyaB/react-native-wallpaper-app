/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {AppContext} from '../../globalState/AppContext';

const FullScreen = () => {
  const {fullscreenImgSrc, setFullscreenImgSrc, setShowFullscreenImg} =
    useContext(AppContext);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setShowFullscreenImg(false);
        setFullscreenImgSrc();
      }}>
      <Image
        src={fullscreenImgSrc}
        style={{
          width: '100%',
          height: '100%',
          //   alignSelf: 'stretch',
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

export default FullScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffffaa',
  },
});

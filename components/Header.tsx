import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {AppContext} from '../globalState/AppContext';

import EntypoIcon from '@react-native-vector-icons/entypo';

const Header = () => {
  const {mood, theme, setTheme, colorTheme, setColorTheme} =
    useContext(AppContext);
  const styles = stylesHandler(theme);
  return (
    <View style={styles.container}>
      <Text style={{...styles.text, ...styles.logo}}>WallPP</Text>
      <Text style={{...styles.text}}>mood: {mood}</Text>
      <TouchableOpacity style={styles.menuBtn}>
        <EntypoIcon name="menu" size={30} style={styles.text} />
      </TouchableOpacity>
      <View style={styles.settingsWrapper}>
        <Text></Text>
      </View>
    </View>
  );
};

export default Header;

const stylesHandler = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundColor,
      elevation: 5,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 5,
    },
    text: {
      color: theme.txtColor,
    },
    logo: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    menuBtn: {},
    settingsWrapper: {
      position: 'absolute',
      zIndex: 1,
      right: 1,
      top: 0,
    },
  });

/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {AppContext} from '../globalState/AppContext';

import EntypoIcon from '@react-native-vector-icons/entypo';
import FAIcon from '@react-native-vector-icons/fontawesome';
import IonIcon from '@react-native-vector-icons/ionicons';
import AntDesignIcon from '@react-native-vector-icons/ant-design';

const Header = () => {
  const {mood, theme, handleThemeChange, colorTheme} = useContext(AppContext);
  const styles = stylesHandler(theme);

  const [showMenu, setShowMenu] = useState<Boolean>(false);

  // theme switching function
  const switchTheme = () => {
    const themes: any = {
      1: 'system',
      2: 'light',
      3: 'dark',
    };

    let currThemeNum: number = 1;
    switch (colorTheme) {
      case 'system':
        currThemeNum = 1;
        break;
      case 'light':
        currThemeNum = 2;
        break;
      case 'dark':
        currThemeNum = 3;
        break;

      default:
        currThemeNum = 1;
        break;
    }

    const nextTheme: String = themes[currThemeNum < 3 ? currThemeNum + 1 : 1];
    handleThemeChange(nextTheme);
  };
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text style={{...styles.text, ...styles.logo}}>WallPP</Text>
      <Text style={{...styles.text}}>mood: {mood}</Text>
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={() => setShowMenu(!showMenu)}>
        {showMenu ? (
          <AntDesignIcon name="close" size={24} style={{color: '#f00'}} />
        ) : (
          <EntypoIcon name="menu" size={24} style={styles.text} />
        )}
      </TouchableOpacity>
      {showMenu && (
        <View style={styles.settingsWrapper}>
          <View style={styles.setting}>
            <Text style={{...styles.text, ...styles.settingHeader}}>
              Appearance
            </Text>
            <TouchableOpacity
              style={{
                ...styles.themeBtn,
                backgroundColor:
                  colorTheme === 'dark' || colorScheme === 'dark'
                    ? '#fff8'
                    : theme.backgroundColor,
              }}
              onPress={() => switchTheme()}>
              {/* cycle through system, dark, and light */}
              {colorTheme === 'system' && (
                <FAIcon name="mobile-phone" size={24} />
              )}
              {colorTheme === 'light' && (
                <EntypoIcon name="light-up" size={24} />
              )}
              {colorTheme === 'dark' && <IonIcon name="moon" size={24} />}
            </TouchableOpacity>
            <Text style={{...styles.text}}>{colorTheme}</Text>
          </View>
          <View>
            <Text style={{...styles.text, ...styles.settingHeader}}>
              Sync & Interval
            </Text>
            {/* same wallpaper for lock and home */}
            {/* if not same, set different interval for each. e.g. lockscreen could be set to never chnage, but home wallpaper changes daily */}
            {/* automatically change wallpaper every day, week, month, never */}
            {/* set which mood board to cycle through. gray out if cycle set to never*/}
          </View>
        </View>
      )}
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
      zIndex: 1,
    },
    text: {
      color: theme.txtColor,
      marginVertical: 5,
    },
    logo: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'arialrmtb',
    },
    menuBtn: {},
    settingsWrapper: {
      position: 'absolute',
      elevation: 3,
      backgroundColor: theme.backgroundColor,
      padding: 5,
      borderRadius: 3,
      top: 48,
      right: 0,
      alignItems: 'center',
    },

    setting: {
      width: '100%',
      borderRadius: 3,
      alignItems: 'center',
    },
    settingHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      paddingVertical: 3,
      textAlign: 'center',
    },
    themeBtn: {
      backgroundColor: theme.backgroundColor,
      width: 48,
      padding: 5,
      borderRadius: 6,
      alignItems: 'center',
      elevation: 5,
    },
  });

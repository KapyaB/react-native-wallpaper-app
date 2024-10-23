/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TextInput,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import MoodDeletePrompt from './reusable/MoodDeletePrompt';

const Header = () => {
  const {
    defaultMood,
    currMood,
    setCurrMood,
    moods,
    setMoods,
    theme,
    handleThemeChange,
    colorTheme,
    displayStatusMsg,
  } = useContext(AppContext);
  const styles = stylesHandler(theme);

  const [showMenu, setShowMenu] = useState<Boolean>(false);
  const [showMoods, setShowMoods] = useState<Boolean>(false);
  const [moodText, onChangeMoodText] = useState<string>();
  const [showDeletePrompt, setShowDeletePrompt] = useState<Boolean>(false);
  const [moodToDel, setMoodToDel] = useState<string>();
  const handleDeleteMood = (moodToDelete: string) => {
    setMoodToDel(moodToDelete);
    setShowDeletePrompt(true);
  };
  interface Mood {
    name: string;
    images: string[];
  }
  // create nre mood
  const handleSubmitMood = () => {
    const inputMood = moodText?.trim();
    const existingMoods = moods?.map((m: Mood) => m.name);
    // add to list
    if (existingMoods?.includes(inputMood)) {
      displayStatusMsg(`Mood Board "${inputMood}" Already Exists`);
    } else {
      const updatedMoods = [...moods, {name: inputMood, images: []}];
      setMoods(updatedMoods);
      // save moods to storage
      try {
        const jsonObj = JSON.stringify(updatedMoods);
        AsyncStorage.setItem('moods', jsonObj);
      } catch (error) {}
    }
    onChangeMoodText('');
  };

  const selectMood = (selectedMood: Mood) => {
    setCurrMood(selectedMood);
    try {
      AsyncStorage.setItem('setMood', selectedMood.name);
    } catch (error) {}

    // const moodObj = moods.find((m: Mood) => m.name === selectedMood.name);
    // setImages((l: string[]) =>
    //   l.filter((item: string) => moodObj.images.includes(item)),
    // );
    // hide menus
    setShowMoods(false);
    setShowDeletePrompt(false);
  };

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

      <TouchableOpacity
        style={styles.moodBtn}
        onPress={() => {
          setShowMoods(true);
          setShowMenu(false);
        }}>
        <Text style={{...styles.text, marginHorizontal: 5, fontWeight: 'bold'}}>
          {currMood.name}
        </Text>
        <IonIcon
          name="swap-vertical"
          size={18}
          color={theme.txtColor}
          style={{marginHorizontal: 5}}
        />
      </TouchableOpacity>

      {showMoods && (
        <View style={styles.moodWrapper}>
          {showDeletePrompt && (
            <MoodDeletePrompt
              mood={moodToDel}
              setShowDeletePrompt={setShowDeletePrompt}
              setShowMoods={setShowMoods}
            />
          )}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowMoods(false)}>
            <IonIcon name="close" size={24} color="#f00" />
          </TouchableOpacity>
          <View style={styles.moods}>
            <View style={styles.mood}>
              <TouchableOpacity
                onPress={() => selectMood(defaultMood)}
                style={styles.setMoodBtn}>
                <Text style={{...styles.text}}>All</Text>
              </TouchableOpacity>
            </View>
            {moods?.map((m: Mood) => (
              <View style={styles.mood} key={m.name}>
                <TouchableOpacity
                  onPress={() => selectMood(m)}
                  style={styles.setMoodBtn}>
                  <Text style={{...styles.text}}>{m.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteMoodBtn}
                  onPress={() => handleDeleteMood(m.name)}>
                  <IonIcon name="trash-bin" size={12} color="#f00" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {(moods?.length === 0 || !moods) && (
            <Text style={{...styles.text, textAlign: 'center'}}>
              You haven't created a mood board yet
            </Text>
          )}
          {!moods || moods?.length < 10 ? (
            <TextInput
              style={styles.txtInput}
              onChangeText={onChangeMoodText}
              value={moodText}
              placeholder="Add Mood"
              placeholderTextColor={theme.txtColor}
              maxLength={20}
              onSubmitEditing={() => handleSubmitMood()}
            />
          ) : (
            <Text style={{...styles.text, textAlign: 'center'}}>
              You have 10 boards, which is the maximum
            </Text>
          )}
        </View>
      )}

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

    moodWrapper: {
      elevation: 3,
      backgroundColor: theme.backgroundColor,
      position: 'absolute',
      zIndex: 1,
      top: 0,
      width: '100%',
      padding: 5,
      borderRadius: 5,
    },
    moods: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    moodBtn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    menuBtn: {},
    txtInput: {
      borderWidth: 1,
      borderColor: theme.txtColor,
      color: theme.txtColor,
      width: '50%',
      marginVertical: 10,
      padding: 5,
      fontStyle: 'italic',
      alignSelf: 'center',
      borderRadius: 5,
    },
    closeBtn: {
      alignSelf: 'flex-end',
      margin: 3,
    },
    mood: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.txtColor,
      alignSelf: 'flex-start',
      padding: 3,
      alignItems: 'center',
      borderRadius: 5,
      margin: 5,
    },
    setMoodBtn: {
      marginHorizontal: 3,
    },
    deleteMoodBtn: {marginLeft: 10},
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

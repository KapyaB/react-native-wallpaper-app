import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {AppContext} from '../../globalState/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// file system
var RNFS = require('react-native-fs');

const MoodDeletePrompt = ({
  mood,
  setShowDeletePrompt,
  setShowMoods,
}: {
  mood: string | undefined;
  setShowDeletePrompt: Function;
  setShowMoods: Function;
}) => {
  const {theme, images, moods, setMoods, defaultMood, currMood, setCurrMood} =
    useContext(AppContext);
  const [deletePhotos, setDeletePhotos] = useState(false);
  const toggleSwitch = () => setDeletePhotos(!deletePhotos);

  interface Mood {
    name: string;
    images: string[];
  }
  const handleDelete = () => {
    // delete mood from list

    setMoods(moods.filter((item: Mood) => item.name !== mood));
    try {
      const jsonObj = JSON.stringify(moods);
      AsyncStorage.setItem('moods', jsonObj);
    } catch (error) {}

    // delete photos if set to true
    if (deletePhotos) {
      // list all photos under mood
      const moodObj = moods.find((m: Mood) => m.name === mood);
      const moodPhotos = images.filter((item: string) =>
        moodObj.images.includes(item),
      );

      moodPhotos.forEach((img: string) => {
        RNFS.unlink(img)
          .then(() => {})
          // `unlink` will throw an error, if the item to unlink does not exist
          .catch(() => {
            // err: {message: any}
          });
      });
    }
    if (currMood.name === mood) {
      setCurrMood(defaultMood);
    }

    setShowDeletePrompt(false);
    setShowMoods(false);
  };

  const styles = stylesHandler(theme);
  return (
    <View style={styles.container}>
      <Text style={{...styles.text}}>
        Delete '{mood}'? This cannot be undone
      </Text>
      <View style={styles.photosToggleWrapper}>
        <Text style={{...styles.text}}>Also delete photos?</Text>
        <Switch
          trackColor={{false: '#333', true: '#fff'}}
          thumbColor={deletePhotos ? '#f00' : '#fff'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={deletePhotos}
          style={styles.toggleBtn}
        />
      </View>
      <View style={styles.btnsWrapper}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete()}>
          <Text style={{...styles.text}}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setShowDeletePrompt(false)}>
          <Text style={{...styles.text, color: theme.backgroundColor}}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MoodDeletePrompt;

const stylesHandler = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundColor,
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 1,
      padding: 5,
      top: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.txtColor,
    },
    text: {color: theme.txtColor},
    photosToggleWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
    },
    toggleBtn: {
      marginHorizontal: 5,
    },
    btnsWrapper: {
      marginVertical: 5,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    deleteBtn: {
      marginHorizontal: 5,
      backgroundColor: '#f00',
      padding: 5,
      borderRadius: 5,
    },
    cancelBtn: {
      marginHorizontal: 5,
      backgroundColor: theme.txtColor,
      padding: 5,
      borderRadius: 5,
    },
  });

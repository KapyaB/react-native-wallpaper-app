import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {useColorScheme} from 'react-native';

const AppContext = React.createContext<any>({});

const lightTheme = {
  backgroundColor: '#ffffff',
  txtColor: '#000000',
};

const darkTheme = {
  backgroundColor: '#000000',
  txtColor: '#ffffff',
};

const AppProvider = ({children}: {children: any}) => {
  interface imgInterface {
    source: string;
    width: number | undefined;
    height: number | undefined;
  }
  const [images, setImages] = useState<imgInterface[]>();
  const [showStatus, setShowStatus] = useState<Boolean>(false);
  const [statusMsg, setStatusMsg] = useState<String | undefined>();
  const [fullscreenImgSrc, setFullscreenImgSrc] = useState<
    String | undefined
  >();
  const [showFullscreenImg, setShowFullscreenImg] = useState<Boolean>(false);
  const [mood, setMood] = useState<String>('all');

  // color theme
  const [colorTheme, setColorTheme] = useState<String>('system'); // system, dark, light
  const colorScheme = useColorScheme(); // user set to device system. light, dark, null
  const [theme, setTheme] = useState<any>(lightTheme);

  const handleThemeChange = (color: string) => {
    switch (color) {
      case 'system':
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
        break;

      case 'light':
        setTheme(lightTheme);
        break;

      case 'dark':
        setTheme(darkTheme);
        break;

      default:
        setTheme(lightTheme);
        break;
    }
    setColorTheme(color);
    storeData('theme', color);
  };

  // status message
  const displayStatusMsg = (msg: String) => {
    setStatusMsg(msg);
    setShowStatus(true);

    setTimeout(() => {
      setShowStatus(false);
      setStatusMsg(undefined);
    }, 2000);
  };

  // async storage
  const storeData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  const readData = async (key: string) => {
    try {
      const value: any | null = await AsyncStorage.getItem(key);
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        storeData,
        readData,

        theme,
        handleThemeChange,
        colorTheme,
        setColorTheme,
        images,
        setImages,
        showStatus,
        setShowStatus,
        statusMsg,
        setStatusMsg,
        displayStatusMsg,
        fullscreenImgSrc,
        setFullscreenImgSrc,
        showFullscreenImg,
        setShowFullscreenImg,

        mood,
        setMood,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export {AppContext, AppProvider};
// color theme hook
// export const useTheme = () => React.useContext(AppContext);

import React, {useState} from 'react';
import {useColorScheme} from 'react-native';

const AppContext = React.createContext<any>({});

const lightTheme = {
  backgroundColor: '#fff',
  txtColor: '#000',
};

const darkTheme = {
  backgroundColor: '#000',
  txtColor: '#fff',
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
  const [colorTheme, setColorTheme] = useState<String>('sys'); // system, dark, light
  const colorScheme = useColorScheme(); // user set to device system. light, dark, null
  let theme = lightTheme;

  const setTheme = () => {
    switch (colorTheme) {
      case 'sys':
        theme = colorScheme === 'dark' ? darkTheme : lightTheme;
        break;

      case 'light':
        theme = lightTheme;
        break;

      case 'dark':
        theme = darkTheme;
        break;

      default:
        theme = lightTheme;
        break;
    }
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
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
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
export const useTheme = () => React.useContext(AppContext);

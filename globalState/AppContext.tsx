import React, {useState} from 'react';

const AppContext = React.createContext();

const AppProvider = ({children}) => {
  interface imgInterface {
    source: string;
    width: number | undefined;
    height: number | undefined;
  }
  const [images, setImages] = useState<imgInterface[]>();
  const [showStatus, setShowStatus] = useState<Boolean>(false);
  const [statusMsg, setStatusMsg] = useState<String | undefined>();

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
        images,
        setImages,
        showStatus,
        setShowStatus,
        statusMsg,
        setStatusMsg,
        displayStatusMsg,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export {AppContext, AppProvider};

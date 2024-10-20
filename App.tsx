/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {AppProvider} from './globalState/AppContext';
import MainComp from './components/MainComp';

const App = ({children}): React.JSX.Element | any => {
  return (
    <AppProvider>
      <MainComp>{children}</MainComp>
    </AppProvider>
  );
};

export default App;

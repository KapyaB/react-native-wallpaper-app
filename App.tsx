/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {AppProvider} from './globalState/AppContext';
import MainComp from './components/MainComp';

const App = ({children}: {children: any}): React.JSX.Element => {
  return (
    <AppProvider>
      <MainComp>{children}</MainComp>
    </AppProvider>
  );
};

export default App;

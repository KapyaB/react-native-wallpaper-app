import {StyleSheet, Text} from 'react-native';
import React, {useContext} from 'react';

import {AppContext} from '../../globalState/AppContext';

const StatusMsg = () => {
  const {statusMsg} = useContext(AppContext);
  return (
    <Text
      style={{
        ...styles.main,
      }}>
      {statusMsg}
    </Text>
  );
};

export default StatusMsg;

const styles = StyleSheet.create({
  main: {
    margin: 5,
    textAlign: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 1,
    bottom: 5,
    fontSize: 16,
    borderRadius: 20,
    color: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

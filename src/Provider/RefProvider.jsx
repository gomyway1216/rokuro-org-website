import React, { useEffect, useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const RefContext = createContext();

export const useRefContext = () => {
  return useContext(RefContext);
};

export const RefProvider = ({ children }) => {
  const [refs, setRefs] = useState([]);
  const [displayedItemList, setDisplayedItemList] = useState([]);

  const addRefs = (newRefs) => {
    const newRefList = [];
    newRefs.forEach(newRef => {
      newRefList.push(newRef); 
    });
    setRefs(newRefList);
  };

  useEffect(() => {
    displayedItemList.push('home');
    setDisplayedItemList(displayedItemList);
  }, []);

  const modifyDisplayedItemList = (itemName, isVisible) => {
    let newDisplayItemList = [...displayedItemList];
    if(isVisible) {
      newDisplayItemList.push(itemName);
    } else {
      newDisplayItemList = displayedItemList.filter(item => {
        return item !== itemName;
      });
    }
    setDisplayedItemList(newDisplayItemList);
  };

  return (
    <RefContext.Provider
      value={{
        refs,
        addRefs,
        displayedItemList,
        setDisplayedItemList,
        modifyDisplayedItemList
      }}
    >
      {children}
    </RefContext.Provider>
  );
};

RefProvider.propTypes = {
  children: PropTypes.any
};
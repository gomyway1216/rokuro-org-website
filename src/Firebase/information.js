import * as fbConnect from './firebaseConnect';
import { getDoc, doc, updateDoc } from 'firebase/firestore';


export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const updateInformation = async (item) => {
  try {
    await updateDoc(doc(getDbAccess(), 'information', item.id), {
      body: item.body
    });
  } catch (err) {
    console.log('error when updating item: ', err);
    throw err;
  }
};

export const getInformation = async (docId) => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'information', docId));
  if(querySnapshot.exists()) {
    return querySnapshot.data();
  } else {
    console.log('No document with id: ' + docId + ' exists');
    return null;
  }
};
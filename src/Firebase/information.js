import * as fbConnect from './firebaseConnect';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

const docId = 'z1jA9ZSS7FlYnFotv5DT';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const updateInformation = async (body) => {
  try {
    await updateDoc(doc(getDbAccess(), 'information', docId), {
      body: body
    });
  } catch (err) {
    console.log('error when updating item: ', err);
    throw err;
  }
};

export const getInformation = async () => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'information', docId));
  if(querySnapshot.exists()) {
    return querySnapshot.data();
  } else {
    console.log('No document with id: ' + docId + ' exists');
    return null;
  }
};
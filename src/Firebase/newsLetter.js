import * as fbConnect from './firebaseConnect';
import { addDoc, collection, deleteDoc, getDoc, 
  getDocs, doc, limit, query, updateDoc, where } from 'firebase/firestore';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const createNewsLetter = async () => {
  const docRef = await addDoc(collection(getDbAccess(), 'newsLetter'), 
    {
      title: '', 
      isPublic: false, 
      body: '',
      created: new Date(),
      lastUpdated: new Date()
    });
  return docRef.id;
};

export const updateNewsLetter = async (item) => {
  try {
    await updateDoc(doc(getDbAccess(), 'newsLetter', item.id), {
      title: item.title,
      isPublic: item.isPublic,
      body: item.body,
      lastUpdated: item.lastUpdated ? item.lastUpdated : new Date()
    });
  } catch (err) {
    console.log('error when updating item: ', err);
    throw err;
  }
};

// return true on success, otherwise return false
export const toggleNewsLetterPublish = async (id, isPublic) => {
  try {
    await updateDoc(doc(getDbAccess(), 'newsLetter', id), {
      isPublic: isPublic
    });
    return true;
  } catch (err) {
    console.log('updating newsLetter public status is failing.');
    return false;
  }
};

export const getNewsLetter = async (id) => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'newsLetter', id));
  if(querySnapshot.exists()) {
    const newsLetter = querySnapshot.data();
    newsLetter.created = new Date(newsLetter.created.seconds * 1000);
    newsLetter.lastUpdated = new Date(newsLetter.lastUpdated.seconds * 1000);
    return newsLetter;
  } else {
    console.log('No document with id: ' + id + ' exists');
    return null;
  }
};

export const getNewsLetters = async () => {
  const newsLetters = [];
  let querySnapshot = await getDocs(collection(getDbAccess(), 'newsLetter'));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const newsLetter = querySnapshot.docs[i].data();
    newsLetter.id = querySnapshot.docs[i].id;
    newsLetter.created = new Date(newsLetter.created.seconds * 1000);
    newsLetter.lastUpdated = new Date(newsLetter.lastUpdated.seconds * 1000);
    newsLetters.push(newsLetter);
  }
  return newsLetters;
};

export const getPublicNewsLetters = async () => {
  const newsLetters = [];
  let querySnapshot = await getDocs(query(collection(getDbAccess(), 'newsLetter'), 
    where('isPublic', '==', true)));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const newsLetter = querySnapshot.docs[i].data();
    newsLetter.id = querySnapshot.docs[i].id;
    newsLetter.created = new Date(newsLetter.created.seconds * 1000);
    newsLetter.lastUpdated = new Date(newsLetter.lastUpdated.seconds * 1000);
    newsLetters.push(newsLetter);
  }
  return newsLetters;
};

export const deleteNewsLetter = async (id) => {
  try {
    await deleteDoc(doc(getDbAccess(), 'newsLetter', id));
    return true;
  } catch (err) {
    console.log('error when deleting newsLetter: ', err);
    return false;
  }
};
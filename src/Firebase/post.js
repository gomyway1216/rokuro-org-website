import * as fbConnect from './firebaseConnect';
import { addDoc, collection, deleteDoc, getDoc, 
  getDocs, doc, limit, query, updateDoc, where } from 'firebase/firestore';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const createPost = async () => {
  const docRef = await addDoc(collection(getDbAccess(), 'post'), 
    {
      title: '', 
      isPublic: false, 
      body: '',
      created: new Date(),
      lastUpdated: new Date()
    });
  return docRef.id;
};

export const updatePost = async (item) => {
  try {
    await updateDoc(doc(getDbAccess(), 'post', item.id), {
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
export const togglePostPublish = async (id, isPublic) => {
  try {
    await updateDoc(doc(getDbAccess(), 'post', id), {
      isPublic: isPublic
    });
    return true;
  } catch (err) {
    console.log('updating post public status is failing.');
    return false;
  }
};

export const getPost = async (id) => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'post', id));
  if(querySnapshot.exists()) {
    const post = querySnapshot.data();
    post.created = new Date(post.created.seconds * 1000);
    post.lastUpdated = new Date(post.lastUpdated.seconds * 1000);
    return post;
  } else {
    console.log('No document with id: ' + id + ' exists');
    return null;
  }
};

export const getPosts = async (limitNum) => {
  const posts = [];
  let querySnapshot = await getDocs(collection(getDbAccess(), 'post'));
  if(limitNum > 0) {
    const q = query(collection(getDbAccess(), 'post'), limit(limitNum));
    querySnapshot = await getDocs(q);
  }
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const postDoc = querySnapshot.docs[i];
    const post = {
      id: postDoc.id,
      title: postDoc.data().title,
      body: postDoc.data().body,
      isPublic: postDoc.data().isPublic,
      created: new Date(postDoc.data().created.seconds * 1000),
      lastUpdated: new Date(postDoc.data().lastUpdated.seconds * 1000)
    };
    posts.push(post);
  }
  return posts;
};

export const getPublishedPosts = async () => {
  const posts = [];
  const q = query(collection(getDbAccess(), 'post'), 
    where('isPublic', '==', true));
  let querySnapshot = await getDocs(q);
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const postDoc = querySnapshot.docs[i];
    const post = {
      id: postDoc.id,
      title: postDoc.data().title,
      body: postDoc.data().body,
      isPublic: postDoc.data().isPublic,
      created: new Date(postDoc.data().created.seconds * 1000),
      lastUpdated: new Date(postDoc.data().lastUpdated.seconds * 1000)
    };
    posts.push(post);
  }
  return posts;
};


export const deletePost = async (id) => {
  try {
    await deleteDoc(doc(getDbAccess(), 'post', id));
    return true;
  } catch (err) {
    console.log('updating post public status is failing.');
    return false;
  }
};
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as postApi from '../../Firebase/post';
import * as newsLetterApi from '../../Firebase/newsLetter';
import DataTable from '../../Component/Table/DataTable';
import styles from './admin-page.module.scss';


const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [newsLetters, setNewsLetters] = useState([]);

  const getPosts = async () => {
    const ps = await postApi.getPosts();
    setPosts(ps);
  };

  const getNewsLetters = async () => {
    const nl = await newsLetterApi.getNewsLetters();
    setNewsLetters(nl);
  };

  useEffect(() => {
    getNewsLetters();
    getPosts();
    setLoading(false);
  }, []);

  const handleCreatePost = async () => {
    // crete the post and get id for the post so that post page can do auto saving with the id
    const docId = await postApi.createPost();
    navigate('/edit-post/' + docId);
  };

  const handleCreateNewsLetter = async () => {
    // crete the news Letter and get id for the it so that post page can do auto saving with the id
    const docId = await newsLetterApi.createNewsLetter();
    navigate('/edit-news-letter/' + docId);
  };

  const handleEditInformation = () => {
    navigate('/edit-information/');
  };

  if(loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>AdminPage</div>
      <div className={styles.buttons}>
        <Button variant="outlined" onClick={handleCreatePost}
          className={styles.button}>Create Post</Button>
        <Button variant="outlined" onClick={handleCreateNewsLetter}
          className={styles.button}>Create News Letter</Button>
        <Button variant="outlined" onClick={handleEditInformation}
          className={styles.button}>Edit Information</Button>
      </div>
      <div className={styles.newsLetter}>
        <div className={styles.subTitle}>News Letter Data</div>
        <DataTable
          data={newsLetters}
          togglePublish={newsLetterApi.toggleNewsLetterPublish}
          deleteData={newsLetterApi.deleteNewsLetter}
          editLink="edit-news-letter"
        />
      </div>
      <div className={styles.post}>
        <div className={styles.subTitle}>Post Data</div>
        <DataTable 
          data={posts} 
          togglePublish={postApi.togglePostPublish} 
          deleteData={postApi.deletePost}
          editLink="edit-post"
        />
      </div>
    </div>
  );
};

export default AdminPage;
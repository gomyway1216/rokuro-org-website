import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import * as api from '../../Firebase/post';
import PostTable from '../../Component/Post/PostTable';
import styles from './admin-page.module.scss';


const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    setLoading(true);
    const ps = await api.getPosts();
    setPosts(ps);
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleCreatePost = async () => {
    // crete the post and get id for the post so that post page can do auto saving with the id
    const docId = await api.createPost();
    navigate('/edit-post/' + docId);
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
        <Button variant="outlined" onClick={handleEditInformation}
          className={styles.button}>Edit Information</Button>
      </div>
      <PostTable posts={posts} callback={getPosts}/>
    </div>
  );
};

export default AdminPage;
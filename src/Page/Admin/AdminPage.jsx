import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import * as api from '../../Firebase/post';
import PostTable from './PostTable';


const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
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
    <div>
      <div>AdminPage</div>
      <PostTable posts={posts}/>
      <div>
        <Button variant="outlined" onClick={handleCreatePost}>Create Post</Button>
      </div>
      <div>
        <Button variant="outlined" onClick={handleEditInformation}>Edit Information</Button>
      </div>
    </div>
  );
};

export default AdminPage;
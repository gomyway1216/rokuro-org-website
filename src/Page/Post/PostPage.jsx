import React, { useEffect, useState } from 'react';
import * as postApi from '../../Firebase/post';
import { useParams } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import { convert } from 'html-to-text';
import DOMPurify from 'dompurify';
import * as util from '../../util/util';
import styles from './post-page.module.scss';

const PostPage = () => {
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState();
  const { id } = useParams();
  const [post, setPost] = useState();

  const getPost = async () => {
    const result = await postApi.getPost(id);
    setPost(result);
    const formattedCreatedDate = util.formatJapaneseDate(result.created);
    setFormattedDate(formattedCreatedDate);
    setLoading(false);
  };

  useEffect(() => {
    getPost();
  }, []);

  if(loading) {
    return (
      <Backdrop open={true} style={{display: loading 
        ? 'flex' : 'none'}}>
        <CircularProgress style={{'color': 'white'}}/>
      </Backdrop>
    );
  }
  
  return (
    <div className={styles.root}>
      <div className={styles.title}>{post.title}</div>
      <div className={styles.date}>{formattedDate}</div>
      <div className={styles.body} 
        dangerouslySetInnerHTML={{ __html:  DOMPurify.sanitize(post.body) }} />
    </div>
  );
};

export default PostPage;
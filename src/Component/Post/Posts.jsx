import React from 'react';
import PropTypes from 'prop-types';
import * as postApi from '../../Firebase/post';
import Post from './Post';
import styles from './posts.module.scss';

const Posts = (props) => {
  const { posts } = props;

  return (
    <div className={styles.root}>
      {posts.map(post =>
        <Post post={post} key={post.id}/>
      )}
    </div>
  );
};

Posts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      created: PropTypes.instanceOf(Date),
      lastUpdated: PropTypes.instanceOf(Date),
      isPublic: PropTypes.bool.isRequired
    })
  )
};

export default Posts;
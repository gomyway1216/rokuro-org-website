import React from 'react';
import PropTypes from 'prop-types';
import * as util from '../../util/util';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './post-history.module.scss';

export const PostHistory = (props) => {
  const { posts } = props;
  
  return (
    <div className={styles.root}>
      {posts.map(post => 
        <div key={post.id + '-history'} className={styles.postLink}>
          <Link to={'/post/' + post.id} 
          >{util.formatJapaneseDate(post.created)}</Link>
        </div>
      )}
    </div>
  );
};

PostHistory.propTypes = {
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

export default PostHistory;
import React from 'react';
import PropTypes from 'prop-types';
import ClampLines from 'react-clamp-lines';
import * as util from '../../util/util';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { convert } from 'html-to-text';
import styles from './post.module.scss';

const Post = (props) => {
  const { post } = props;
  const { id, title, body, created } = post;
  const formattedCreatedDate = util.formatJapaneseDate(created);
  const navigate = useNavigate();
  const bodyText = convert(body, {
    wordwrap: 130
  });

  const handleCardClick = () => {
    navigate('/post/' + id);
  };


  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      <div className={styles.date}>{formattedCreatedDate}</div>
      <ClampLines
        text={bodyText}
        id="anime-description-id"
        lines={12}
        buttons={false}
        ellipsis="..."
        innerElement="p"
        className={styles.body}
      />
      <Link to={'/post/' + id} className={styles.readMore}>続きを読む</Link>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    created: PropTypes.instanceOf(Date),
    lastUpdated: PropTypes.instanceOf(Date),
    isPublic: PropTypes.bool.isRequired
  })
};

export default Post;
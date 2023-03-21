import React from 'react';
import PropTypes from 'prop-types';
import ClampLines from 'react-clamp-lines';
import * as util from '../../util/util';
import { Link } from 'react-router-dom';
import { convert } from 'html-to-text';
import styles from './item.module.scss';

const Item = (props) => {
  const { item, section } = props;
  const { id, title, body, created } = item;
  const formattedCreatedDate = util.formatJapaneseDate(created);
  const bodyText = convert(body, {
    wordwrap: 130
  });

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
      <Link to={`/${section}/` + id} className={styles.readMore}>続きを読む</Link>
    </div>
  );

};

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    created: PropTypes.instanceOf(Date),
    lastUpdated: PropTypes.instanceOf(Date),
    isPublic: PropTypes.bool.isRequired
  }),
  section: PropTypes.string.isRequired
};


export default Item;
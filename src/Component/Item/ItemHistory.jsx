import React from 'react';
import PropTypes from 'prop-types';
import * as util from '../../util/util';
import { Link } from 'react-router-dom';
import styles from './item-history.module.scss';

const ItemHistory = (props) => {
  const { items, section } = props;
  
  return (
    <div className={styles.root}>
      {items.map(item => 
        <div key={item.id + '-history'} className={styles.itemLink}>
          <Link to={`/${section}/` + item.id} 
          >{util.formatJapaneseDate(item.created)}</Link>
        </div>
      )}
    </div>
  );
};

ItemHistory.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      created: PropTypes.instanceOf(Date),
      lastUpdated: PropTypes.instanceOf(Date),
      isPublic: PropTypes.bool.isRequired
    })
  ),
  section: PropTypes.string.isRequired
};

export default ItemHistory;
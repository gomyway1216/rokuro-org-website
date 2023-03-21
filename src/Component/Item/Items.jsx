import React from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import styles from './items.module.scss';

const Items = (props) => {
  const { items, section } = props;

  return (
    <div className={styles.root}>
      {items.map(item =>
        <Item item={item} section={section} key={item.id}/>
      )}
    </div>
  );
};

Items.propTypes = {
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

export default Items;
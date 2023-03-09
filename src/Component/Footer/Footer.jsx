import React from 'react';
import styles from './footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.root}>
      <div>&copy; Copyright <strong>Rokuro Org</strong> All Rights Reserved</div>
    </div>
  );
};

export default Footer;

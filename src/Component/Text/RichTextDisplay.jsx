import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Backdrop, Button, CircularProgress } from '@mui/material';
import DOMPurify from 'dompurify';
import * as util from '../../util/util';
import styles from './rich-text-display.module.scss';

const RichTextDisplay = (props) => {
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState();
  const { id } = useParams();
  const [data, setData] = useState();
  const navigate = useNavigate();

  const getData = async () => {
    const result = await props.getApi(id);
    setData(result);
    const formattedCreatedDate = util.formatJapaneseDate(result.created);
    setFormattedDate(formattedCreatedDate);
    setLoading(false);
  };

  useEffect(() => {
    getData();
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
      <div className={styles.title}>{data.title}</div>
      <div className={styles.date}>{formattedDate}</div>
      <div className={styles.body} 
        dangerouslySetInnerHTML={{ __html:  DOMPurify.sanitize(data.body) }} />
      <div className={styles.homeButton}>
        <Button variant="outlined" onClick={() => navigate('/')}>戻る</Button>
      </div>
    </div>
  );
};

RichTextDisplay.propTypes = {
  getApi: PropTypes.func.isRequired
};

export default RichTextDisplay;
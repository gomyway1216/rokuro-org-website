import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useNavigate, useParams } from 'react-router-dom';
import * as util from '../../util/util';
import ClampLines from 'react-clamp-lines';
import styles from './post-card.module.scss';
// const { convert } = require('html-to-text');
import { convert } from 'html-to-text';
// There is also an alias to `convert` called `htmlToText`.

// const html = '<h1>Hello World</h1>';
// const text = convert(html, {
//   wordwrap: 130
// });
// console.log(text); // Hello World


const BasicCard = (props) => {
  const { post } = props;
  const { id, title, body, created } = post;
  const formattedCreatedDate = util.formatDate(created);
  const navigate = useNavigate();
  // console.log('post in card', post);
  const bodyText = convert(body, {
    wordwrap: 130
  });
  // console.log(bodyText);

  const handleCardClick = () => {
    navigate('/post/' + id);
  };

  return (
    <Card className={styles.root} onClick={handleCardClick}>
      <CardContent >
        <Typography variant="h5" component="div" noWrap={true}>
          {title}
        </Typography>
        <Typography noWrap={true} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {formattedCreatedDate}
        </Typography>
        {/* <div className={styles.postBody}>
          {bodyText}
        </div> */}
        <ClampLines
          text={bodyText}
          id="anime-description-id"
          lines={12}
          buttons={false}
          ellipsis="..."
          innerElement="p"
          className={styles.postBody}
        />
      </CardContent>
    </Card>
  );
};


BasicCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    created: PropTypes.instanceOf(Date),
    lastUpdated: PropTypes.instanceOf(Date),
    isPublic: PropTypes.bool.isRequired
  })
};

export default BasicCard;
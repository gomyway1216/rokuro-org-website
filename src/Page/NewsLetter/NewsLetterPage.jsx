import React from 'react';
import * as newsLetterApi from '../../Firebase/newsLetter';
import RichTextDisplay from '../../Component/Text/RichTextDisplay';

const PostPage = () => {
  return (
    <RichTextDisplay getApi={newsLetterApi.getNewsLetter} />
  );
};

export default PostPage;
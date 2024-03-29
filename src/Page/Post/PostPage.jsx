import React from 'react';
import * as postApi from '../../Firebase/post';
import RichTextDisplay from '../../Component/Text/RichTextDisplay';

const PostPage = () => {
  return (
    <RichTextDisplay getApi={postApi.getPost} />
  );
};

export default PostPage;
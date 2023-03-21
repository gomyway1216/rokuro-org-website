import React from 'react';
import * as api from '../../Firebase/post';
import { useParams } from 'react-router-dom';
import RichTextEditor from '../../Component/Edit/RichTextEditor';


const EditPostPage = () => {
  const { id } = useParams();
  
  return (
    <RichTextEditor 
      id={id}
      getDoc={api.getPost}
      updateDoc={api.updatePost}
      deleteDoc={api.deletePost}
    />
  );
};

export default EditPostPage;
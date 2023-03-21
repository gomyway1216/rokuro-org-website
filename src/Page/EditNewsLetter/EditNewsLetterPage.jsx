import React from 'react';
import RichTextEditor from '../../Component/Edit/RichTextEditor';
import * as api from '../../Firebase/newsLetter';
import { useParams } from 'react-router-dom';


const EditPostPage = () => {
  const { id } = useParams();

  return (
    <RichTextEditor
      id={id}
      getDoc={api.getNewsLetter}
      updateDoc={api.updateNewsLetter}
      deleteDoc={api.deleteNewsLetter}
    />
  );
};

export default EditPostPage;
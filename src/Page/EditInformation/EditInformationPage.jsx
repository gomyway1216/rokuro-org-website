import React, { useEffect, useState, useRef } from 'react';
import * as api from '../../Firebase/information';
import RichTextEditor from '../../Component/Edit/RichTextEditor';
import 'react-quill/dist/quill.snow.css';

const docId = process.env.REACT_APP_INFORMATION_DOC_ID;

const EditInformationPage = () => {
  return (
    <RichTextEditor
      id={docId}
      getDoc={api.getInformation}
      updateDoc={api.updateInformation}
      bodyOnly={true}
    />
  );
};

export default EditInformationPage;
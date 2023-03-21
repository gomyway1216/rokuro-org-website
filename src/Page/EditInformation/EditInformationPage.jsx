import React, { useEffect, useState, useRef } from 'react';
import * as api from '../../Firebase/information';
import { useNavigate } from 'react-router-dom';
import EditorToolbar, { modules, formats } from '../../Component/Edit/EditorToolbar';
import { Button, FormGroup, FormControlLabel, Switch } from '@mui/material';
import InstantMessage from '../../Component/PopUp/Alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './edit-information-page.module.scss';

const UPDATE_INTERVAL = 10000;

const EditInformationPage = () => {
  const [originalBody, setOriginalBody] = useState({});
  const [body, setBody] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [counter, setCounter] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [autoSaveBody, setAutoSaveBody] = useState('');
  const [autoSaveTitle, setAutoSaveTitle] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const intervalIdRef = useRef(intervalId);
  intervalIdRef.current = intervalId;

  const countRef = useRef(counter);
  countRef.current = counter;

  const bodyRef = useRef(body);
  bodyRef.current = body;

  const getDoc = async () => {
    const doc = await api.getInformation();
    if(doc) {
      setBody(doc.body);
      setOriginalBody(doc.body);
    } else {
      // redirect to admin page as the document is not found
      navigate('/admin');
    }
  };

  useEffect(() => {
    getDoc();
  }, []);

  //deep comparison of the body and title
  const deepCompareBodyAndTitle = (body, title) => {
    if(autoSaveBody !== body || autoSaveTitle !== title) {
      setAutoSaveBody(body);
      setAutoSaveTitle(title);
      return true;
    }
    return false;
  };
  
  useEffect(() => {
    if(autoSave) {
      const interval = setInterval(() => {
        // The logic of changing counter value to come soon.
        setCounter(currCount => currCount + 1);
        try {
          if (deepCompareBodyAndTitle(bodyRef.current, titleRef.current)) {
            api.updateInformation(bodyRef.current);
          }
        } catch (err) {
          //TODO: create error log when failing more than 5 times
          console.log('updating the post is failing!');
          setErrorMessage(err);
        }
        
      }, UPDATE_INTERVAL);
      setIntervalId(interval);

      // triggered when component unmounts
      return () => {
        clearInterval(intervalIdRef.current);
      };
    } else {
      clearInterval(intervalId);
    }
  }, [autoSave]);

  const onAutoSaveSwitchChange = (e) => {
    setAutoSave(e.target.checked);
  };

  const handleSave = () => {
    try {
      api.updateInformation(body);
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err);
    }
  };

  const handleClose = () => {
    try {
      api.updateInformation(originalBody);
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err);
    }
  };

  const handleAlertClose = () => {
    setErrorMessage('');
  };
  
  return (
    <div>
      <div>
        <FormGroup>
          <FormControlLabel 
            control={
              <Switch    
                checked={autoSave}
                onChange={onAutoSaveSwitchChange}
              />
            } 
            label="Auto Save" />
        </FormGroup>
      </div>

      <div className={styles.toolBar}>
        <EditorToolbar/>
      </div>
      <ReactQuill 
        theme="snow"
        modules={modules} 
        formats={formats} 
        placeholder={'Write something awesome...'}
        value={body} 
        onChange={setBody} />
      <div>
        <Button variant="outlined" onClick={handleSave}>Save and Close</Button>
        <Button variant="outlined" color="error" onClick={handleClose}>Close without Saving</Button>
      </div>
      {errorMessage && <InstantMessage message={errorMessage}
        onClose={handleAlertClose} />
      }
    </div>
  );
};

export default EditInformationPage;
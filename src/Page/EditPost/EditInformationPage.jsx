import React, { useEffect, useState, useMemo, useRef } from 'react';
import * as api from '../../Firebase/information';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import styles from './edit-post-page.module.scss';
import { Button, FormGroup, FormControlLabel, TextField, Switch } from '@mui/material';

const EditInformationPage = () => {
  const [originalBody, setOriginalBody] = useState({});
  const [body, setBody] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [counter, setCounter] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const navigate = useNavigate();
  const updateInterval = 10000;

  const intervalIdRef = useRef(intervalId);
  intervalIdRef.current = intervalId;

  const countRef = useRef(counter);
  countRef.current = counter;

  const bodyRef = useRef(body);
  bodyRef.current = body;

  const getDoc = async () => {
    const doc = await api.getInformation();
    if(doc) {
      console.log('doc', doc);
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
  
  useEffect(() => {
    console.log('autoSave', autoSave);
    if(autoSave) {
      console.log('if block');
      const interval = setInterval(() => {
        // The logic of changing counter value to come soon.
        let currCount = countRef.current;
        console.log('currCount', currCount);
        setCounter(currCount => currCount + 1);
        console.log('bodyRef.current', bodyRef.current);
        try {
          api.updateInformation(bodyRef.current);
        } catch (err) {
          //TODO: create error log when failing more than 5 times
          console.log('updating the post is failing!');
        }
        
      }, updateInterval);
      setIntervalId(interval);

      // triggered when component unmounts
      return () => {
        console.log('Child unmounted', intervalIdRef.current);
        clearInterval(intervalIdRef.current);
      };
    } else {
      console.log('else block');
      clearInterval(intervalId);
    }
  }, [autoSave]);

  const onAutoSaveSwitchChange = (e) => {
    setAutoSave(e.target.checked);
  };

  const handleSave = () => {
    api.updateInformation(body);
    navigate('/admin');
  };

  const handleClose = () => {
    console.log('originalBody', originalBody);
    // id was missing
    api.updateInformation(originalBody);
    navigate('/admin');
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
    </div>
  );
};

export default EditInformationPage;
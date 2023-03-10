import React, { useEffect, useState, useRef } from 'react';
import * as api from '../../Firebase/post';
import { useNavigate, useParams } from 'react-router-dom';
import EditorToolbar, { modules, formats } from '../../Component/Edit/EditorToolbar';
import { Button, FormGroup, FormControlLabel, TextField, Switch } from '@mui/material';
import DeletePostDialog from '../../Component/Dialog/DeletePostDialog';
import InstantMessage from '../../Component/PopUp/Alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './edit-post-page.module.scss';


const UPDATE_INTERVAL = 10000;

const EditPostPage = () => {
  const [original, setOriginal] = useState({});
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPublic, setPublic] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [counter, setCounter] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const intervalIdRef = useRef(intervalId);
  intervalIdRef.current = intervalId;

  const countRef = useRef(counter);
  countRef.current = counter;

  const titleRef = useRef(title);
  titleRef.current = title;
  const bodyRef = useRef(body);
  bodyRef.current = body;
  const isPublicRef = useRef(isPublic);
  isPublicRef.current = isPublic;

  const getDoc = async () => {
    const doc = await api.getPost(id);
    if(doc) {
      setTitle(doc.title);
      setBody(doc.body);
      setPublic(doc.isPublic);
      setOriginal({
        id,
        title: doc.title,
        body: doc.body,
        isPublic: doc.isPublic,
        lastUpdated: doc.lastUpdated
      });
    } else {
      // redirect to admin page as the document is not found
      navigate('/admin');
    }
  };

  useEffect(() => {
    getDoc();
  }, []);
  
  useEffect(() => {
    if(autoSave) {
      const interval = setInterval(() => {
        // The logic of changing counter value to come soon.
        setCounter(currCount => currCount + 1);
        const item = {
          id,
          title: titleRef.current, 
          body: bodyRef.current, 
          isPublic: isPublicRef.current
        };
        try {
          api.updatePost(item);
        } catch (err) {
          // TODO: create error log when failing more than 5 times
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onAutoSaveSwitchChange = (e) => {
    setAutoSave(e.target.checked);
  };

  const onIsPublicSwitchChange = (e) => {
    setPublic(e.target.checked);
  };

  const handleSave = () => {
    const item = {
      id,
      title: title, 
      body: body, 
      isPublic: isPublic
    };
    try {
      api.updatePost(item);
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err);
    }
  };

  const handleClose = () => {
    try {
      api.updatePost(original);
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err);
    }
  };

  const handleDelete = async () => {
    const updateStatus = await api.deletePost(id);
    if(updateStatus) {
      navigate('/admin');
      navigate(0);
    } else {
      const msg = 'deletion of the post is failing!';
      setErrorMessage(msg);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleAlertClose = () => {
    setErrorMessage('');
  };
  
  return (
    <div className={styles.root}>
      <div className={styles.subSection}>
        <div className={styles.titleWrapper}>
          <TextField id="outlined-basic" label="Title" 
            variant="outlined" value={title} 
            onChange={handleTitleChange}
            className={styles.title}
          />
        </div>
        <div className={styles.switchWrapper}>
          <FormGroup>
            <FormControlLabel 
              className={styles.switch}
              control={
                <Switch    
                  checked={autoSave}
                  onChange={onAutoSaveSwitchChange}
                />
              } 
              label="Auto Save" />
          </FormGroup>
          <FormGroup>
            <FormControlLabel 
              className={styles.switch}
              control={
                <Switch    
                  checked={isPublic}
                  onChange={onIsPublicSwitchChange}
                />
              } 
              label="Publishing?" />
          </FormGroup>
        </div>
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
      <div className={styles.buttons}>
        <Button 
          variant="outlined" 
          onClick={handleSave}
          className={styles.button}>
            Save and Close
        </Button>
        <Button variant="outlined" 
          color="error" 
          onClick={handleClose}
          className={styles.button}>
            Close without Saving
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={() => setDeleteDialogOpen(true)}
          className={styles.button}
        >
          Delete
        </Button>
      </div>
      <DeletePostDialog open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose} callback={handleDelete} 
        errorMessage={errorMessage}/>
      {errorMessage && <InstantMessage message={errorMessage}
        onClose={handleAlertClose} />
      }
    </div>
  );
};

export default EditPostPage;
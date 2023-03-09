import React, { useEffect, useState, useMemo, useRef } from 'react';
import * as api from '../../Firebase/post';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import styles from './edit-post-page.module.scss';
import { Button, FormGroup, FormControlLabel, TextField, Switch } from '@mui/material';
import DeletePostDialog from './DeletePostDialog';


// store original data

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
  console.log('docId', id);
  const updateInterval = 10000;
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
    // const userInf = await userApi.getUserByUserId(userId);
    // setUser(userInf);
    const doc = await api.getPost(id);
    if(doc) {
      console.log('doc', doc);
      setTitle(doc.title);
      setBody(doc.body);
      setPublic(doc.isPublic);
      setOriginal({
        id,
        title: doc.title,
        body: doc.body,
        isPublic: doc.isPublic,
        lastUpdated: new Date(doc.lastUpdated.seconds * 1000)
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
    console.log('autoSave', autoSave);
    if(autoSave) {
      console.log('if block');
      const interval = setInterval(() => {
        // The logic of changing counter value to come soon.
        let currCount = countRef.current;
        console.log('currCount', currCount);
        setCounter(currCount => currCount + 1);
        const item = {
          id,
          title: titleRef.current, 
          body: bodyRef.current, 
          isPublic: isPublicRef.current
        };
        console.log('item', item);
        try {
          api.updatePost(item);
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
    api.updatePost(item);
    navigate('/admin');
  };

  const handleClose = () => {
    console.log('original', original);
    // id was missing
    api.updatePost(original);
    navigate('/admin');
  };

  const handleDelete = async () => {
    const updateStatus = await api.deletePost(id);
    if(updateStatus) {
      navigate('/admin');
    } else {
      const msg = 'deletion of the post is failing!';
      console.log(msg);
      setErrorMessage(msg);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  
  return (
    <div>
      <div>
        <div>
          <div>Title</div>
          <TextField id="outlined-basic" label="Title" variant="outlined" value={title} onChange={handleTitleChange}/>
        </div>
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
        <FormGroup>
          <FormControlLabel 
            control={
              <Switch    
                checked={isPublic}
                onChange={onIsPublicSwitchChange}
              />
            } 
            label="Publishing?" />
        </FormGroup>
        <Button variant="outlined" onClick={handleSave}>Save and Close</Button>
        <Button variant="outlined" color="error" 
          onClick={handleClose}>Close without Saving</Button>
        <Button variant="outlined" color="error" 
          onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
      </div>
      <DeletePostDialog open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose} callback={handleDelete} 
        errorMessage={errorMessage}/>
    </div>
  );
};

export default EditPostPage;
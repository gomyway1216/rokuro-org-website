import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button,Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';


const DeletePostDialog = (props) => {
  const [open, setOpen] = useState(props.open);
    
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>Deleting Post</DialogTitle>
        <DialogContent>
          {props.errorMessage ? props.errorMessage : 'Is that really ok?'}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>Close</Button>
          <Button onClick={() => props.callback()}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DeletePostDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired
};


export default DeletePostDialog;
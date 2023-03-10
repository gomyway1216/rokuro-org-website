import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Switch, Tooltip } from '@mui/material';
import { DataGrid, GridToolbarContainer, 
  GridToolbarColumnsButton, GridToolbarFilterButton, 
  GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import DeletePostDialog from '../Dialog/DeletePostDialog';
import * as api from '../../Firebase/post';
import InstantMessage from '../PopUp/Alert';


const PostTable = (props) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(props.posts);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletePostId, setDeletePostId] = useState('');

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'created', 
      headerName: 'Created', 
      width: 150,
      type: 'date',
      sortComparator: (a, b) => {
        const distantFuture = new Date(8640000000000000);
        let dateA = a ? a : distantFuture;
        let dateB = b ? b : distantFuture;
        return dateA.getTime() - dateB.getTime();
      }
    },
    { field: 'lastUpdated', 
      headerName: 'Last updated', 
      width: 150,
      type: 'date',
      sortComparator: (a, b) => {
        const distantFuture = new Date(8640000000000000);
        let dateA = a ? a : distantFuture;
        let dateB = b ? b : distantFuture;
        return dateA.getTime() - dateB.getTime();
      }
    },
    {
      field: 'isPublic',
      headerName: 'Published?',
      type: 'boolean',
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const handlePublicSwitch = async (e) => {
          e.stopPropagation(); // don't select this row after clicking
          // call api, if successful, change the value, otherwise show some error
          // store the checked state as map can not access new value 
          setLoading(true);
          const checked = e.target.checked;
          const updateStatus = await api.togglePostPublish(params.row.id, checked);
          if(updateStatus) {
            const newState = posts.map(post => {
              if(post.id === params.row.id) {
                return {...post, isPublic: checked};
              }
              return post;
            });
            console.log('updating post publish status is success');
            setPosts(newState);
          } else {
            console.log('updating post publish status is failing');
          }
          setLoading(false);
        };

        return (
          <Tooltip title="published?">
            <Switch
              edge="end"
              onChange={handlePublicSwitch}
              checked={params.row.isPublic}
              inputProps={{
                'aria-labelledby': 'switch-list-label-wifi',
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          // open editor for this post
          navigate('/edit-post/' + params.row.id);
        };
        return (
          <Tooltip title="edit">
            <IconButton aria-label="edit" onClick={onClick} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        );
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          setDeletePostId(params.row.id);
          setDeleteDialogOpen(true);
        };
        return (
          <Tooltip title="delete">
            <IconButton aria-label="delete" onClick={onClick} color="primary">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        );
      }
    }
  ];

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    const updateStatus = await api.deletePost(deletePostId);
    if(!updateStatus) {
      const msg = 'deletion of the post is failing!';
      setErrorMessage(msg);
    } else {
      props.callback();
      handleDeleteDialogClose();
    }
  };

  const handleAlertClose = () => {
    setErrorMessage('');
  };

  return (
    <div>
      <DataGrid
        rows={posts}
        columns={columns}
        components={{ Toolbar: () => {
          return (
            <GridToolbarContainer>
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </GridToolbarContainer>);
        }}}
        initialState={{
          sorting: {
            sortModel: [{ field: 'created', sort: 'desc' }]
          },
          filter: {
            filterModel: {
              items: [{ columnField: 'isPublic', operatorValue: 'is', value: 'true' }]
            },
          },
        }}
        autoHeight
        componentsProps={{
          panel: {
            sx: {
              '& .MuiDataGrid-filterForm': {
                display: 'flex',
                flexDirection: 'column'
              },
            },
          }
        }}
        loading={loading}
      />
      <DeletePostDialog open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose} callback={handleDelete} 
        errorMessage={errorMessage}/>
      {errorMessage && <InstantMessage message={errorMessage} 
        onClose={handleAlertClose}/>}
    </div>
  );
};

PostTable.propTypes = {
  posts: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired
};

export default PostTable;
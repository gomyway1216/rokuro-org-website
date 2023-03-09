import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Switch, Tooltip } from '@mui/material';
import { DataGrid, GridToolbarContainer, 
  GridToolbarColumnsButton, GridToolbarFilterButton, 
  GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
// import ItemDialog from './ItemDialog';
// import * as storageApi from '../../Firebase/storage';
// import useMobileQuery from '../../Hook/useMobileQuery';
// import IconButtonWithTooltip from '../../Component/IconButtonWithTooltip';
// import * as util from '../../util/util';
// import styles from './storage-table.module.scss';
import {useNavigate } from 'react-router-dom';
import * as api from '../../Firebase/post';


const PostTable = (props) => {
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [dialogItem, setDialogItem] = useState({});
  // const { locationList, ownerList, typeList, itemList, getItemList } = props;
  // const { posts } = props;
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(props.posts);
  // const { matches } = useMobileQuery();
  const navigate = useNavigate();

  console.log('posts in table', posts);

  const columns = [
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'created', 
      headerName: 'Created', 
      width: 150,
      type: 'date',
      valueGetter: ({ value }) => {
        return value && new Date(value.seconds * 1000);
      },
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
      valueGetter: ({ value }) => {
        return value && new Date(value.seconds * 1000);
      },
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
        // const onClick = (e) => {
        //   e.stopPropagation(); // don't select this row after clicking
        //   setDialogItem(params.row);
        //   handleDialogOpen();
        // };

        const handlePublicSwitch = async (e) => {
          e.stopPropagation(); // don't select this row after clicking
          // call api, if successful, change the value, otherwise show some error
          // store the checked state as map can not access new value 
          setLoading(true);
          const checked = e.target.checked;
          console.log('e.target.value1', checked);
          console.log('params.row', params.row);
          const updateStatus = await api.togglePostPublish(params.row.id, checked);
          if(updateStatus) {
            const newState = posts.map(post => {
              if(post.id === params.row.id) {
                console.log('e.target.checked2', e.target.checked);
                console.log('e.target.checked3', checked);
                console.log('matching?', post.id, e.target.checked);
                return {...post, isPublic: checked};
              }
              return post;
            });
            console.log('updating post publish status is success', newState);
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
          // setDialogItem(params.row);
          // handleDialogOpen();
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
    }
  ];

  // const columns2 = [
  //   {
  //     field: 'consume',
  //     headerName: 'Consume',
  //     sortable: false,
  //     filterable: false,
  //     width: 80,
  //     renderCell: (params) => {
  //       const onClick = (e) => {
  //         e.stopPropagation(); // don't select this row after clicking
  //         handleConsumeItem(params.row);
  //       };
  //       return (
  //         <IconButtonWithTooltip aria-label="consume" tooltipText="click here to consume" color="primary" disabled={!params.row.isAvailable} onClick={onClick} />
  //       );
  //     }
  //   },
  //   { field: 'name', headerName: 'Name', width: 150 },
  //   { field: 'location', headerName: 'Location', width: 80, type: 'singleSelect', valueOptions: locationList },
  //   { field: 'owner', headerName: 'Owner', width: 80, type: 'singleSelect', valueOptions: ownerList },
  //   { field: 'type', headerName: 'Type', width: 100, type: 'singleSelect', valueOptions: typeList },
  //   { field: 'purchaseDate', 
  //     headerName: 'Purchase Date', 
  //     width: 150,
  //     type: 'date',
  //     valueGetter: ({ value }) => value && new Date(value)
  //   },
  //   { field: 'expiryDate', 
  //     headerName: 'Expiry Date', 
  //     width: 150,
  //     type: 'date',
  //     valueGetter: ({ value }) => {
  //       return value && new Date(value);
  //     },
  //     sortComparator: (a, b) => {
  //       const distantFuture = new Date(8640000000000000);
  //       let dateA = a ? a : distantFuture;
  //       let dateB = b ? b : distantFuture;
  //       return dateA.getTime() - dateB.getTime();
  //     }
  //   },
  //   { field: 'isAvailable', headerName: 'Available', width: 100, type: 'boolean' },

  //   {
  //     field: 'action',
  //     headerName: 'Action',
  //     sortable: false,
  //     filterable: false,
  //     renderCell: (params) => {
  //       const onClick = (e) => {
  //         e.stopPropagation(); // don't select this row after clicking
  //         setDialogItem(params.row);
  //         handleDialogOpen();
  //       };
  //       return (
  //         <Tooltip title="edit">
  //           <IconButton aria-label="edit" onClick={onClick} color="primary">
  //             <EditIcon />
  //           </IconButton>
  //         </Tooltip>
  //       );
  //     }
  //   }
  // ];

  // const handleDialogOpen = () => {
  //   setDialogOpen(true);
  // };

  // const handleDialogClose = () => {
  //   setDialogOpen(false);
  // };

  // const handleConsumeItem = (row) => {
  //   storageApi.consumeItem(props.groupId, row.id);
  //   getItemList(props.groupId);
  // };

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
    </div>
  );
};

PostTable.propTypes = {
  // locationList: PropTypes.array.isRequired,
  // ownerList: PropTypes.array.isRequired,
  // typeList: PropTypes.array.isRequired,
  // itemList: PropTypes.array.isRequired,
  // getItemList: PropTypes.func.isRequired,
  // groupId: PropTypes.string,
  posts: PropTypes.array.isRequired
};

export default PostTable;
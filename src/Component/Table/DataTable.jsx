import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { IconButton, Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbarContainer, 
  GridToolbarColumnsButton, GridToolbarFilterButton, 
  GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import DeleteItemDialog from '../Dialog/DeleteItemDialog';
import InstantMessage from '../PopUp/Alert';


const DataTable = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(props.data);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteDataId, setDeleteDataId] = useState('');
  const navigate = useNavigate();

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
          const updateStatus = await props.togglePublish(params.row.id, checked);
          if(updateStatus) {
            const newState = data.map(value => {
              if(value.id === params.row.id) {
                return {...value, isPublic: checked};
              }
              return value;
            });
            setData(newState);
          } else {
            setErrorMessage('Failed to update publish status');
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
          // open editor
          navigate('/' + props.editLink + '/' + params.row.id);
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
          // open dialog to confirm delete
          setDeleteDataId(params.row.id);
          setDeleteDialogOpen(true);
        };

        return (
          <Tooltip title="delete">
            <IconButton aria-label="delete" onClick={onClick} color="secondary">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        );
      }
    }
  ];

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // this if block hs logical change from original one
  const handleDelete = async () => {
    setLoading(true);
    const deleteStatus = await props.deleteData(deleteDataId);
    if(deleteStatus) {
      const newState = data.filter(value => value.id !== deleteDataId);
      setData(newState);
    } else {
      setErrorMessage('Failed to delete value');
    }
    setLoading(false);
    setDeleteDialogOpen(false);
  };

  const handleAlertClose = () => {
    setErrorMessage('');
  };
  
  return (
    <div>
      <DataGrid
        rows={data}
        columns={columns}
        components={{ Toolbar: () => {
          return (
            <GridToolbarContainer>
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </GridToolbarContainer>
          );
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
      <DeleteItemDialog open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose} callback={handleDelete} 
        errorMessage={errorMessage}/>
      {errorMessage && <InstantMessage message={errorMessage} 
        onClose={handleAlertClose}/>}
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  // callback: PropTypes.func.isRequired,
  togglePublish: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,
  editLink: PropTypes.string.isRequired
};

export default DataTable;
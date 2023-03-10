import React, { useState } from 'react';
import { AppBar, Toolbar, List, ListItem, ListItemText, Drawer, 
  IconButton, Menu, MenuItem, Typography, Alert, AlertTitle, ListItemButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider';
import useWindowDimensions from '../Hook/useWindowDimensions';
import { useRefContext } from '../Provider/RefProvider';
import rokuroIcon from '../asset/icon/rokuro-icon.png';
import styles from './application-bar.module.scss';

const SCROLL_OFFSET = 56;


const ApplicationBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, userId, signOut } = useAuth();
  const [error, setError] = useState('');
  const { width } = useWindowDimensions();
  const { refs } = useRefContext();

  const toggleDrawer = (open) => (event) => {
    if(event.type === 'keydown' && (event.key === 'Tab' 
    || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleItemClick = (itemName) => () => {
    if(!isHome()) {
      navigate('/');
    }
    // the default app bar height is 64, so the offset to be 
    // half scroll to the center of contents
    scrollToDiv(itemName, 32);
  };

  const isHome = () => {
    return '/' === loc.pathname;
  };

  const scrollToDiv = (refName, offset) => {
    if(refs.length === 0) {
      return;
    }
    const ref = refs.find(elm => elm.key === refName).ref;
    // offset for the appBar
    const top = ref.current.offsetTop - offset;
    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSignIn = () => {
    navigate('/signin');
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    setError('');
    try {
      await signOut();
      setAnchorEl(null);
    } catch (e) {
      console.log('error while signing out!', e);
    }
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItemButton key="Home" onClick={()=> scrollToDiv('home', SCROLL_OFFSET)}>
          <ListItemText primary="HOME" />
        </ListItemButton>
        <ListItemButton key="INFORMATION" onClick={()=> scrollToDiv('information', SCROLL_OFFSET)}>
          <ListItemText primary="INFORMATION" />
        </ListItemButton>
        <ListItemButton key="POST" onClick={()=> scrollToDiv('post', SCROLL_OFFSET)}>
          <ListItemText primary="POST" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <div className={styles.root}>
      <AppBar position="fixed" className={styles.bar}>
        <Toolbar>
          { 
            width <= 768 && <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          }
          <img src={rokuroIcon} className={styles.logo} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} 
            onClick={handleItemClick('home')}
            style={{ cursor: 'pointer' }}>
            Rokuro Org
          </Typography>
          { width > 768 &&
            <div style={{ width: '500px', display: 'flex', justifyContent: 'space-evenly'}}>
              <div onClick={handleItemClick('home')} style={{cursor: 'pointer'}} >
                Home
              </div>
              <div onClick={handleItemClick('information')} style={{cursor: 'pointer'}}>
                Information
              </div>
              <div onClick={handleItemClick('post')} style={{cursor: 'pointer'}}>
                Post
              </div>
            </div>
          }
          <div className="account-button-wrapper">
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {!currentUser && 
                <MenuItem onClick={handleSignIn}>Admin Sign In</MenuItem>}
              {currentUser && 
                <MenuItem onClick={() => navigate('/admin')}>Admin Dashboard</MenuItem>}
              {currentUser && 
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>}
            </Menu>
            {error && 
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            }
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor={'left'} open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
};


export default ApplicationBar;
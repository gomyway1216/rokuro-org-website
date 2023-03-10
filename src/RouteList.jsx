import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import HomePage from './Page/Home/HomePage';
import AdminPage from './Page/Admin/AdminPage';
import AdminSignInPage from './Page/Admin/AdminSignInPage';
import EditPostPage from './Page/EditPost/EditPostPage';
import EditInformationPage from './Page/EditInformation/EditInformationPage';
import PostPage from './Page/Post/PostPage';

const RouteList = () => {
  return (
    <div className="page-container">
      <Routes>
        <Route path='/' element={<HomePage />} exact />
        <Route path='/signin' element={<AdminSignInPage />} />
        <Route exact path='/admin' element={<PrivateRoute/>}>
          <Route exact path='/admin' element={<AdminPage/>}/>
        </Route>
        <Route exact path='/edit-post/:id' element={<PrivateRoute/>}>
          <Route exact path='/edit-post/:id' element={<EditPostPage/>}/>
        </Route>
        <Route exact path='/edit-information' element={<PrivateRoute/>}>
          <Route exact path='/edit-information' element={<EditInformationPage/>}/>
        </Route>
        <Route exact path='/post/:id' element={<PostPage />} />
      </Routes>
    </div>
  );
};

export default RouteList;
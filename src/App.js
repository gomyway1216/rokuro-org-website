import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouteList from './RouteList';
import { AuthProvider } from './Provider/AuthProvider';
import { RefProvider } from './Provider/RefProvider';
import ApplicationBar from './NavBar/ApplicationBar';
import Footer from './Component/Footer/Footer';

const App = () => {
  return (
    <BrowserRouter >
      <AuthProvider>
        <RefProvider>
          <ApplicationBar />
          <RouteList />
          <Footer />
        </RefProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
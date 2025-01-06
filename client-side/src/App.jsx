import React, { useState } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Home from './Pages/Home';

function App() {
  const route = createBrowserRouter([

    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/home',
      element: <Home />
    },
    {
      path: '/',
      element: <Navigate to = '/login' />
    }
    
  ]);

  return (
    <div className="App">
      <RouterProvider router={route} />
    </div>
  );
}

export default App;

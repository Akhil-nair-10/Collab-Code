import React from 'react'
import {Routes, Route } from 'react-router-dom';
import Combined from './components/BHS/combined'
import Main_dashboard from './pages/main_dashboard';
import "@fontsource/press-start-2p";
import "@fontsource/silkscreen";
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import User_profile from './pages/user_profile';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/unauthorized';

const App = () => {
  return (
    <Routes>

      <Route path='/dashboard' element={<ProtectedRoute><Main_dashboard/></ProtectedRoute>}/>
      <Route path='/session' element={<ProtectedRoute><Combined/></ProtectedRoute>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/profile' element={<ProtectedRoute><User_profile/></ProtectedRoute>}/>
      <Route path="/unauthorized" element={<Unauthorized/>}/>

    </Routes>
  )
}

export default App

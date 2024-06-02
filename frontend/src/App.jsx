import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Posts from './pages/Posts'
import Signup from './pages/Signup'
import "./App.css"
import RequestOtp from './pages/RequestOtp'
import SignIn from './pages/Signin'
import ResetOtp from './pages/ResetOtp'
const App = () => {
  return (
    <div>
      home
      <Routes>
          <Route path='/' element={<Posts/>}/>
          <Route path='/sign-up' element={<Signup/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/send-otp' element={<RequestOtp/>}/>
          <Route path='/reset-password-otp' element={<ResetOtp/>}/>

      </Routes>
    </div>
  )
}

export default App

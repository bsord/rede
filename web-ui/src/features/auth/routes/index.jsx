import { Route, Routes } from 'react-router-dom'

import { Login } from './Login'
import { Register } from './Register'
import { Magic } from './Magic'

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="magic" element={<Magic />} />
    </Routes>
  )
}

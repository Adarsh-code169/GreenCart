import React from 'react'
import Navbar from './components/Navbar.jsx'
import Login from './components/Login.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer.jsx'
import { useAppContext } from './context/AppContext.jsx'
import AllProducts from './pages/AllProducts.jsx'

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin } = useAppContext()

  return (
    <div>
      {/* Navbar */}
      {!isSellerPath && <Navbar />}

      {/* Login Popup */}
      {showUserLogin && <Login />}

      {/* Toast Notifications */}
      <Toaster />

      {/* Main Routes */}
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />

        </Routes>
      </div>

      {/* Footer */}
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App

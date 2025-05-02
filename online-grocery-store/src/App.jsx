import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Store from './pages/Store'
import Cart from './pages/Cart'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import { products as staticProducts, categories as staticCategories } from './data/products'

function PrivateRoute({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const userRole = localStorage.getItem('userRole')

  if (!isLoggedIn) {
    return <Navigate to="/" />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/store" />
  }

  return children
}

function App() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const updateCart = (newCart) => {
    setCart(newCart)
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  console.log('Store component rendered');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/store"
          element={
            <PrivateRoute allowedRoles={['user', 'admin']}>
              <Store cart={cart} addToCart={addToCart} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute allowedRoles={['user', 'admin']}>
              <Cart 
                cart={cart}
                updateCart={updateCart}
                removeFromCart={removeFromCart}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LogoutIcon from '@mui/icons-material/Logout'
import ProductCard from '../components/ProductCard'
import { products as staticProducts, categories as staticCategories } from '../data/products'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import Navbar from '../components/Navbar'

function Store() {
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(staticCategories)
  const navigate = useNavigate()

  useEffect(() => {
    // Always show static products, merge with admin-added products (no duplicates by id)
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]')
    // Filter out any admin-added products that have the same id as static products
    const adminProducts = storedProducts.filter(
      p => !staticProducts.some(sp => sp.id === p.id)
    )
    const mergedProducts = [...staticProducts, ...adminProducts]
    setProducts(mergedProducts)
    // Merge categories
    const cats = Array.from(new Set(["All", ...mergedProducts.map(p => p.category)]))
    setCategories(cats)
  }, [])

  const filteredProducts = category === 'All'
    ? products
    : products.filter(product => product.category === category)

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    navigate('/')
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleAddToCart = (product) => {
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

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCartClose = () => {
    setAnchorEl(null)
  }

  const handleViewCart = () => {
    handleCartClose()
    navigate('/cart', { state: { cart } })
  }

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <>
      <Navbar />
      <Box sx={{ pt: 8 }}>
        <Box
          sx={{
            minHeight: '100vh',
            backgroundImage: 'url(/image.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ mb: 4 }}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Fresh Cart
                </Typography>
                <IconButton color="inherit" onClick={handleCartClick}>
                  <Badge badgeContent={getTotalItems()} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCartClose}
              PaperProps={{
                sx: { width: '320px', maxHeight: '400px' }
              }}
            >
              {cart.length === 0 ? (
                <MenuItem>
                  <ListItemText primary="Your cart is empty" />
                </MenuItem>
              ) : (
                <>
                  {cart.map((item) => (
                    <MenuItem key={item.id} sx={{ py: 1 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`₹${item.price.toFixed(2)} × ${item.quantity}`}
                      />
                      <Typography variant="body2" sx={{ mx: 2 }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </MenuItem>
                  ))}
                  <MenuItem sx={{ borderTop: 1, borderColor: 'divider' }}>
                    <ListItemText
                      primary="Total"
                      primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold' }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      ₹{cartTotal.toFixed(2)}
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleViewCart}
                    >
                      View Cart
                    </Button>
                  </MenuItem>
                </>
              )}
            </Menu>

            <Container sx={{ mt: 4 }}>
              <Tabs
                value={category}
                onChange={(e, newValue) => setCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 4 }}
              >
                {categories.map((cat) => (
                  <Tab key={cat} label={cat} value={cat} />
                ))}
              </Tabs>

              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Store

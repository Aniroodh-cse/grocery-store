import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const categories = ["Fruits", "Dairy", "Bakery", "Meat", "Beverages", "Snacks"]

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    unit: '',
    image: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(storedUsers)
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]')
    setProducts(storedProducts)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  const handleProductChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image' && files && files[0]) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setProductForm(prev => ({ ...prev, image: ev.target.result }))
        setImagePreview(ev.target.result)
      }
      reader.readAsDataURL(files[0])
    } else {
      setProductForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.unit || !productForm.image) return
    const newProduct = {
      id: Date.now(),
      name: productForm.name,
      price: parseFloat(productForm.price),
      category: productForm.category,
      unit: productForm.unit,
      image: productForm.image
    }
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    setProductForm({ name: '', price: '', category: '', unit: '', image: '' })
    setImagePreview('')
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Grocery Item
          </Typography>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Name"
              name="name"
              value={productForm.name}
              onChange={handleProductChange}
              required
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={productForm.price}
              onChange={handleProductChange}
              required
              sx={{ minWidth: 120 }}
            />
            <FormControl sx={{ minWidth: 140 }} required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={productForm.category}
                label="Category"
                onChange={handleProductChange}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Unit (e.g. kg, liter, pack)"
              name="unit"
              value={productForm.unit}
              onChange={handleProductChange}
              required
              sx={{ minWidth: 120 }}
            />
            <Button
              variant="contained"
              component="label"
              sx={{ minWidth: 120 }}
            >
              Upload Image
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                onChange={handleProductChange}
              />
            </Button>
            {imagePreview && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={imagePreview} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    setProductForm(prev => ({ ...prev, image: '' }))
                    setImagePreview('')
                  }}
                >
                  Delete Image
                </Button>
              </Box>
            )}
            <Button type="submit" variant="contained" color="primary">
              Add Product
            </Button>
          </form>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Product List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, idx) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      {product.image ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <img src={product.image} alt={product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                              const updatedProducts = products.map((p, i) =>
                                i === idx ? { ...p, image: '' } : p
                              )
                              setProducts(updatedProducts)
                              localStorage.setItem('products', JSON.stringify(updatedProducts))
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No Image</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => {
                          const updatedProducts = products.filter((_, i) => i !== idx)
                          setProducts(updatedProducts)
                          localStorage.setItem('products', JSON.stringify(updatedProducts))
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            User Management
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  )
}

export default AdminDashboard 
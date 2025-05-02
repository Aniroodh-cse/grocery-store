import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
  Chip,
  Snackbar
} from '@mui/material'
import { useState } from 'react'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

function ProductCard({ product, onAddToCart }) {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setOpenSnackbar(true);
  };

  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease-in-out'
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary">
            ₹{product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            per {product.unit}
          </Typography>
        </Box>
        <Chip 
          label={product.category} 
          size="small" 
          sx={{ 
            backgroundColor: 'primary.light',
            color: 'white'
          }} 
        />
      </CardContent>
      <CardActions>
        <Button 
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
          sx={{
            '&:hover': {
              transform: 'scale(1.02)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message={`${product.name} added to cart`}
      />
    </Card>
  )
}

export default ProductCard

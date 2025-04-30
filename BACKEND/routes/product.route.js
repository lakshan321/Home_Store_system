import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { addProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/add', verifyToken, addProduct);
router.get('/all', getProducts);
router.get('/:productId', getProduct);
router.put('/update/:productId/:userId', verifyToken, updateProduct);
router.delete('/delete/:productId/:userId', verifyToken, deleteProduct);

export default router;
import { Router } from 'express';
import { Request, Response } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import 'express-async-errors';

const router = Router();

/**
 * @route GET /api/cart
 * @description Get user's shopping cart (protected)
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const cart = await cartController.getCart(req.userId!);

  res.json(cart);
});

/**
 * @route POST /api/cart/items
 * @description Add item to cart (protected)
 * @body { productId, quantity }
 */
router.post('/items', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: productId, quantity',
    });
  }

  const cartItem = await cartController.addItem(req.userId!, productId, quantity);

  res.status(201).json({
    message: 'Item added to cart',
    cartItem,
  });
});

/**
 * @route PUT /api/cart/items/:id
 * @description Update cart item quantity (protected)
 * @body { quantity }
 */
router.put('/items/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({
      error: 'Missing required field: quantity',
    });
  }

  const cartItem = await cartController.updateItem(req.userId!, req.params.id, quantity);

  res.json({
    message: 'Cart item updated',
    cartItem,
  });
});

/**
 * @route DELETE /api/cart/items/:id
 * @description Remove item from cart (protected)
 */
router.delete('/items/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  await cartController.removeItem(req.userId!, req.params.id);

  res.json({ message: 'Item removed from cart' });
});

/**
 * @route DELETE /api/cart
 * @description Clear entire cart (protected)
 */
router.delete('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  await cartController.clearCart(req.userId!);

  res.json({ message: 'Cart cleared' });
});

export default router;

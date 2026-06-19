import { Router } from 'express';
import { Request, Response } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import 'express-async-errors';

const router = Router();

/**
 * @route GET /api/products
 * @description Get all products with pagination and filters
 * @query { page, limit, category, search }
 */
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;

  const result = await productController.getAll(page, limit, category, search);

  res.json(result);
});

/**
 * @route GET /api/products/:id
 * @description Get product by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  const product = await productController.getById(req.params.id);

  res.json({ product });
});

/**
 * @route POST /api/products
 * @description Create a new product (Seller only)
 * @body { name, description, price, discountPrice, categoryId, quantity }
 */
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { name, description, price, discountPrice, categoryId, quantity } = req.body;

  if (!name || !description || !price || !categoryId || quantity === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: name, description, price, categoryId, quantity',
    });
  }

  const product = await productController.create(req.userId!, {
    name,
    description,
    price,
    discountPrice,
    categoryId,
    quantity,
  });

  res.status(201).json({
    message: 'Product created successfully',
    product,
  });
});

/**
 * @route PUT /api/products/:id
 * @description Update product (Seller only)
 * @body { name, description, price, discountPrice, quantity }
 */
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const product = await productController.update(req.params.id, req.userId!, req.body);

  res.json({
    message: 'Product updated successfully',
    product,
  });
});

/**
 * @route DELETE /api/products/:id
 * @description Delete product (Seller only)
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  await productController.delete(req.params.id, req.userId!);

  res.json({ message: 'Product deleted successfully' });
});

export default router;

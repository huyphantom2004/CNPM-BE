import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as cartService from '../../services/customers/carts.service';
import * as cartItemService from '../../services/customers/cart-items.service';

// Lấy giỏ hàng kèm item theo customerId hoặc sessionId
export const getCartWithItems = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId, sessionId } = req.query;
		const cart = await cartService.getOrCreateCart({
			customerId: customerId ? parseInt(customerId as string) : undefined,
			sessionId: sessionId as string,
		});
		const items = await cartItemService.getCartItemsByCartId(cart.id);
		return res.status(200).json(new ResOk().formatResponse({ cart, items }));
	} catch (error) {
		next(error);
	}
};

// Thêm sản phẩm vào giỏ hàng (thêm mới hoặc cập nhật số lượng)
export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId, sessionId, variantId, quantity } = req.body;
		const cart = await cartService.getOrCreateCart({
			customerId: customerId ?? undefined,
			sessionId: sessionId ?? undefined,
		});
		const item = await cartItemService.addOrUpdateCartItem(cart.id, variantId, quantity);
		return res.status(200).json(new ResOk().formatResponse(item));
	} catch (error) {
		next(error);
	}
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cartItemId = parseInt(req.params.itemId);
		const { quantity } = req.body;
		const item = await cartItemService.updateCartItemQuantity(cartItemId, quantity);
		if (!item) return res.status(404).json({ message: 'Item not found' });
		return res.status(200).json(new ResOk().formatResponse(item));
	} catch (error) {
		next(error);
	}
};

// Xoá sản phẩm khỏi giỏ
export const removeItemFromCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cartItemId = parseInt(req.params.itemId);
		await cartItemService.removeCartItem(cartItemId);
		return res.status(200).json(new ResOk().formatResponse({ message: 'Item removed' }));
	} catch (error) {
		next(error);
	}
};

// Xoá toàn bộ sản phẩm trong giỏ hàng
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId, sessionId } = req.query;
		const cart = await cartService.getCart({
			customerId: customerId ? parseInt(customerId as string) : undefined,
			sessionId: sessionId as string,
		});

		if (!cart) return res.status(404).json({ message: 'Cart not found' });

		await cartItemService.clearCartItems(cart.id);
		return res.status(200).json(new ResOk().formatResponse({ message: 'Cart cleared' }));
	} catch (error) {
		next(error);
	}
};

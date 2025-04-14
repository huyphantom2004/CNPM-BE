import { db } from '../../loaders/database.loader';

type CartIdentity = {
	customerId?: number;
	sessionId?: string;
};

export const getOrCreateCart = async ({ customerId, sessionId }: CartIdentity) => {
	let whereClause: any = {};

	if (customerId) whereClause.customerId = customerId;
	else if (sessionId) whereClause.sessionId = sessionId;
	else throw new Error('Must provide either customerId or sessionId');

	let cart = await db.carts.findOne({ where: whereClause });

	if (!cart) {
		cart = await db.carts.create({
			customerId: customerId ,
			sessionId: sessionId ,
		});
	}

	return cart;
};

export const getCart = async ({ customerId, sessionId }: CartIdentity) => {
	let whereClause: any = {};

	if (customerId) whereClause.customerId = customerId;
	else if (sessionId) whereClause.sessionId = sessionId;
	else throw new Error('Must provide either customerId or sessionId');

	return db.carts.findOne({ where: whereClause });
};

export const deleteCart = (cartId: number) => {
	return db.carts.destroy({ where: { id: cartId } });
};

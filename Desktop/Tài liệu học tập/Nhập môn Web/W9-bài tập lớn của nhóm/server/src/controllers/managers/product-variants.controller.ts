import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as variantService from '../../services/managers/product-variants.service'; 
import { db } from '../../loaders/database.loader';
import * as adminLogService from '../../services/managers/admin-logs.service'; 

// Lấy tất cả biến thể của sản phẩm
export const getAllVariants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const variants = await variantService.getAllVariants();
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (error) {
        next(error);
    }
};

// Lấy biến thể theo ID
export const getVariantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const variant = await variantService.getVariantById(req.params.id);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        return res.status(200).json(new ResOk().formatResponse(variant));
    } catch (error) {
        next(error);
    }
};

// Tạo biến thể mới cho sản phẩm
export const createVariant = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const newVariant = await variantService.createVariant(req.body, transaction);

        // Optional: Log action của admin
        // await adminLogService.CreateAdminLog(
        //     (req.user as Admins).id,
        //     'Create',
        //     newVariant.id,
        //     'Variant',
        //     req.body,
        //     transaction
        // );

        await transaction.commit();
        return res.status(201).json(new ResOk().formatResponse(newVariant));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Cập nhật biến thể sản phẩm
export const updateVariant = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const updatedVariant = await variantService.updateVariant(req.params.id, req.body, transaction);
        if (!updatedVariant) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Variant not found' });
        }

        // Optional: Log action của admin
        // await adminLogService.CreateAdminLog(
        //     (req.user as Admins).id,
        //     'Update',
        //     updatedVariant.id,
        //     'Variant',
        //     req.body,
        //     transaction
        // );

        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(updatedVariant));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Xoá biến thể sản phẩm
export const deleteVariant = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const deletedCount = await variantService.deleteVariant(req.params.id, transaction);
        if (!deletedCount) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Variant not found' });
        }

        // Optional: Log action của admin
        // await adminLogService.CreateAdminLog(
        //     (req.user as Admins).id,
        //     'Delete',
        //     parseInt(req.params.id),
        //     'Variant',
        //     { deleted: true },
        //     transaction
        // );

        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse({ message: 'Deleted successfully' }));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

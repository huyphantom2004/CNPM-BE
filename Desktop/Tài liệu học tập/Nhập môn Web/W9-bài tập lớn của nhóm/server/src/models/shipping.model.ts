import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
	DataTypes,
} from 'sequelize';
export class Shipping extends Model<
	InferAttributes<Shipping>,
	InferCreationAttributes<Shipping>
> {
	declare id: CreationOptional<number>;
	declare orderId: number;
	declare shippingProvider: string;
	declare trackingNumber: CreationOptional<string>;
	declare shippedAt: CreationOptional<Date>;
	declare deliveredAt: CreationOptional<Date>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	static initClass = (sequelize: Sequelize) => {
		Shipping.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				orderId: { type: DataTypes.INTEGER, allowNull: false },
				shippingProvider: {
					type: DataTypes.STRING(100),
					allowNull: false,
				},
				trackingNumber: DataTypes.STRING(100),
				shippedAt: DataTypes.DATE,
				deliveredAt: DataTypes.DATE,
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'Shipping',
				timestamps: true,
				createdAt: 'createdAt',
				updatedAt: 'updatedAt',
				name: { singular: 'shipping', plural: 'shipping' },
			},
		);
	};
}

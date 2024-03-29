import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface ProductProps {
    id: number;
    name: string;
    description: string;
    serial_number?: string;
    price?: number;
    piece_of?: number;
    entrepot_store_id?: number;
    don_id?: number;
    order_id?: number;
}

export interface ProductCreationProps extends Optional<ProductProps, "id"> {}

export interface ProductInstance extends Model<ProductProps, ProductCreationProps>, ProductProps {

}

export default function(sequelize: Sequelize): ModelCtor<ProductInstance> {
    return sequelize.define<ProductInstance>("product", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        serial_number: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.FLOAT,
        },
        piece_of: {
            type: DataTypes.BIGINT,
        },
        entrepot_store_id: {
            type: DataTypes.BIGINT,
        },
        don_id: {
            type: DataTypes.BIGINT
        },
        order_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}

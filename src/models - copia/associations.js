import Movement from './movement.js';
import Balance from './balance.js';
import Liquidation from './liquidations.js';
import Store from './store.js';
import OperationType from './operationType.js';
import Product from './product.js';
import MovementDetail from './movementDetail.js';

const applyAssociations = () => {
    Movement.belongsTo(OperationType, { foreignKey: 'operationType' });
    Movement.belongsTo(Product, { foreignKey: 'productId' });
    Movement.belongsTo(Store, { as: 'store', foreignKey: 'storeId' });
    //Movement.belongsTo(Store, { as: 'originStore', foreignKey: 'origin' });
    //Movement.belongsTo(Store, { as: 'destinationStore', foreignKey: 'destination' });
    MovementDetail.belongsTo(Movement, { foreignKey: 'movementId' });
    Liquidation.belongsTo(Store, { as: 'store', foreignKey: 'storeId' });
    Liquidation.belongsTo(Product, { as: 'product', foreignKey: 'productId' });

    
    Balance.belongsTo(Product, { foreignKey: 'productId' });
    Balance.belongsTo(Store, { foreignKey: 'storeId' });

    
};

export default applyAssociations;
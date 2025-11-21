

import Amigo from './amigo.js';
import Departamento from './departamento.js';
import Municipio from './municipio.js';
import Barrio from './barrio.js';
import Gremio from './gremio.js';


const applyAssociations = () => {
    Amigo.belongsTo(Departamento, { as: 'departamentos', foreignKey: 'departamento' });
    Amigo.belongsTo(Municipio, { as: 'municipios', foreignKey: 'municipio' });
    Amigo.belongsTo(Barrio, { as: 'barrios', foreignKey: 'barrio' });
    Amigo.belongsTo(Gremio, { as: 'gremios', foreignKey: 'gremio' });
    Departamento.hasMany(Amigo, { foreignKey: 'departamento' });
    Municipio.hasMany(Amigo, { foreignKey: 'municipio' });
    Amigo.belongsTo(Amigo, { as: 'lider_data', foreignKey: 'lider' });


    //Amigo.belongsTo(Departamento, { foreignKey: 'departamento' });
   // Amigo.belongsTo(Municipio, { foreignKey: 'municipio' });
};

export default applyAssociations;
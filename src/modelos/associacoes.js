import Evento from './evento.js';
import Item from './item.js';
import EventoItem from './eventoItem.js';
import Pedido from './pedido.js';
import ItemPedido from './itemPedido.js';

Evento.belongsToMany(Item, {
  through: EventoItem,
  foreignKey: 'id_evento',
  otherKey: 'id_item',
});

Item.belongsToMany(Evento, {
  through: EventoItem,
  foreignKey: 'id_item',
  otherKey: 'id_evento',
});

Pedido.belongsToMany(Item, {
  through: ItemPedido,
  foreignKey: 'id_pedido',
  otherKey: 'id_item',
});

Item.belongsToMany(Pedido, {
  through: ItemPedido,
  foreignKey: 'id_item',
  otherKey: 'id_pedido',
});

Evento.belongsToMany(Item, {
  through: 'tab_re_evento_item',
  foreignKey: 'id_evento',
  otherKey: 'id_item',
  as: 'Itens' 
});

Pedido.belongsTo(Evento, { foreignKey: 'id_evento' });
Evento.hasMany(Pedido, { foreignKey: 'id_evento' });
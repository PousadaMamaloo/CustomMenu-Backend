import Evento from './evento.js';
import Item from './item.js';
import EventoItem from './eventoItem.js';
import Pedido from './pedido.js';
import ItemPedido from './itemPedido.js';
import Quarto from './quarto.js';
import EventoQuarto from './eventoQuarto.js';
import EventoData from './eventoData.js';

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

// Evento <-> Quarto
Evento.belongsToMany(Quarto, {
  through: EventoQuarto,
  foreignKey: 'id_evento',
  otherKey: 'id_quarto'
});
Quarto.belongsToMany(Evento, {
  through: EventoQuarto,
  foreignKey: 'id_quarto',
  otherKey: 'id_evento'
});

// Evento <-> Data (relacionamento com datas específicas)
Evento.hasMany(EventoData, {
  foreignKey: 'id_evento'
});
EventoData.belongsTo(Evento, {
  foreignKey: 'id_evento'
});
Pedido.belongsTo(Quarto, {
  foreignKey: 'id_quarto'
});
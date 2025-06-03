import Evento from './evento.js';
import Item from './item.js';
import EventoItem from './eventoItem.js';

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

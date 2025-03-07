exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name:{
      type: 'TEXT',
      notNull: true,
    },
    year:{
      type:'INT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.droptable('albums');
};

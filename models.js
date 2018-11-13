const Sequelize = require('sequelize');
// const db = new Sequelize('postgres://localhost:5432/plantr');
const db = require('./db');

const Gardener = db.define('gardener', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER
});
const Plot = db.define('plots', {
  size: Sequelize.INTEGER,
  shaded: Sequelize.BOOLEAN
});
const Vegetable = db.define('vegetables', {
  name: Sequelize.STRING,
  color: Sequelize.STRING,
  planted_on: Sequelize.DATE
});

const VegetablePlot = db.define('vegetable_plots');

Vegetable.belongsToMany(Plot, { through: 'vegetable_plots' });
Plot.belongsToMany(Vegetable, { through: 'vegetable_plots' });
Gardener.belongsTo(Vegetable, { as: 'favorite_vegetable' });

const vegetableData = [
  {
    name: 'Lettuce',
    color: 'green',
    planted_on: '2018-05-12'
  },
  {
    name: 'Cabbage',
    color: 'light_green',
    planted_on: '2017-05-15'
  },
  {
    name: 'Carrot',
    color: 'orange',
    planted_on: '2015-10-12'
  }
];

const plotData = [
  {
    size: 20,
    shaded: false,
    vegetables: [2, 3]
  },
  {
    size: 40,
    shaded: false,
    vegetables: [1, 2, 3]
  },
  {
    size: 15,
    shaded: true,
    vegetables: [3]
  }
];

const gardenerData = [
  {
    name: 'Dan',
    age: 35,
    plots: [1, 2]
  },
  {
    name: 'Duncan',
    age: 24,
    plots: [3]
  }
];

const vegetables = vegetableData.map(vegetable => Vegetable.create(vegetable));

Promise.all(vegetables) // Creates all the vegetables
  .then(vegetableObjects => {
    const plotObjects = plotData.map(plot => {
      Plot.create({
        size: plot.size,
        shaded: plot.shaded
      })
      .then(plotObject => {
        plot.vegetables.forEach(vegetableId => {
          VegetablePlot.create({
            plotId: plotObject.id,
            vegetableId: vegetableObjects[vegetableId].id
          });
        });
        return plotObject;
      })
    });
  })
  .then(plotObjects => {
    console.log(plotObjects)
  });
module.exports = db;

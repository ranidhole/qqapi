'use strict';

module.exports = function InstituteModel(sequelize, DataTypes) {
  const Institute = sequelize.define('Institute', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for name field is 255',
        },
      },
      allowNull: false,
    },
    system_defined: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'system_defined field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for system_defined field is 1',
        },
      },
      defaultValue: 1,
    },
  }, {
    tableName: 'institutes',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Institute.hasMany(models.Education);
      },
    },
  });

  return Institute;
};

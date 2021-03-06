'use strict';

export default function(sequelize, DataTypes) {
  const ActionableState = sequelize.define('ActionableState', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    group_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'group_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for group_id field is 11',
        },
      },
    },
    child_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'child_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for child_id field is 11',
        },
      },
    },
  }, {
    tableName: 'actionable_states',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        ActionableState.belongsTo(models.State, {
          foreignKey: 'state_id',
        });
      },
    },
  });

  return ActionableState;
}

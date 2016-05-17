'use strict';

export default function(sequelize, DataTypes) {
  const EntityType = sequelize.define('EntityType', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING(50)
  }, {
    tableName: 'entity_type',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {


        /* Experience.belongsTo(models.Employer, {
          foreignKey: 'employer_id',
        });

        Experience.belongsTo(models.Designation, {
          foreignKey: 'designation_id',
        });

        Experience.belongsTo(models.Region, {
          foreignKey: 'region_id',
        });*/
      },
    },
  });

  return EntityType;
};

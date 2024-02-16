import Sequelize from "sequelize";
import Db from "../util/database";

const Group=Db.define("group",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        unique:true,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull: false
    },
    createdBy:{
        type:Sequelize.STRING,
        allowNull:false
    },
    admin:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

export default Group;
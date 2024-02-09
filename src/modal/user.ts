import Db from "../util/database";
import Sequelize from "sequelize";

const User=Db.define("user",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull: false
    },
    email:{
        type:Sequelize.STRING,
        allowNull: false
    },
    mobile:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false
    },
})

export default User;
import Sequelize from "sequelize";
import Db from "../util/database";

const Message=Db.define("message",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
        unique:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull: false
    }
})

export default Message;
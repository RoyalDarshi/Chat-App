import Sequelize from "sequelize";
import Db from "../util/database";

const ArchiveMessage=Db.define("archive-message",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
        unique:true
    },
    message:{
        type:Sequelize.STRING
    },
    link:{
        type:Sequelize.STRING
    },
    userId:{
        type:Sequelize.INTEGER
    },
    groupId:{
        type:Sequelize.INTEGER
    }
})

export default ArchiveMessage;
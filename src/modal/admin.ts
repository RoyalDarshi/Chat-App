import Db from "../util/database";
import {BOOLEAN} from "sequelize";

const User_Group=Db.define("user_group",{
    isAdmin:{
        type:BOOLEAN,
        allowNull:false,
    },
})

export default User_Group
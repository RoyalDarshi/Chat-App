import {Sequelize} from "sequelize";

const Db=new Sequelize(process.env.SCHEMA_NAME!,
    process.env.DB_USERNAME!,process.env.DB_PASSWORD,{
        dialect:"mysql",
        host:process.env.HOST_NAME
    })

export default Db;
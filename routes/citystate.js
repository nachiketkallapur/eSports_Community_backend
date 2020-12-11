var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
// const { route } = require("./game");

router.post("/fetch",(req,res,next)=>{
    const{playerCity} = req.body;
    console.log("Citystate body reveived: ",req.body)

    try{
        sql.query("select * from citystate where P_city=?",[[playerCity]],
        (err,results,fields) => {
            if(err){
                res.send({message:err.sqlMessage,data:[],error:true}); return;
            } else if(data.length===0){
                console.log("Given city is not present in the table");
                res.send({message:"Given city is not present in the table",error:false,data:[]}); return;
            } else {
                res.send({message:"Fetched citystate record",error:false,data:[]}); return;
            }
        })
    } catch(err){
        console.log()
        res.send({message:err.message,error:true,data:[]}); return;
    }
    
})

module.exports=router;
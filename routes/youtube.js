var express = require('express');
var router = express.Router();
var sql = require('../mysql-connection');


/*Add to YT table*/ 
router.post("/",(req,res,next)=>{
    const{ playerUsername, youtubeChannel} = req.body;

    try{
        sql.query("delete from youtube where P_username=?",[[playerUsername]],
        (err,results,fields)=>{
            if(err){
                console.log(err);
                res.send(err.sqlMessage); return;
            } else {

            }
        })
    } catch(err){
        console.log(err);
        res.send(err.message); return;
    }

    try {
        sql.query("insert into youtube(P_username,Y_channelName) values?",
        [[[playerUsername,youtubeChannel]]],
        (err,results,fields)=>{
            if(err){
                console.log(err);
                res.send(err.sqlMessage); return;
            } else{
                res.send("Successfully added data to database"); return;
            }
        })
    } catch (error) {
        console.log(error);
        res.send(error.message); return;
    }
})

/*Fetching YT details of player*/ 
router.post('/fetch',(req,res,next)=>{
    const {playerUsername} = req.body;
    // const playerUsername=username;

    try{
        sql.query("select * from youtube where P_username=?",[[playerUsername]],
        (err,results,fields) => {
            if(err){
                res.send({message:err.sqlMessage,data:[], error:true}); return;
            } 
            if(results.length===0){
                // console.log(results)
                res.send({message:"User doesn't exist in YT table",error:false,data:[]}); return;
            }
            else if(results.length>0){
                // console.log(results)
                res.send({message:"Success",data:results,error:false}); return;
            }
        })
    } catch(err){
        console.log(err);
        res.send({message:err.message,data:[],error:true}); return;
    }

})

module.exports=router;
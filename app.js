const express = require('express');
const ObjectsToCsv = require('objects-to-csv')
const ftp = require('basic-ftp');
const cron = require('node-cron');
const mysql = require('mysql');
require('dotenv').config()
const http = require('http');
const request = require('request')
const fixieUrl = request.defaults({'proxy':process.env.FIXIE_URL})

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'It works!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
});

fixieUrl("https://sheltered-lake-92137.herokuapp.com/", (err, res, body)=>{
  console.log("got reponse: "+ res.statusCode)
})

cron.schedule('* * * * *', async function() {
    const con = await mysql.createPool({
      host: process.env.DB_HOST_DOLIBARR,
      user: process.env.DB_USER_DOLIBARR,
      port: process.env.DB_DATABASE_PORT,
      password: process.env.DB_PASSWORD_DOLIBARR,
      database: process.env.DB_DATABASE_DOLIABRR
    });
    
    await con.getConnection(async function (err) {
      if (err) {
        console.log("[mysql error]",err);
      } else {
        console.log("Connecté à la base de données MySQL!");
        await con.query("SELECT * FROM alpha_pneu", async function (err, rows) {
          if (err) {
            throw err
          } else {
            const client = new ftp.Client();
            client.ftp.verbose = true;
            const csv = new ObjectsToCsv(rows)
            await csv.toDisk('./data/data.csv')
            try {
              await client.access({
                host: process.env.DB_HOST_FTP,
                port: process.env.DB_PORT_FTP,
                user: process.env.DB_USER_FTP,
                password: process.env.DB_PASSWORD_FTP,
              })
              console.log(await client.list());
              await client.uploadFromDir("./data/", "./")
            } catch (erro) {
              console.log(err)
            }
             client.close()
             await con.end(function(err){
               if(err){
                 return console.log(err.message)
               } else {
                 console.log("connection terminé");
               }
             })
          }
        })
      }
    });
});
server.listen(process.env.PORT || 5000);

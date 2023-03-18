const parser = require('body-parser');
const pool = require('./model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()
// console.log(process.env)
const transport = nodemailer.createTransport({
    // service:process.env.SERVICE,
    port:465,
    host:process.env.SMTP,
    auth:{
        user:process.env.MAIL,
        pass:process.env.PASSWORD
    }
})




function generateCode(code){
    let numOfDigit = String(code).length
    if(numOfDigit === 2){
        return numOfDigit.toString()+'COM'+(code*100000000).toString()
        
    }
    else if(numOfDigit === 3){
        return numOfDigit.toString()+'COM'+(code*10000000).toString() 
    }

    else if(numOfDigit === 4){
        return numOfDigit.toString()+'COM'+(code*1000000).toString() 
    }

    else if(numOfDigit === 5){
        return numOfDigit.toString()+'COM'+(code*100000).toString() 
    }
    else if(numOfDigit === 6){
        return numOfDigit.toString()+'COM'+(code*10000).toString() 
    }

    else if(numOfDigit === 7){
        return numOfDigit.toString()+'COM'+(code*1000).toString() 
    }
    else if(numOfDigit === 8){
        return numOfDigit.toString()+'COM'+(code*100).toString() 
    }

    else if(numOfDigit === 9){
        return numOfDigit.toString()+'COM'+(code*10).toString() 
    }
    else if(numOfDigit === 10){
        return numOfDigit.toString()+'COM'+(code).toString() 
    }

    else{
        return numOfDigit.toString()+'COM'+(code*1000000000).toString() 
    }
}
const getIdFromCode = (code)=>{
    let c = code.split('COM')[1];
    let numOfDigit= parseInt(code.split('COM')[0])
    if(numOfDigit === 2){
        return c/100000000
        
    }
    else if(numOfDigit === 3){
        return c/10000000}

    else if(numOfDigit === 4){
        return c/1000000
    }

    else if(numOfDigit === 5){
        return c/100000
    }
    else if(numOfDigit === 6){
        return c/10000
    }

    else if(numOfDigit === 7){
        return c/1000
    }
    else if(numOfDigit === 8){
        return c/100
    }

    else if(numOfDigit === 9){
        return c/10
    }
    else if(numOfDigit === 10){
        return c
    }

    else{
        return c/1000000000
    }
    // return parseInt(c);

}
//create table commodityusers(id serial primary key,firstname varchar,lastname varchar,password varchar,address varchar,city varchar,agentcode varchar,dob date,pincode varchar,country varchar,gender varchar,email varchar,phonenumber varchar,entrydate date);


// {
//     "firstname": "Jarieu",
//     "lastname": "Bah",
//     "password": "medishk2",
//     "pincode":1254,
//     "email":"med2@gmail.com",
//     "address": "40 Betham Lane",
//     "city": "Feetown",
//     "country": "Sierra Leone",
//     "phonenumber": "+23288027244",
//     "gender":"female",
//     "dob":"04/04/1998"
// }



module.exports = (app)=>{

app.get('/api/commodity/:email',(req,res)=>{
    pool.query('SELECT * FROM commodityusers WHERE email = $1',[req.params.email],(err,result)=>{
        if(err) res.status(400).send('Error Occures')
        else{
            res.status(200).json(result.rows)
        }
    })
    // res.send('Hello commodity')
})

//GET ALL CASH

app.get("/api/commodity/cash/getallcash",(req,res)=>{

    pool.query('SELECT * FROM commoditycash',(err,result)=>{
        if(err){
            res.status(400).send(err.stack)
        }
        else{
            res.status(200).send(result.rows)
        }
    })


})


//END CASH


// GET ALL TRANSACTIONS


app.get("/api/commodity/transactions/getalltransactions",(req,res)=>{

    pool.query('SELECT * FROM commoditytransactions',(err,result)=>{
        if(err){
            res.status(400).send(err.stack)
        }
        else{
            res.status(200).send(result.rows)
        }
    })


})


// END TRANSACTIONS

// GET ALL USERS

app.get("/api/commodity/users/getallusers",(req,res)=>{

    pool.query('SELECT * FROM commodityusers',(err,result)=>{
        if(err){
            res.status(400).send(err.stack)
        }
        else{
            res.status(200).send(result.rows)
        }
    })


})



// USERS END

//USER REGISTRATION

app.post('/api/commodity/register',(req,res)=>{

    try{
        let {firstname,lastname,password,pincode,address,city,country,email,phonenumber,dob,gender} = req.body;
        let salt = bcrypt.genSaltSync(10);
        let hashpassword = bcrypt.hashSync(password,salt);
        let hashpincode = bcrypt.hashSync(String(pincode),salt);
        let entrydate = new Date().toString()
        let userInfoList = [firstname,lastname,hashpassword,hashpincode,address,city,country,email,phonenumber,dob,gender,entrydate]
        pool.query('INSERT INTO commodityusers(firstname,lastname,password,pincode,address,city,country,email,phonenumber,dob,gender,entrydate) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',userInfoList,(err,result)=>{
                if(err){
                    res.status(400).send('Email already exist.')
                }else{
                    let userCode = generateCode(result.rows[0].id)
                    pool.query('INSERT INTO commodityusercode(usercode) VALUES($1) RETURNING *',[userCode],(err,result)=>{
                        if(err){
                            res.status(400).send('Usercode insertion fail')
                        }
                        else{
                            res.status(200).send(result.rows[0])
                        }
                    })
                    // res.status(200).json({'pincode':pincode});
                }
            })
        }

    catch(err){
        res.status(400).send(err.stack)
        }})

//USER REGISTRATION ENDS


//EMAIL CONFIRMATION

app.get('/api/commodity/emailconfirmation/:email',(req,res)=>{

    let randNum = Math.floor(Math.random()*(99999 - 10000) + 100000)
    let usermail = req.params.email;
    var mailOptions = {
        from:process.env.MAIL,
        to:usermail,
        subject:'Teax-Commodity',
        html:`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css?family=Bungee+Inline" rel="stylesheet">
       
            <title>MEXU|MAIL</title>
        </head>
        <body style="padding: 4px;font-family: serif">
            <div>
                <h2 style="text-align: center;color:#000;opacity:0.7">Email Confirmation</h2>
                <div style="background-color:#000;height: 300px;padding: 8px;">
                    <h3 style="color:white;text-align: center;">MEXU | commodity</h3>
                    <p style='text-align:center; font-family:serif;color:white;letter-spacing:2px;' >
                        Thank you for accessing Mexu Commodity.To confirm that you are owner of this email,use to confirmation code below to continue validating your account.
                    </p>
                    <h1 style="color:white;text-align:center;letter-spacing:4px;">${randNum}</h1>     
                </div>
            </div>    
        </body>
        </html>`
    };

    transport.sendMail(mailOptions,(err,r)=>{
        if(err){
            res.status(400).send(err.stack)

        }else{
            res.status(200).json({code:randNum})
        }
    })
})
//EMAIL CONFIRMATION ENDS



//LOGIN USER

app.post('/api/commodity/login',(req,res)=>{
    try{
        let email = req.body.email;
        let token = req.body.n_token;
        var errorReport = {
            "email_error":null,
            "password_error":null,
            'otherError':null
        }
        
        var loginReport = {
            'email':null,
            // "password":null, 
            "usercode":null
        }
        
        pool.query('SELECT * FROM commodityusers WHERE email = $1',[email],async(err,result)=>{
        if(err){
            errorReport.email_error = "Email doesn't exist";
            res.status(400).json(errorReport)
        }
        else{
        if(result.rows.length <= 0){
            errorReport.email_error = "Email doesn't exist";
            res.status(400).json(errorReport)
        } 
        else if(bcrypt.compareSync(req.body.password,result.rows[0].password)){
            loginReport.email = result.rows[0].email;
            // loginReport.password = req.body.password;
            loginReport.usercode = generateCode(result.rows[0].id)
            pool.query(`UPDATE commodityusers SET notificationtoken = $1 WHERE email = $2`,[token,email],(err,result)=>{

                if(err){
                    errorReport.email_error = "Email doesn't exist";
                    res.status(400).json(errorReport)
                }
                else{
                    res.status(200).json(loginReport)

                }
            })
        

        }else{
            errorReport.password_error = "Password is incorrect";
            res.status(400).json(errorReport)
        }
        }    
        })}
    catch(err){
        res.status(400).send(err)
    }
})

//LOGIN ENDS

//CHECK FOR VALID USERCODE

app.get('/api/commodity/usercodecheck/:usercode',(req,res)=>{
    // let userId = (req.params.usercode).split('C')[0]
    // console.log(userId)
    pool.query('SELECT * FROM commodityusercode WHERE usercode = $1',[req.params.usercode],(err,result)=>{
        if(err){
            res.status(400).send(err.stack)
        }
        else{
            res.status(200).send("Usercode")
        }
    })

})



app.get('/api/commodity/usercodeinsert/:usercode',(req,res)=>{
    // let userId = (req.params.usercode).split('C')[0]
    // console.log(userId)
    pool.query('INSERT INTO commodityusercode(usercode) VALUES($1) RETURNING *',[req.params.usercode],(err,result)=>{
        if(err){
            res.status(400).send(err.stack)
        }
        else{
            res.status(200).send(result.rows[0])
        }
    })

})



app.get('/api/commodity/usercodes/getallusercodes',(req,res)=>{
    // let userId = (req.params.usercode).split('C')[0]
    // console.log(userId)
    pool.query('SELECT * FROM commodityusercode',(err,result)=>{
        if(err){
            res.status(400).send(err.stack)
        }
        else{
            res.status(200).json(result.rows)
        }
    })

})


//TRANSFER MONEY


app.post("/api/commodity/transfermoney",(req,res)=>{

    let {sendercode,receivercode,amount} = req.body
    let entrydate = new Date().toString()
    let transferInfo = [[sendercode,-(Math.abs(amount))],[receivercode,Math.abs(amount)]]
    let historyInfo = [sendercode,receivercode,amount,entrydate]
    // console.log(transferInfo)
    let obj = transferInfo[0]
    // console.log('Object one')
    // console.log(obj)
    let code = obj[0]
    // console.log(code)
    var values = [obj[1],code,entrydate]
    let obj1 = transferInfo[1]
    // console.log('Object two')
    // console.log(obj1)
    let code1 = obj1[0]
    // console.log(code)
    var values1 = [obj1[1],code1,entrydate]
    // console.log(values)
    pool.query('SELECT * FROM commoditycash WHERE usercode = $1',[code],(err,result)=>{
            if(err) res.status(400).send(err.stack)
            else{
            // console.log('Values...one.')
            // console.log(values)
            let sql = 'INSERT INTO commoditycash(balance,usercode,entrydate) VALUES($1,$2,$3) RETURNING *'
                if(result.rows.length > 0){
                sql = 'UPDATE commoditycash SET balance = ((SELECT balance FROM commoditycash WHERE usercode = $2) + $1),entrydate = $3 WHERE usercode = $2 RETURNING *'
                }
            pool.query(sql,values,(err,result)=>{

            if(err){
                console.log(err.stack)
                res.status(400).send('Error trying to connect to transfermoney table')}
            else{
                ///COMMODITY CASH INSERTION NUMBER TWO
                pool.query('SELECT * FROM commoditycash WHERE usercode = $1',[code1],(err,result)=>{
                    if(err) res.status(400).send(err.stack)
                    else{
                    // console.log('Values....two')
                    // console.log(values1)
                    let sql = 'INSERT INTO commoditycash(balance,usercode,entrydate) VALUES($1,$2,$3) RETURNING *'
                        if(result.rows.length > 0){
                        sql = 'UPDATE commoditycash SET balance = ((SELECT balance FROM commoditycash WHERE usercode = $2) + $1),entrydate = $3 WHERE usercode = $2 RETURNING *'
                    }
                    pool.query(sql,values1,(err,result)=>{
                    if(err){
                        console.log(err.stack)
                        res.status(400).send(err.stack)
                    }else{

                        ////TRANSACTIONS 
                        pool.query('INSERT INTO commoditytransactions(sendercode,receivercode,amount,entrydate) VALUES($1,$2,$3,$4) RETURNING *',historyInfo,(err,result)=>{
                            if(err) res.status(400).send('Error trying to connect to transaction table')
                            else{
                                let userId = getIdFromCode(code1);
                                console.log(userId)
                                pool.query('SELECT * FROM commodityusers WHERE id = $1',[userId],(err,result)=>{
                                    if(err){
                                        console.log(err.stack)
                                        res.status(400).send(err.stack)
                                    }
                                    else{
                                        if(result.rowCount < 1){
                                            res.status(400).send('Error trying to connect to transfermoney table')
                                        }
                                        else{
                                            res.status(200).json(result.rows[0])
                                        }
                                    }
                                    
                                });
                            }
                        
                        })
                        ///TRANSACTION ENDS    
                    }
                })
             }
            })

            ///COMMODITY CASH INSERTION NUMBER TWO ENDS
           }
        })
      }
    })
})
    //FIRST COMMODITY CASH INSERTION ENDS9999999999


     //NEXT TO KIN
    app.post('/api/commodity/nexttokin',(req,res)=>{
    let{firstname,lastname,address,usercode} = req.body
    let transfereeInfo = [firstname,lastname,address,usercode]
     pool.query('INSERT INTO nexttokin(firstname,lastname,address,usercode) VALUES($1,$2,$3,$4) RETURNING *',transfereeInfo,(err,result)=>{
         if(err){
             res.status(400).send(err.stack)
         }
         else{
             res.status(200).send(result.rows)
         }
     })
})

app.post('/api/commodity/nexttokinupdate',(req,res)=>{
    let{firstname,lastname,address,usercode} = req.body
    let updateInfo = [firstname,lastname,address,usercode]
    pool.query('UPDATE nexttokin SET firstname = $1,lastname = $2,address = $2 WHERE usercode = $4 RETURNING *',updateInfo,(err,result)=>{
    if(err){
        res.status(400).send(err.stack)
    }
    else{
        res.status(200).send('Update successful')
    }})
})


app.get('/api/commodity/nexttokin/:usercode',(req,res)=>{
    pool.query('SELECT * FROM nexttokin WHERE usercode = $1',[req.params.usercode],(err,result)=>{
        if(err){
            res.status(400).send(err.stack)
        }
        else{
            res.status(200).json(result.rows)
        }
    })
})

//NEXT TO KIN ENDS
//TRANSFEREE 

app.post('/api/commodity/transferees',(req,res)=>{
    let{transfereename,transfereeusercode,usercode} = req.body
    let transfereeInfo = [transfereename,transfereeusercode,usercode]
     pool.query('INSERT INTO commoditytransferees(transfereename,transfereeusercode,usercode) VALUES($1,$2,$3) RETURNING *',transfereeInfo,(err,result)=>{
         if(err){
             res.status(400).send(err.stack)
         }
         else{
             res.status(200).send(result.rows)
         }
     })
})


app.get('/api/commodity/update/:code',(req,res)=>{
    
    let usercode  = req.params.code
   
     pool.query('UPDATE commoditycash SET balance = $1 WHERE usercode = $2 RETURNING *',[100000000,usercode],(err,result)=>{
         if(err){
             res.status(400).send(err.stack)
         }
         else{
             res.status(200).send(result.rows)
         }
     })
})

app.get('/api/commodity/insert/:code',(req,res)=>{
    
    let usercode  = req.params.code
   
     pool.query('INSERT INTO commoditycash(balance,usercode) VALUES($1,$2) RETURNING *',[100000000,usercode],(err,result)=>{
         if(err){
             res.status(400).send(err.stack)
         }
         else{
             res.status(200).send(result.rows)
         }
     })
})



app.delete('/api/commodity/transferees/:transfereeusercode',(req,res)=>{
    pool.query('DELETE FROM commoditytransferees WHERE transfereeusercode = $1',[req.params.transfereeusercode],(err,result)=>{
    if(err){
        res.status(400).send(err.stack)
    }
    else{
        res.status(200).send('Delete transferee')
    }
})
})


app.get('/api/commodity/transferees/:usercode',(req,res)=>{
    pool.query('SELECT * FROM commoditytransferees WHERE usercode = $1',[req.params.usercode],(err,result)=>{
        if(err){
            res.status(400).send(err.stack)
        }
        else{
            res.status(200).json(result.rows)
        }
    })
})

//TRANSFEREE ENDS

//TRANSFER MONEY ENDS

//CHECK BALANCE 

app.get('/api/commodity/checkbalance/:usercode',(req,res)=>{
    let usercode = req.params.usercode
    pool.query('SELECT balance FROM commoditycash WHERE usercode = $1',[usercode],(err,result)=>{
        if(err){
            res.status(400).send('Error trying to check balance,Try again')
        }
        else{
            if(result.rowCount > 0){
                res.status(200).json([result.rows[0].balance])
            }
            else{
                res.status(200).json([])
            }
            
        }
    })
})

//CHECK BALANCE ENDS HERE

//////////////////////////////////////SETTINGS//////////////////////////////////

////PASSWORD UPDATE
app.post('/api/commodity/settings/updatepassword',(req,res)=>{
    let {password,email} = req.body
    let salt = bcrypt.genSaltSync(10);
    let hashpassword = bcrypt.hashSync(password,salt);
    // let hashpincode = bcrypt.hashSync(String(pincode),salt);
    pool.query('UPDATE commodityusers SET password = $1 WHERE email = $2 RETURNING *',[hashpassword,email],(err,result)=>{
        if(err){
            res.status(400).send('Error trying to udate password')
        }
        else{
            res.status(200).json(result.rows[0])
        }
    })
})
///PASSWORD UPDATE ENDS


////PINCODE UPDATE
app.post('/api/commodity/settings/updatepincode',(req,res)=>{
    let {pincode,email} = req.body
    let salt = bcrypt.genSaltSync(10);
    let hashpincode = bcrypt.hashSync(String(pincode),salt);
    // let hashpincode = bcrypt.hashSync(String(pincode),salt);
    pool.query('UPDATE commodityusers SET pincode = $1 WHERE email = $2 RETURNING *',[hashpincode,email],(err,result)=>{
        if(err){
            res.status(400).send('Error trying to udate pincode')
        }
        else{
            res.status(200).json(result.rows[0])
        }
    })
})
///PINCODE UPDATE ENDS

app.get("/api/commodity/settings/getpincode/:email/:pincode",(req,res)=>{
    let email = req.params.email;
    let pincode = req.params.pincode;

    pool.query('SELECT * FROM commodityusers WHERE email = $1',[email],(err,result)=>{
        if(err){
            res.status(400).send('Error trying to access pincode')
        }
        else{
            if(result.rows.length <= 0){
        
                res.status(400).send("Email is not registered.")
            } 
            else if(bcrypt.compareSync(pincode,result.rows[0].pincode)){
                res.status(200).json({"code":pincode})
    
            }else{
                res.status(400).json("Email in invalid.")
            }
            }
    })



})






////////////////////////////////////SETTINGS END////////////////////////////////

////ROUTER ENDS HERE

}


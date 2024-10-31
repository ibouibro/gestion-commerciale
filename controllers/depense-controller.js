const sql = require("./../Database/db.js");
const moment = require('moment');

class controller{

    constructor(){}


    depenses(request, response)
    {
        if(request.session.connected==true){
        sql.query("select * from depense", function (err, resultp, fields) {
            if (err) 
            {
                console.log(err)
            }
            else{
                return response.render('depenses/depenses', {
                    depenses : resultp,
                    
                   
                });
            }
        }) 
    }else{
        response.render("login");
    } 
    }



    ajouter_depense(request, response)
    {
        if(request.session.connected==true){
        sql.query("insert into depense (description , montant,date) values ('"+request.body.description+"', '"+request.body.montant+"','"+request.body.date+"')", function (err, result, fields) {
            if (err) 
            {
                console.log(err)
            }
            else{
                sql.query("select * from depense", function (err, resultp, fields) {
                    if (err) 
                    {
                        console.log(err)
                    }
                    else{
                        return response.render('depenses/depenses', {
                            depenses : resultp,
                            message : "la dépense a été créée !"
                           
                        });
                    }
                }) 
            }
        })  
    }else{
        response.render("login");
    }
    }

supprimer_depense(request, response)
    {
        if(request.session.connected==true){
        sql.query("delete from depense where id = '"+request.query.id+"'", function (err, result, fields) {
            if (err) 
            {
                console.log(err)
            }
            else{
                sql.query("select * from depense", function (err, resultp, fields) {
                    if (err) 
                    {
                        console.log(err)
                    }
                    else{
                        return response.render('depenses/depenses', {
                            depenses : resultp,
                            message : "la dépense a été supprimée !"
                           
                        });
                    }
                }) 
            }
        })  
    }else{
        response.render("login");
    }
    }

}

module.exports= new controller();
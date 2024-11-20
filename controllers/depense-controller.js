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
                const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = resultp.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(resultp.length / limit);
                return response.render('depenses/depenses', {
                    depenses : paginatedData,
                    currentPage : page,
                    totalPages
                    
                   
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
                        const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = resultp.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(resultp.length / limit);
                        return response.render('depenses/depenses', {
                            depenses : paginatedData,
                            message : "la dépense a été créée !",
                            currentPage : page,
                            totalPages
                           
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
                        const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = resultp.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(resultp.length / limit);
                        return response.render('depenses/depenses', {
                            depenses : paginatedData,
                            message : "la dépense a été supprimée !",
                            currentPage : page,
                            totalPages
                           
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
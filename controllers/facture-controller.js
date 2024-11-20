const sql = require("./../Database/db.js");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


class controller{

    constructor(){}

    factures(request,response)
{
 if(request.session.connected == true)
 {
    sql.query("SELECT fa.id, fa.date, fa.acompte, c.nom as nom, c.prenom, d.id as id_devis  FROM facture fa, client c, devis d where d.id = fa.id_devis and c.id_client = d.id_client  ", function (err, result, fields) {
        if (err) 
        {
            console.log(err);
        }else{
            
            sql.query("SELECT c.id_client , c.nom, c.prenom from client c  ", function (err, resultc, fields) {
                if (err) 
                {
                    console.log(err);
                }else{
                    var type="devis";
                    sql.query("SELECT c.nom, c.prenom, d.id from devis d, client c where d.id_client = c.id_client and d.type= '"+type+"' and d.id not in (select id_devis from facture) ", function (err, resultd, fields) {
                        if (err) 
                        {
                            console.log(err);
                        }else{
                            
                            sql.query("select id_produit, nom from produit", function (err, resultp, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }else{
                                    
                                    sql.query("SELECT sum(p.montant) as s , p.id_facture from paiement p group by p.id_facture", function (err, resultpai, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }else{
                                            
                                            sql.query("SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as ttc from  facture f, produit p, devis d,  produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id  group by f.id", function (err, resultttc, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }else{
                                                    const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = result.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(result.length / limit);
                                                    
                                                    return response.render('factures/factures', {
                                                        factures: paginatedData,
                                                        nom : request.session.nom,
                                                        clients : resultc,
                                                        devis : resultd,
                                                        ttc : resultttc,
                                                        paiement : resultpai,
                                                        produits : resultp,
                                                        currentPage : page,
                                                        totalPages
                                                    })
                                                
                                                    
                                                }
                                                
                                              });
                                        
                                            
                                        }
                                        
                                      });
                                
                                    
                                }
                                
                              });
                        
                            
                        }
                        
                      });
                    
                }
                
              });
        
            
        }
        
      });

 }else{
    response.render("login");
 }


}


rapport_caisse(request,response)
{
 if(request.session.connected == true)
 {
   
    sql.query(" select f.nom, c.date, c.montant as sortie from commande c, fournisseur f where  c.id_fournisseur = f.id ", function (err, resultc, fields) {
        if (err) 
        {
            console.log(err);
        }else{
            
            sql.query(" select c.nom, p.date, c.prenom, p.montant as entree from paiement p, facture f, devis d, client c where c.id_client = d.id_client and p.id_facture = f.id and f.id_devis = d.id  ", function (err, resultv, fields) {
                if (err) 
                {
                    console.log(err);
                }else{
                    
                    
                    sql.query(" select f.acompte as entree, f.date, c.nom, c.prenom from facture f, client c, devis d where c.id_client = d.id_client and f.id_devis = d.id  ", function (err, resulta, fields) {
                        if (err) 
                        {
                            console.log(err);
                        }else{
                            
                            sql.query(" select d.montant as sortie, d.date from depense d ", function (err, resultd, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }else{
                                    
                                    return response.render('paiements/rapport_caisse', {
                                        ventes: resultv,
                                        acomptes : resulta,
                                        depenses : resultd,
                                        commandes : resultc,
                                        nom : request.session.nom,
                                        debut : request.body.debut,
                                        fin : request.body.fin
                                    })
                                
                                
                                    
                                }
                                
                              });
                        
                            
                        }
                        
                      });
                    
                }
                
              });
        
            
        }
        
      });

 }else{
    response.render("login");
 }


}


ajouter_facture_sd(request, response)
{
   if(request.session.connected== true)
   {
    sql.query("insert into facture (date,id_devis) values('"+request.body.date+"','"+request.body.id_devis+"') ", function (err, res, fields) {
        if (err) 
        {
            console.log(err);
        }else{
            
            sql.query("update produit p, produit_devis pd set p.qte_en_stock = p.qte_en_stock - pd.quantite where p.id_produit = pd.id_produit and pd.id_devis = '"+request.body.id_devis+"' ", function (err, resd, fields) {
                if (err) 
                {
                    console.log(err);
                }else{
                    
                    sql.query("SELECT fa.id, fa.acompte, fa.date, c.nom as nom, c.prenom, d.id as id_devis  FROM facture fa, client c, devis d where d.id = fa.id_devis and c.id_client = d.id_client  ", function (err, result, fields) {
                        if (err) 
                        {
                            console.log(err);
                        }else{
                            
                            sql.query("SELECT c.id_client , c.nom, c.prenom from client c  ", function (err, resultc, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }else{
                                    var type="devis";
                                    sql.query("SELECT c.nom, c.prenom, d.id from devis d, client c where d.id_client = c.id_client and d.type= '"+type+"' and d.id not in (select id_devis from facture) ", function (err, resultd, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }else{
                                            
                                            sql.query("select id_produit, nom from produit", function (err, resultp, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }else{
                                                    
                                                     
                                    sql.query("SELECT sum(p.montant) as s , p.id_facture from paiement p group by p.id_facture", function (err, resultpai, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }else{
                                            
                                            sql.query("SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as ttc from  facture f, produit p, devis d,  produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id  group by f.id", function (err, resultttc, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }else{
                                                    
                                                    const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = result.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(result.length / limit);
                                                    return response.render('factures/factures', {
                                                        factures: paginatedData,
                                                        nom : request.session.nom,
                                                        clients : resultc,
                                                        devis : resultd,
                                                        ttc : resultttc,
                                                        paiement : resultpai,
                                                        produits : resultp,
                                                        message : "la facture a été créée avec succès!",
                                                        currentPage : page,
                                                        totalPages
                                                    })
                                                
                                                    
                                                }
                                                
                                              });
                                        
                                            
                                        }
                                        
                                      });
                                                
                                                    
                                                }
                                                
                                              });
                                        
                                            
                                        }
                                        
                                      });
                                    
                                }
                                
                              });
                        
                            
                        }
                        
                      });
                    
                }
                
              });
            
        }
        
      });
   }else{
    response.render("login");
   }
}

ajouter_facture(request,response)
{

    if(request.session.connected == true)
        {
           
   
        var type = "facture";
        var tva =0;
        if(request.body.tva=="tva")
        {
            tva=18;
        }
        sql.query(" insert into devis(date,id_client,type,tva,remise) values('"+request.body.date+"','"+request.body.id_client+"','"+type+"','"+tva+"','"+request.body.rem+"') ", function (err, resd1, fields) {
            if (err) 
            {
                console.log(err);
            }else{
                
               for(var i=0;i< request.body.quant.length;i++)
               {

                sql.query("insert into produit_devis (quantite,id_produit,id_devis) values('"+request.body.quant[i]+"','"+request.body.prod[i]+"','"+resd1.insertId+"') ", function (err, res, fields) {
                    if (err) 
                    {
                        console.log(err);
                    }else{
                        
                       
                        
                    }
                    
                  });




                
               }

               sql.query("insert into facture (date,id_devis,acompte) values ('"+request.body.date+"','"+resd1.insertId+"','"+request.body.acompte+"') ", function (err, result, fields) {
                if (err) 
                {
                    console.log(err);
                }else{
                    
                    sql.query("select * from produit_devis where id_devis = '"+resd1.insertId+"' ", function (err, resultpd, fields) {
                        if (err) 
                        {
                            console.log(err);
                        }else{
                            for(var i=0; i<resultpd.length;i++)
                            {
                            sql.query("update produit set qte_en_stock =qte_en_stock - '"+resultpd[i].quantite+"' where id_produit = '"+resultpd[i].id_produit+"'", function (err, res, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }else{
                                    
                                   
                                    
                                }
                                
                              });
                            }
                            sql.query("SELECT fa.id, fa.acompte, fa.date, c.nom as nom, c.prenom, d.id as id_devis  FROM facture fa, client c, devis d where d.id = fa.id_devis and c.id_client = d.id_client  ", function (err, result, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }else{
                                    
                                    sql.query("SELECT c.id_client , c.nom, c.prenom from client c  ", function (err, resultc, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }else{
                                            var type="devis";
                                            sql.query("SELECT c.nom, c.prenom, d.id from devis d, client c where d.id_client = c.id_client and d.type= '"+type+"' and d.id not in (select id_devis from facture) ", function (err, resultd, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }else{
                                                    
                                                    sql.query("select id_produit, nom from produit ", function (err, resultp, fields) {
                                                        if (err) 
                                                        {
                                                            console.log(err);
                                                        }else{
                                                            
                                                             
                                    sql.query("SELECT sum(p.montant) as s , p.id_facture from paiement p group by p.id_facture", function (err, resultpai, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }else{
                                            
                                            sql.query("SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as ttc from  facture f, produit p, devis d,  produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id  group by f.id", function (err, resultttc, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }else{
                                                    const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = result.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(result.length / limit);
                                                    return response.render('factures/factures', {
                                                        factures: paginatedData,
                                                        nom : request.session.nom,
                                                        clients : resultc,
                                                        devis : resultd,
                                                        ttc : resultttc,
                                                        paiement : resultpai,
                                                        produits : resultp,
                                                        message : "la facture a été créée avec succès!",
                                                        currentPage : page,
                                                        totalPages
                                                    })
                                                
                                                    
                                                }
                                                
                                              });
                                        
                                            
                                        }
                                        
                                      });
                                                        
                                                            
                                                        }
                                                        
                                                      });
                                                
                                                    
                                                }
                                                
                                              });
                                            
                                        }
                                        
                                      });
                                
                                    
                                }
                                
                              });
                            
                            
                        }
                        
                      });
                
                    
                }
                
              });


                
            }
            
          });
    

    
    }else{
        response.render("login");
    }

}


supprimer_facture(request,response)
{

    if(request.session.connected == true)
        {
            var id = request.query.id;
   
            
            sql.query("select pd.quantite, pd.id_produit from produit_devis pd, facture , devis  where pd.id_devis = devis.id and facture.id_devis = devis.id and facture.id = '"+id+"' ", function (err, resultpd, fields) {
                if (err) 
                {
                    console.log(err);
                }else{
                    console.log(resultpd);
                    for(var i=0; i<resultpd.length;i++)
                    {
                    sql.query("update produit set qte_en_stock = qte_en_stock + '"+resultpd[i].quantite+"' where id_produit = '"+resultpd[i].id_produit+"'", function (err, res, fields) {
                        if (err) 
                        {
                            console.log(err);
                        }else{
                            
                           
                            
                        }
                        
                      });
                    }

                    sql.query("delete from facture where id ='"+id+"' ", function (err, result, fields) {
                        if (err) 
                        {
                            console.log(err);
                           
                        }else{
                            sql.query("SELECT fa.id, fa.acompte, fa.date, c.nom as nom, c.prenom, d.id as id_devis  FROM facture fa, client c, devis d where d.id = fa.id_devis and c.id_client = d.id_client  ", function (err, result, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }else{
                                    
                                    sql.query("SELECT c.id_client , c.nom, c.prenom from client c  ", function (err, resultc, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }else{
                                            var type="devis";
                                            sql.query("SELECT c.nom, c.prenom, d.id from devis d, client c where d.id_client = c.id_client and d.type= '"+type+"' and d.id not in (select id_devis from facture) ", function (err, resultd, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }else{
                                                    
                                                    sql.query("select id_produit, nom from produit", function (err, resultp, fields) {
                                                        if (err) 
                                                        {
                                                            console.log(err);
                                                        }else{
                                                            
                                                            
                                    sql.query("SELECT sum(p.montant) as s , p.id_facture from paiement p group by p.id_facture", function (err, resultpai, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }else{
                                            
                                            sql.query("SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as ttc from  facture f, produit p, devis d,  produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id  group by f.id", function (err, resultttc, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }else{
                                                    
                                                    const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = result.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(result.length / limit);
                                                    return response.render('factures/factures', {
                                                        factures: paginatedData,
                                                        nom : request.session.nom,
                                                        clients : resultc,
                                                        devis : resultd,
                                                        ttc : resultttc,
                                                        paiement : resultpai,
                                                        produits : resultp,
                                                        message : "la facture a été supprimée",
                                                        currentPage : page,
                                                        totalPages
                                                    })
                                                
                                                    
                                                }
                                                
                                              });
                                        
                                            
                                        }
                                        
                                      });
                                                        
                                                            
                                                        }
                                                        
                                                      });
                                                
                                                    
                                                }
                                                
                                              });
                                            
                                        }
                                        
                                      });
                                
                                    
                                }
                                
                              });
                        }
                })

                    
                    
                    
                }
                
              });
        
       

    
    }else{
        response.render("login");
    }

}





modifier_facture(request,response)
{

    if(request.session.connected == true)
        {
           
            var tva =0;
            if(request.body.tva=="tva")
            {
                tva=18;
            }

            sql.query("update devis d, facture f set d.id_client = '"+request.body.id_client+"', f.acompte = '"+request.body.acompte+"', d.tva = '"+tva+"', d.remise = '"+request.body.rem+"' where f.id_devis = d.id and f.id = '"+request.body.id+"' ",(err,res) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    sql.query("update produit p , produit_devis pd set p.qte_en_stock = p.qte_en_stock + pd.quantite where pd.id_produit = p.id_produit and pd.id_devis ='"+request.body.id_devis+"' ",(err,res) =>{
                        if(err)
                        {
                           console.log(err)
                        }else{
                         
                            sql.query("delete from produit_devis where id_devis ='"+request.body.id_devis+"' ",(err,resp) =>{
                                if(err)
                                {
                                   console.log(err)
                                }else{
                                 
                          for(var i=0;i<request.body.produit.length;i++ )
                          {
                            sql.query("insert into produit_devis (id_produit, quantite, id_devis) values('"+request.body.prod[i]+"','"+request.body.quant[i]+"','"+request.body.id_devis+"') ",(err,res) =>{
                                if(err)
                                {
                                   console.log(err)
                                }else{
                                 
                                    
                   
                                    
                                }
                            })
                          }

                          for(var i=0;i<request.body.produit.length;i++ )
                            {
                                sql.query("update produit set qte_en_stock = qte_en_stock - '"+request.body.quant[i]+"' where id_produit = '"+request.body.prod[i]+"'",(err,res1) =>{
                                    if(err)
                                    {
                                       console.log(err)
                                    }else{
                                     
                              
                                        
                                        
                                    }
                                })
                            }

                          sql.query("SELECT fa.id, fa.acompte, fa.date, c.nom as nom, c.prenom, d.id as id_devis  FROM facture fa, client c, devis d where d.id = fa.id_devis and c.id_client = d.id_client  ", function (err, result, fields) {
                            if (err) 
                            {
                                console.log(err);
                            }else{
                                
                                sql.query("SELECT c.id_client , c.nom, c.prenom from client c  ", function (err, resultc, fields) {
                                    if (err) 
                                    {
                                        console.log(err);
                                    }else{
                                        var type="devis";
                                        sql.query("SELECT c.nom, c.prenom, d.id from devis d, client c where d.id_client = c.id_client and d.type= '"+type+"' and d.id not in (select id_devis from facture) ", function (err, resultd, fields) {
                                            if (err) 
                                            {
                                                console.log(err);
                                            }else{
                                                
                                                sql.query("select id_produit, nom from produit", function (err, resultp, fields) {
                                                    if (err) 
                                                    {
                                                        console.log(err);
                                                    }else{
                                                        
                                                         
                                    sql.query("SELECT sum(p.montant) as s , p.id_facture from paiement p group by p.id_facture", function (err, resultpai, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }else{
                                            
                                            sql.query("SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as ttc from  facture f, produit p, devis d,  produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id  group by f.id", function (err, resultttc, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }else{

                                                    const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = result.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(result.length / limit);
                                                    
                                                    return response.render('factures/factures', {
                                                        factures: paginatedData,
                                                        nom : request.session.nom,
                                                        clients : resultc,
                                                        devis : resultd,
                                                        ttc : resultttc,
                                                        paiement : resultpai,
                                                        produits : resultp,
                                                        message : "la facture a été modifiée avec succès",
                                                        currentPage : page,
                                                        totalPages
                                                    })
                                                
                                                    
                                                }
                                                
                                              });
                                        
                                            
                                        }
                                        
                                      });
                                                    
                                                        
                                                    }
                                                    
                                                  });
                                            
                                                
                                            }
                                            
                                          });
                                        
                                    }
                                    
                                  });
                            
                                
                            }
                            
                          });
                   
                                    
                                }
                            })
           
                            
                        }
                    })
                    
                }
            })
                 
            
    }else{
        response.render("login");
    }

}




ajouter_facture_form(request,response)
{
    if(request.session.connected == true)
        {
    sql.query("SELECT c.nom, c.prenom, c.id_client from  client c  ", function (err, resultc, fields) {
        if (err){
            console.log(err)
        }
            else{ 
            
           sql.query("SELECT p.nom, p.prix, p.id_produit from produit p ", function (err, resultp, fields) {
        if (err){
            console.log(err)
        }
            else{ 
            
            return response.render('factures/ajouter_facture_form', {
                clients: resultc,
                nom : request.session.nom,
                produits : resultp
            })
        
          
            }
        
      });
          
            }
        
      });
    }else{
        response.render("login");
    }
}

modifier_facture_form(request,response)
{
    if(request.session.connected == true)
        {
            
    sql.query("Select p.nom, p.id_produit from produit p ", function (err, resultp, fields) {
        if (err){
            console.log(err)
        }
            else{ 
            var id = request.query.id;
        
                sql.query("SELECT c.nom, c.prenom, c.id_client, d.id  as id_devis, d.tva, d.remise, f.id as id, f.acompte from devis d, client c, facture f where d.id_client = c.id_client and f.id_devis = d.id  and f.id = '"+id+"' ", function (err, resultf, fields) {
                    if (err){
                        console.log(err)
                    }
                        else{ 
                        
                            sql.query(" select p.nom, pd.quantite, pd.id_produit from produit_devis pd, produit p , facture f, devis d where p.id_produit = pd.id_produit and pd.id_devis = d.id and f.id_devis = d.id and f.id = '"+id+"' ", function (err, resultpd, fields) {
                                if (err){
                                    console.log(err)
                                }
                                    else{ 
                                    
                                        sql.query("select c.id_client, c.nom, c.prenom from client c ", function (err, resultc, fields) {
                                            if (err){
                                                console.log(err)
                                            }
                                                else{ 
                                                
                                                    return response.render('factures/modifier_facture_form', {
                                                        produits: resultp,
                                                        facture : resultf[0],
                                                        nom : request.session.nom,
                                                        pd : resultpd,
                                                        clients : resultc
                                                    })
                                                
                                            
                                              
                                                }
                                            
                                          });
                                    
                                
                                  
                                    }
                                
                              });
                    
                      
                        }
                    
                  });
          
            }
        
      });
    }else{
        response.render("login");
    }
}



one_facture(request,response)
{
    if(request.session.connected==true)
        {
            var id = request.query.id;
sql.query("select f.date, f.id as id, c.nom , c.prenom , d.id as id_devis, d.tva , d.remise from client c, devis d, facture f where c.id_client = d.id_client and d.id = f.id_devis and f.id = '"+id+"'",(err,resd) =>{
    if(err)
    {
       console.log(err);
    }else{
        sql.query("select p.nom, p.prix , p.prix * '"+resd[0].tva+"'/100 as val_tax , p.prix*'"+resd[0].remise+"'/100 as remise, pd.quantite, p.pourcent_reduction_promo as pr  from produit p, produit_devis pd, facture f, devis d where p.id_produit = pd.id_produit and f.id_devis = d.id and pd.id_devis = d.id and f.id = '"+id+"'",(err,resp) =>{
            if(err)
            {
               console.log(err);
            }else{
             

                 

        response.render("factures/one_facture",
            {
                nom : request.session.nom,
                produits : resp,
                facture : resd[0]
            }
        )
            }
    }
        )}
})
        }
        else
        {
            response.render("login");
        } 
}



generer_facture_pdf(request,response)
{
    if(request.session.connected==true)
        {
            var id = request.query.id;
sql.query("select f.date, f.id as id, c.nom , c.prenom , d.id as id_devis from client c, devis d, facture f where c.id_client = d.id_client and d.id = f.id_devis and f.id = '"+id+"'",(err,resd) =>{
    if(err)
    {
        console.log(err);
    }else{
        console.log(resd[0]);
        sql.query("select p.nom, p.prix , p.prix * 18/100 as val_tax , p.prix*p.pourcent_reduction_promo/100 as remise, pd.quantite, p.pourcent_reduction_promo as pr  from produit p, produit_devis pd, facture f, devis d where p.id_produit = pd.id_produit and f.id_devis = d.id and pd.id_devis = d.id and f.id = '"+id+"'",(err,resp) =>{
            if(err)
            {
                console.log(err);
            }else{
               
        response.render("factures/facture_pdf",
            {
                nom : request.session.nom
            }
        )
            }
    }
        )}
})
        }
        else
        {
            response.render("login");
        } 
}



}

c = new controller();
module.exports=c;
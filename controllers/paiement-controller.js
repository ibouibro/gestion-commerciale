const sql = require("./../Database/db.js");
const moment = require('moment');

class controller{

    constructor(){}

ajouter_paiement(request,response)
{
    sql.query("insert into paiement (date,id_facture,montant) values('"+request.body.date+"','"+request.body.id_facture+"','"+request.body.montant+"')", function (err, resultttc, fields) {
        if (err) 
        {
            console.log(err);
        }
        else{
            
            sql.query("SELECT p.id, p.date, p.montant, c.nom, c.prenom, f.id as id_facture from paiement p, client c, facture f, devis d where p.id_facture = f.id and c.id_client = d.id_client and d.id = f.id_devis ", function (err, resultp, fields) {
                if (err) 
                {
                    console.log(err);
                }
                else{
                    
                    sql.query("SELECT f.id, c.nom, c.prenom from facture f, client c, devis d where f.id_devis = d.id and c.id_client = d.id_client", function (err, resultf, fields) {
                        if (err) 
                        {
                            console.log(err);
                        }
                        else{
                            
                            sql.query("SELECT acompte, id from facture ", function (err, resulta, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }
                                else{
                                    
                                    sql.query("SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as val from  facture f, produit p, devis d, produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id group by f.id", function (err, resultttc, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }
                                        else{
                                            
                                            const page = parseInt(request.query.page) || 1;
                                            const limit = 10; // Rows per page
                                            const startIndex = (page - 1) * limit;
                                            const endIndex = page * limit;
                                        
                                            const paginatedData = resultp.slice(startIndex, endIndex);
                                            const totalPages = Math.ceil(resultp.length / limit);

                                            return response.render('paiements/paiements', {
                                                factures : resultf,
                                                acomptes : resulta,
                                                paiements : paginatedData,
                                                p: resultp,
                                                ttc : resultttc,
                                                message : "le paiement a été créé",
                                                currentPage : page,
                                                totalPages
                                            
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

modifier_paiement(request,response)
{
    sql.query("update paiement set  montant ='"+request.body.montant+"' where id='"+request.body.id+"'", function (err, resultttc, fields) {
        if (err) 
        {
            console.log(err);
        }
        else{
            
            sql.query("SELECT p.id, p.date, p.montant, c.nom, c.prenom, f.id as id_facture from paiement p, client c, facture f, devis d where p.id_facture = f.id and c.id_client = d.id_client and d.id = f.id_devis ", function (err, resultp, fields) {
                if (err) 
                {
                    console.log(err);
                }
                else{
                    
                    sql.query("SELECT f.id, c.nom, c.prenom from facture f, client c, devis d where f.id_devis = d.id and c.id_client = d.id_client", function (err, resultf, fields) {
                        if (err) 
                        {
                            console.log(err);
                        }
                        else{
                            
                            sql.query("SELECT acompte, id from facture ", function (err, resulta, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }
                                else{
                                    
                                    sql.query("SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as ttc from  facture f, produit p, devis d, produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id group by f.id", function (err, resultttc, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }
                                        else{
                                            const page = parseInt(request.query.page) || 1;
                                            const limit = 10; // Rows per page
                                            const startIndex = (page - 1) * limit;
                                            const endIndex = page * limit;
                                        
                                            const paginatedData = resultp.slice(startIndex, endIndex);
                                            const totalPages = Math.ceil(resultp.length / limit);
                                            return response.render('paiements/paiements', {
                                                factures : resultf,
                                                acomptes : resulta,
                                                paiements : paginatedData,
                                                ttc : resultttc,
                                                message : "le paiement a été modifié",
                                                currentPage : page,
                                                totalPages
                                            
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}


    paiements(request,response)
    {
        sql.query("SELECT p.id, p.date, p.montant, c.nom, c.prenom, f.id as id_facture from paiement p, client c, facture f, devis d where p.id_facture = f.id and c.id_client = d.id_client and d.id = f.id_devis ", function (err, resultp, fields) {
            if (err) 
            {
                console.log(err);
            }
            else{
                
                sql.query("SELECT f.id, c.nom, c.prenom from facture f, client c, devis d where f.id_devis = d.id and c.id_client = d.id_client", function (err, resultf, fields) {
                    if (err) 
                    {
                        console.log(err);
                    }
                    else{
                        
                        sql.query("SELECT acompte, id from facture ", function (err, resulta, fields) {
                            if (err) 
                            {
                                console.log(err);
                            }
                            else{
                                
                                sql.query("SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as ttc from  facture f, produit p, devis d,  produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id  group by f.id", function (err, resultttc, fields) {
                                    if (err) 
                                    {
                                        console.log(err);
                                    }
                                    else{
                                        const page = parseInt(request.query.page) || 1;
                                        const limit = 10; // Rows per page
                                        const startIndex = (page - 1) * limit;
                                        const endIndex = page * limit;
                                    
                                        const paginatedData = resultp.slice(startIndex, endIndex);
                                        const totalPages = Math.ceil(resultp.length / limit);
                                        return response.render('paiements/paiements', {
                                            factures : resultf,
                                            acomptes : resulta,
                                            p : resultp,
                                            paiements : paginatedData,
                                            ttc : resultttc,
                                            currentPage : page,
                                            totalPages
                                        
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    one_paiement(request,response)
{
    if(request.session.connected==true)
        {
            var id = request.query.id;
sql.query("select f.date, f.id as id_facture, c.nom , c.prenom , d.id as id_devis  from client c, devis d,  facture f where c.id_client = d.id_client and d.id = f.id_devis  and f.id = '"+id+"'",(err,resd) =>{
    if(err)
    {
       console.log(err);
    }else{
        sql.query("select p.nom, p.prix , p.prix * 18/100 as val_tax , p.prix*p.pourcent_reduction_promo/100 as remise, pd.quantite  from produit p, produit_devis pd, facture f, devis d where p.id_produit = pd.id_produit and f.id_devis = d.id and pd.id_devis = d.id and f.id = '"+resd[0].id_facture+"'",(err,resp) =>{
            if(err)
            {
               console.log(err);
            }else{
             

                 

        response.render("paiements/one_paiement",
            {
                nom : request.session.nom,
                produits : resp,
                paiement : resd[0]
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


supprimer_annulation(request,response)
{
    if(request.session.connected==true)
        {
            var id = request.query.id;
            sql.query("update produit p, produit_annulation pa set p.qte_en_stock = p.qte_en_stock - pa.quantite where pa.id_produit = p.id_produit and pa.id_annulation = '"+id+"' ", function (err, result, fields) {
                if (err) 
                {
                    console.log(err);
                }
                else{
                    
                    sql.query("delete from produit_annulation where id_annulation = '"+id+"'",(err,resd) =>{
                        if(err)
                        {
                           console.log(err);
                        }else{
                            sql.query("delete from annulation where id = '"+id+"'",(err,resp) =>{
                                if(err)
                                {
                                   console.log(err);
                                }else{
                                 
                    
                                     
                    
                                    sql.query("SELECT a.date,a.id as id, c.id_client, c.nom, c.prenom , f.id as id_facture from annulation a,  facture f, devis d, client c where a.id_facture = f.id and  f.id_devis = d.id  and c.id_client = d.id_client ", function (err, result, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }
                                        else{
                                            
                                            sql.query("SELECT p.nom, pa.id_annulation, pa.quantite, pa.id_produit from produit p, produit_annulation pa where pa.id_produit = p.id_produit ", function (err, resultpa, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }
                                                else{
                                                    
                                                    sql.query("select f.id, c.nom, c.prenom from facture f, devis d, client c where   f.id_devis = d.id  and c.id_client = d.id_client ", function (err, resultf, fields) {
                                        if (err) 
                                        {
                                            console.log(err);
                                        }
                                        else{
                                            
                                            sql.query("SELECT p.id_produit , p.nom from produit p ", function (err, resultp, fields) {
                                                if (err) 
                                                {
                                                    console.log(err);
                                                }
                                                else{
                                                    
                                                    return response.render('paiements/annulations', {
                                                        annulations : result,
                                                        nom : request.session.nom,
                                                        factures : resultf,
                                                        produits : resultp,
                                                        pa : resultpa,
                                                        message : "l'annulation a été supprimée avec succès !"
                                                    });
                                                }
                                            })
                                        }
                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                        }
                            )}
                    })
                }
            })  

            

        }
        else
        {
            response.render("login");
        } 
}


modifier_annulation(request,response)
{
    if(request.session.connected==true)
        {
           if(request.body.produits == "" || request.body.produits== null)
           {
            var id = request.body.id;
            sql.query("select f.id as id_facture, a.id , c.nom, c.prenom from facture f, client c, devis d, annulation a where d.id_client = c.id_client and f.id_devis = d.id and a.id_facture = f.id and a.id = '"+id+"' ",(err,resa) =>{
                if(err)
                {
                   console.log(err)
                }else{
            
            
                    sql.query("select p.id_produit, p.nom from produit p ",(err,resp) =>{
                        if(err)
                        {
                           console.log(err)
                        }else{
                         
                            sql.query("select pa.quantite, p.nom from produit p, produit_annulation pa where p.id_produit = pa.id_produit and pa.id_annulation = '"+id+"'",(err,resp1) =>{
                                if(err)
                                {
                                   console.log(err)
                                }else{
                                    
                                    var str="";
                                    for(var i=0; i < resp1.length;i++)
                                    {
                                        str=str+"\n";
                                        str=str+resp1[i].quantite;
                                        str=str+" # ";
                                        str=str+resp1[i].nom+" | ";
                                    }
                                    sql.query("select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,res) =>{
                                        if(err)
                                        {
                                           console.log(err)
                                        }else{
                                            
                                           
                                            response.render("paiements/modifier_annulation_form",{
                                                factures : res,
                                                r_produits : resp,
                                                nom : request.session.nom,
                                                produits : str,
                                                annulation : resa[0],
                                                message : 'erreur : vous devez choisir des produits'
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                 
                   
                }
            })
           }
           else{
sql.query("update annulation set id_facture = '"+request.body.facture+"' where id = '"+request.body.id+"' ",(err,resan) =>{
    if(err)
    {
       console.log(err);
    }else{

        sql.query("update produit p , produit_annulation pa set p.qte_en_stock = p.qte_en_stock - pa.quantite where pa.id_annulation =  '"+request.body.id+"' ", function (err, result, fields) {
            if (err) 
            {
                console.log(err);
            }
            else{
                sql.query("delete from produit_annulation where  id_annulation = '"+request.body.id+"'",(err,resp) =>{
                    if(err)
                    {
                       console.log(err);
                 
                    }else{
                     
        
                         
        
                        var qte_produit = request.body.produits;
                        var qp = qte_produit.replaceAll("\n","").replaceAll("\r","").split(" | ");
                        
                         qp=qp.slice(0, -1);
             
                         for(var i=0; i< qp.length;i++)
                             {
                                 
                               this.f(request,response,qp[i],request.body.id);
                                 
                             } 
                             sql.query("SELECT a.date,a.id as id, c.id_client, c.nom, c.prenom , f.id as id_facture from annulation a,  facture f, devis d, client c where a.id_facture = f.id and  f.id_devis = d.id  and c.id_client = d.id_client ", function (err, result, fields) {
                                if (err) 
                                {
                                    console.log(err);
                                }
                                else{
                                    
                                    return response.render('paiements/annulations', {
                                        annulations : result,
                                        nom : request.session.nom,
                                        message : 'l\'annulation a été modifiée'
                                    });
                                }
                            })
                             
                    }
            }
                )
            }
        })



       
    
    }
})
               }    }
        else
        {
            response.render("login");
        } 
}


ajouter_annulation_form(request,response)
    {
        if(request.session.connected==true)
            {

               

    sql.query("select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,res) =>{
        if(err)
        {
           console.log(err)
        }else{


            sql.query("select p.id_produit, p.nom from produit p ",(err,resp) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    response.render("paiements/ajouter_annulation_form",{
                        factures : res,
                        r_produits : resp,
                        nom : request.session.nom
                    })
                }
            })
         
           
        }
    })
            }
            else
            {
                response.render("login");
            }
    }



    
modifier_annulation_form(request,response)
{
    if(request.session.connected==true)
        {
            var id = request.query.id;
sql.query("select f.id as id_facture, a.id , c.nom, c.prenom from facture f, client c, devis d, annulation a where d.id_client = c.id_client and f.id_devis = d.id and a.id_facture = f.id and a.id = '"+id+"' ",(err,resa) =>{
    if(err)
    {
       console.log(err)
    }else{


        sql.query("select p.id_produit, p.nom from produit p ",(err,resp) =>{
            if(err)
            {
               console.log(err)
            }else{
             
                sql.query("select pa.quantite, p.nom from produit p, produit_annulation pa where p.id_produit = pa.id_produit and pa.id_annulation = '"+id+"'",(err,resp1) =>{
                    if(err)
                    {
                       console.log(err)
                    }else{
                        
                        var str="";
                        for(var i=0; i < resp1.length;i++)
                        {
                            str=str+"\n";
                            str=str+resp1[i].quantite;
                            str=str+" # ";
                            str=str+resp1[i].nom+" | ";
                        }
                        sql.query("select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,res) =>{
                            if(err)
                            {
                               console.log(err)
                            }else{
                                
                               
                                response.render("paiements/modifier_annulation_form",{
                                    factures : res,
                                    r_produits : resp,
                                    nom : request.session.nom,
                                    produits : str,
                                    annulation : resa[0]
                                })
                            }
                        })
                    }
                })
            }
        })
     
       
    }
})
        }
        else
        {
            response.render("login");
        }
}


    ajouter_remboursement_form(request,response)
    {
        if(request.session.connected==true)
            {
    sql.query("select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,res) =>{
        if(err)
        {
           console.log(err)
        }else{
         
            response.render("paiements/ajouter_remboursement_form",{
                factures : res,
                nom : request.session.nom
            })
        }
    })
            }
            else
            {
                response.render("login");
            }
    }


    supprimer_remboursement(request,response)
    {
        if(request.session.connected==true)
            {
                var id = request.query.id;
    sql.query("delete from remboursement where id = '"+id+"' ",(err,resd) =>{
        if(err)
        {
           console.log(err)
        }else{
            sql.query("select r.id, r.date, r.montant, f.id as id_facture, c.nom, c.prenom from facture f, client c, devis d, remboursement r where d.id_client = c.id_client and f.id_devis = d.id and r.id_facture = f.id ",(err,res) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    sql.query(" select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,resf) =>{
                        if(err)
                        {
                           console.log(err)
                        }else{
                         
                            response.render("paiements/remboursements",{
                                remb : res,
                                nom : request.session.nom,
                                factures : resf,
                                message : "le remboursement a été supprimé!"
                            })
                        }
                    })
                }
            })
            
        }
    })
            }
            else
            {
                response.render("login");
            }
    }


    modifier_remboursement_form(request,response)
    {
        if(request.session.connected==true)
            {
    sql.query("select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,res) =>{
        if(err)
        {
           console.log(err)
        }else{
         var id = request.query.id;
            sql.query("select r.id, r.montant, f.id as id_facture, c.nom, c.prenom from facture f, client c, devis d, remboursement r where d.id_client = c.id_client and f.id_devis = d.id and r.id_facture = f.id and r.id = '"+id+"' ",(err,resr) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    response.render("paiements/modifier_remboursement_form",{
                        factures : res,
                        nom : request.session.nom,
                        remb : resr[0]
                    })
                }
            })
        }
    })
            }
            else
            {
                response.render("login");
            }
    }


    remboursements(request,response)
    {
        if(request.session.connected==true)
            {
    sql.query("select r.id, r.date, r.montant, f.id as id_facture, c.nom, c.prenom from facture f, client c, devis d, remboursement r where d.id_client = c.id_client and f.id_devis = d.id and r.id_facture = f.id ",(err,res) =>{
        if(err)
        {
           console.log(err)
        }else{
         
            sql.query(" select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,resf) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    response.render("paiements/remboursements",{
                        remb : res,
                        nom : request.session.nom,
                        factures : resf
                    })
                }
            })
        }
    })
            }
            else
            {
                response.render("login");
            }
    }

    ajouter_annulation(request,response)
    {
        if(request.session.connected==true)
            {
              
                    
                
    sql.query(" insert into annulation (date,id_facture) values('"+request.body.date+"','"+request.body.facture+"')",(err,res) =>{
        if(err)
        {
           console.log(err)
        }else{
         
           var qte_produit = "";

           for(var i=0;i<request.body.produit.length;i++)
           {
            var str ="\n";
            str = str + request.body.quantite[i]+" # "+request.body.produit[i]+" | ";
            qte_produit = qte_produit +str;
           }

           var qp = qte_produit.replaceAll("\n","").replaceAll("\r","").split(" | ");
           
            qp=qp.slice(0, -1);

            for(var i=0; i< qp.length;i++)
                {
                    
                  this.f(request,response,qp[i],res.insertId);
                    
                }  

                sql.query("SELECT a.date,a.id as id, c.id_client, c.nom, c.prenom , f.id as id_facture from annulation a,  facture f, devis d, client c where a.id_facture = f.id and  f.id_devis = d.id  and c.id_client = d.id_client ", function (err, result, fields) {
                    if (err) 
                    {
                        console.log(err);
                    }
                    else{
                        
                        sql.query("SELECT p.nom, pa.id_annulation, pa.quantite, pa.id_produit from produit p, produit_annulation pa where pa.id_produit = p.id_produit ", function (err, resultpa, fields) {
                            if (err) 
                            {
                                console.log(err);
                            }
                            else{
                                
                                sql.query("select f.id, c.nom, c.prenom from facture f, devis d, client c where   f.id_devis = d.id  and c.id_client = d.id_client ", function (err, resultf, fields) {
                    if (err) 
                    {
                        console.log(err);
                    }
                    else{
                        
                        sql.query("SELECT p.id_produit , p.nom from produit p ", function (err, resultp, fields) {
                            if (err) 
                            {
                                console.log(err);
                            }
                            else{
                                
                                return response.render('paiements/annulations', {
                                    annulations : result,
                                    nom : request.session.nom,
                                    factures : resultf,
                                    produits : resultp,
                                    pa : resultpa,
                                    message : "l'annulation a été créé avec succès !"
                                });
                            }
                        })
                    }
                })
                            }
                        })
                    }
                })
            
        }
                            })
                        

            }
            else
            {
                response.render("login");
            }
    }

    f(request,response,qp,id_annulation)
    {
        var qte = qp.split(" # ")[0];
        var nom = qp.split(" # ")[1];
       sql.query("select id_produit as id from produit where nom = '"+nom.trim()+"'",(err,resp) =>{
            if(err)
            {
                console.log(err);
    
               
                return;
            }else{
            
             
              
                     
                       
                    
                                sql.query("insert into produit_annulation (id_produit,id_annulation,quantite) values ('"+resp[0].id+"','"+id_annulation+"','"+qte+"') ",(err,resd) =>{
                                    if(err)
                                    {
                   console.log(err);
                   return ;
                                    
                                        return;
                                    }else{
                                     
                                        sql.query(" update produit set qte_en_stock = qte_en_stock  + '"+qte+"' where id_produit = '"+resp[0].id+"' ",(err,resd1) =>{
                                            if(err)
                                            {
                           console.log(err);
                           return ;
                                            
                                                return;
                                            }else{
                                             
                                             
                                                
                                            }
                                        })
                                        
                                    }
                                })
                         
                                
                        
                
                
            }
        })
             
    
    }

ajouter_remboursement(request,response)
    {
        if(request.session.connected==true)
            {
                
    sql.query(" insert into remboursement (date,id_facture,montant) values('"+request.body.date+"','"+request.body.facture+"','"+request.body.montant+"')",(err,res) =>{
        if(err)
        {
           console.log(err)
        }else{
         
            sql.query("select r.id, r.date, r.montant, f.id as id_facture, c.nom, c.prenom from facture f, client c, devis d, remboursement r where d.id_client = c.id_client and f.id_devis = d.id and r.id_facture = f.id ",(err,res) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    sql.query(" select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,resf) =>{
                        if(err)
                        {
                           console.log(err)
                        }else{
                         
                            response.render("paiements/remboursements",{
                                remb : res,
                                nom : request.session.nom,
                                factures : resf,
                                message : "le remboursement a été créé avec succès !"
                            })
                        }
                    })
                }
            })
        }
    })
            }
            else
            {
                response.render("login");
            }
    }


    modifier_remboursement(request,response)
    {
        if(request.session.connected==true)
            {
                
    sql.query(" update remboursement set montant = '"+request.body.montant+"', id_facture ='"+request.body.facture+"' where id = '"+request.body.id+"'",(err,res) =>{
        if(err)
        {
           console.log(err)
        }else{
         
            sql.query("select r.id, r.date, r.montant, f.id as id_facture, c.nom, c.prenom from facture f, client c, devis d, remboursement r where d.id_client = c.id_client and f.id_devis = d.id and r.id_facture = f.id ",(err,res) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    sql.query(" select f.id, c.nom, c.prenom from facture f, client c, devis d where d.id_client = c.id_client and f.id_devis = d.id ",(err,resf) =>{
                        if(err)
                        {
                           console.log(err)
                        }else{
                         
                            response.render("paiements/remboursements",{
                                remb : res,
                                nom : request.session.nom,
                                factures : resf,
                                message : "le remboursement a été modifié avec succès!"
                            })
                        }
                    })
                }
            })
        }
    })
            }
            else
            {
                response.render("login");
            }
    }


    annulations(request,response)
{
    if(request.session.connected==true)
        {
    
    sql.query("SELECT a.date,a.id as id, c.id_client, c.nom, c.prenom , f.id as id_facture from annulation a,  facture f, devis d, client c where a.id_facture = f.id and  f.id_devis = d.id  and c.id_client = d.id_client ", function (err, result, fields) {
        if (err) 
        {
            console.log(err);
        }
        else{
            
            sql.query("SELECT p.nom, pa.id_annulation, pa.quantite, pa.id_produit from produit p, produit_annulation pa where pa.id_produit = p.id_produit ", function (err, resultpa, fields) {
                if (err) 
                {
                    console.log(err);
                }
                else{
                    
                    sql.query("select f.id, c.nom, c.prenom from facture f, devis d, client c where   f.id_devis = d.id  and c.id_client = d.id_client ", function (err, resultf, fields) {
        if (err) 
        {
            console.log(err);
        }
        else{
            
            sql.query("SELECT p.id_produit , p.nom from produit p ", function (err, resultp, fields) {
                if (err) 
                {
                    console.log(err);
                }
                else{
                    
                    return response.render('paiements/annulations', {
                        annulations : result,
                        nom : request.session.nom,
                        factures : resultf,
                        produits : resultp,
                        pa : resultpa
                    });
                }
            })
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

}




const c = new controller();

module.exports= c;

const sql = require("./../Database/db.js");

class controller{

    constructor(){}

    creation_form(request,response)
    {
        if(request.session.connected==true){
sql.query("select nom from produit", function (err, result, fields) {
        if (err) {
            console.log(err)
            return response.render('ajouter_commande_form', {
                message: 'il y a eu une erreur, ressayer plutard!',
                nom : request.session.nom
            })
        }else{

            return response.render('ajouter_commande_form', {
                produits :result,
                nom : request.session.nom
            }) 


            
        }
        
      });
    }else{
        response.render("login")
    }
    }


    ajouter_commande(request,response)
    {
        if(request.session.connected==true){
       
            var etat = "non livré";
            sql.query("insert into commande (date,etat,montant,id_fournisseur) values('"+request.body.date+"','"+etat+"','"+request.body.montant+"','"+request.body.id_fournisseur+"' )", function (err, resultc, fields) {
                if (err) {
                    console.log(err)
                   
                }else{
        for(var i=0;i<request.body.produit.length;i++)
        {
            sql.query("insert into produit_commande (id_produit, id_commande, quantite) values('"+request.body.produit[i]+"','"+resultc.insertId+"','"+request.body.quantite[i]+"')", function (err, result, fields) {
                if (err) {
                    console.log(err)
                   
                }else{
        
                    
        
        
                    
                }
                
              });
        }
                    sql.query("select c.etat, c.date, c.id, c.montant, f.id as id_fournisseur, f.nom  from commande c, fournisseur f where c.id_fournisseur = f.id  ", function (err, resultc, fields) {
                        if (err) {
                            console.log(err)
                           
                        }else{
                
                            sql.query("select p.nom, p.id_produit from produit p ", function (err, resultp1, fields) {
                        if (err) {
                            console.log(err)
                           
                        }else{
                
                            sql.query("select p.nom, p.id_produit,pc.id_commande, pc.quantite from produit p, produit_commande pc where pc.id_produit = p.id_produit ", function (err, resultpc, fields) {
                                if (err) {
                                    console.log(err)
                                   
                                }else{
                        
                                    sql.query("select id, nom from fournisseur ", function (err, resultf, fields) {
                                        if (err) {
                                            console.log(err)
                                           
                                        }else{
                                
                                            return response.render('all_commandes', {
                                                commande :resultc,
                                                nom : request.session.nom,
                                                produits : resultp1,
                                                message : "la commande a été créée avec succès!",
                                                pc : resultpc,
                                                fournisseurs: resultf
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
        }else{
            response.render("login")
        }
    }

}

coc = new controller();
module.exports=coc;
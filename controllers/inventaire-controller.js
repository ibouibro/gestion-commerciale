const sql = require("./../Database/db.js");
const moment = require('moment');

class controller{

    constructor(){}

    inventaires(request,response)
    {
        if(request.session.connected==true)
            {
                
                       
                return response.render("inventaire/inventaires",{
                    
                    nom : request.session.nom
                    
                })
            }
            else
            {
              return  response.render("login");
            } 
    }


    afficher_inventaire(request,response)
    {
        if(request.session.connected==true)
        {

            sql.query("select nom, id_produit from produit",(err,resp) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    sql.query("select sum (pc.quantite) as c , pc.id_produit from produit_commande pc, commande c where c.id = pc.id_commande and pc.id_commande in (select id_commande from livraison) and c.date between '"+request.body.debut+"' and '"+request.body.fin+"'   group by pc.id_produit",(err,rese) =>{
                        if(err)
                        {
                           console.log(err)
                        }else{
                         
                            sql.query("select sum(pd.quantite) as c , pd.id_produit from produit_devis pd,facture f, devis d where pd.id_devis = d.id and f.id_devis = d.id and f.date between '"+request.body.debut+"' and '"+request.body.fin+"' group by pd.id_produit",(err,ress) =>{
                                if(err)
                                {
                                   console.log(err)
                                }else{
                                 
                                   return response.render("inventaire/inventaires",{
                                        produits : resp,
                                        nom : request.session.nom,
                                        entree : rese,
                                        sortie : ress,
                                       debut: request.body.debut,
                                       fin: request.body.fin
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

   



    supprimer_inventaire(request,response)
    {
        if(request.session.connected==true)
            {
                var id = request.query.id;
    sql.query("delete from inventaire_produit where id_inventaire = '"+id+"' ",(err,res) =>{
        if(err)
        {
           console.log(err)
        }else{
         
           
    
            sql.query("delete from inventaire where id = '"+id+"' ",(err,res) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                    sql.query("select nom, id_produit from produit",(err,resp) =>{
                        if(err)
                        {
                           console.log(err)
                        }else{
                         
                            sql.query("select i. date, ip.id_inventaire, p.nom, ip.stock_theorique as theorique, ip.stock_restant as reel from produit p, inventaire_produit ip, inventaire i where ip.id_produit = p.id_produit and i.id = ip.id_inventaire ",(err,resi) =>{
                                if(err)
                                {
                                   console.log(err)
                                }else{
                                 
                                    sql.query("select * from inventaire ",(err,result) =>{
                                        if(err)
                                        {
                                           console.log(err)
                                        }else{
                                         
                                           return response.render("inventaire/inventaires",{
                                                inventaires : result,
                                                nom : request.session.nom,
                                                produits : resp,
                                                inv : resi,
                                                message : "l\'inventaire a été supprimé"
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
    })
            }
            else
            {
              return  response.render("login");
            } 
    }


    ajouter_inventaire(request,response)
    {
        if(request.session.connected==true)
        {

            sql.query("insert into inventaire (date) values('"+request.body.date+"')",(err,resi) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 
                  
                    var str = "";

                    for(var i=0;i<request.body.produit.length;i++)
                    {
                        var s="\n";
                        s=s+request.body.quantite[i]+" # "+request.body.produit[i]+" | ";
                        str=str+s;
                    }

                    var qp = str.replaceAll("\n","").replaceAll("\r","").split(" | ");
                 
                    qp=qp.slice(0, -1);
                    
        for(var i=0; i< qp.length;i++)
        {
            
          this.f(request,response,qp[i],resi.insertId);
            
        }  
        
        sql.query("select nom, id_produit from produit",(err,resp) =>{
            if(err)
            {
               console.log(err)
            }else{
             
                sql.query("select i. date, ip.id_inventaire, p.nom, ip.stock_theorique as theorique, ip.stock_restant as reel from produit p, inventaire_produit ip, inventaire i where ip.id_produit = p.id_produit and i.id = ip.id_inventaire ",(err,resi) =>{
                    if(err)
                    {
                       console.log(err)
                    }else{
                     
                        sql.query("select * from inventaire ",(err,result) =>{
                            if(err)
                            {
                               console.log(err)
                            }else{
                             
                               return response.render("inventaire/inventaires",{
                                    inventaires : result,
                                    nom : request.session.nom,
                                    produits : resp,
                                    inv : resi,
                                    message : "l\'inventaire a été créé avec succès! "
                                })
                        
                            
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

    f(request,response,qp,id_inventaire)
{
    var qte = qp.split(" # ")[0];
    var nom = qp.split(" # ")[1];
   sql.query("select id_produit as id, qte_en_stock from produit where nom = '"+nom.trim()+"'",(err,resp) =>{
        if(err)
        {
            console.log(err);

           
            return;
        }else{
        
         
          
                 
                   
                         console.log(resp[0])
                            sql.query("insert into inventaire_produit  (id_produit,id_inventaire,stock_restant, stock_theorique) values ('"+resp[0].id+"','"+id_inventaire+"','"+qte+"','"+resp[0].qte_en_stock+"')  ",(err,resd) =>{
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

}

c = new controller();
module.exports=c;
const sql = require("./../Database/db.js");


class controller{

    constructor(){}


    create_form(request,response)
    {
        if(request.session.connected==true)
        {
            var et = "non livré";
sql.query("select c.id, f.nom from commande c, fournisseur f, produit p where p.id_fournisseur = f.id and p.id_produit = c.id_produit and etat = '"+et+"' ",(err,res) =>{
    if(err)
    {
        response.render("livraison/ajouter_livraison_form",{
            message : 'il y a eu une erreur, réessayez  plutard !',
            nom : request.session.nom
        })
    }else{
        response.render("livraison/ajouter_livraison_form",{
            commandes : res,
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

    ajouter_livraison(request,response,id)
    {
        if(request.session.connected==true)
            {

                sql.query("insert into livraison (date,id_commande) values ('"+request.body.date+"','"+id+"')  ",(err,res) =>{
                    if(err)
                    {
                        console.log(err);
                    }else{
                        sql.query("select id_produit, quantite from produit_commande where id_commande = '"+id+"' ",(err,respc) =>{
                            if(err)
                            {
                               console.log(err);
                            }else{
                                for(var i=0; i< respc.length;i++)
                                {
                                    sql.query("update produit  set qte_en_stock = '"+respc[i].quantite+"' + qte_en_stock where id_produit = '"+respc[i].id_produit+"' ",(err,res1) =>{
                                        if(err)
                                        {
                                           console.log(err);
                                        }else{
                                            
                                        }
                                    })
                                }
                                

                                var etat = "livré";
                                        sql.query("update commande c set etat = '"+etat+"' where id = '"+id+"' ",(err,res1) =>{
                                            if(err)
                                            {
                                                console.log(err);
                                            }else{
                                                sql.query("select l.date, l.id, l.id_commande, f.nom as nom_f from commande c, livraison l , fournisseur f where l.id_commande = c.id  and f.id = c.id_fournisseur",(err,res) =>{
                                                    if(err)
                                                    {
                                                        console.log(err);
                                                    }else{
                                                        var etat ="non livré";
                                                        sql.query("select c.id, f.nom from commande c, fournisseur f where c.id_fournisseur = f.id  and  c.etat = '"+etat+"' ",(err,resc) =>{
                                                            if(err)
                                                            {
                                                                console.log(err);
                                                            }else{
                                                             
                                                                response.render("livraison/livraisons",{
                                                                    livraisons : res,
                                                                    nom : request.session.nom,
                                                                    commandes : resc,
                                                                    message : "la livraison a été créée !"
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
                response.render("login");
            }
    }


    ajouter_livraison1(request,response,id)
    {
        if(request.session.connected==true)
            {

                sql.query("select * from livraison where id_commande = '"+id+"' ",(err,resl) =>{
                    if(err)
                    {
                        response.render("one_commande",{
                            message : 'il y a eu une erreur, réessayez  plutard !',
                            nom : request.session.nom
                        })
                    }else{
                        if(resl.length > 0)
                        {
                            response.render("one_commande",{
                                message : 'la livraison a déjà été enregistrée !',
                                nom : request.session.nom
                            })
                        }else
                        {

                            var datetime = new Date().toLocaleDateString();
                            sql.query("insert into livraison (date,id_commande) values ('"+datetime+"','"+id+"')  ",(err,res) =>{
                                if(err)
                                {
                                    response.render("one_commande",{
                                        message : 'il y a eu une erreur, réessayez  plutard !',
                                        nom : request.session.nom
                                    })
                                }else{
                                    sql.query("select quantite from commande where id = '"+id+"' ",(err,res1) =>{
                                        if(err)
                                        {
                                            response.render("one_commande",{
                                                message : 'il y a eu une erreur, réessayez  plutard !',
                                                nom : request.session.nom
                                            })
                                        }else{
                                            sql.query("update produit p, commande c set qte_en_stock = '"+res1[0].quantite+"' + qte_en_stock where p.id_produit = c.id_produit and c.id = '"+id+"' ",(err,res1) =>{
                                                if(err)
                                                {
                                                    response.render("one_commande",{
                                                        message : 'il y a eu une erreur, réessayez  plutard !',
                                                        nom : request.session.nom
                                                    })
                                                }else{
                                                    var etat = "livré";
                                                    sql.query("update commande c set etat = '"+etat+"' where id = '"+id+"' ",(err,res1) =>{
                                                        if(err)
                                                        {
                                                            response.render("one_commande",{
                                                                message : 'il y a eu une erreur, réessayez  plutard !',
                                                                nom : request.session.nom
                                                            })
                                                        }else{
                                                            response.render("one_commande",{
                                                                message : 'la livraison a été créée !',
                                                                nom : request.session.nom
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
                    }
                })



           
            }
            else
            {
                response.render("login");
            }
    }



    livraisons(request,response)
    {
        if(request.session.connected==true)
            {
    sql.query("select l.date, l.id, l.id_commande, f.nom as nom_f from commande c, livraison l , fournisseur f where l.id_commande = c.id  and f.id = c.id_fournisseur",(err,res) =>{
        if(err)
        {
            console.log(err);
        }else{
            var etat ="non livré";
            sql.query("select c.id, f.nom from commande c, fournisseur f where c.id_fournisseur = f.id  and  c.etat = '"+etat+"' ",(err,resc) =>{
                if(err)
                {
                    console.log(err);
                }else{
                 
                    response.render("livraison/livraisons",{
                        livraisons : res,
                        nom : request.session.nom,
                        commandes : resc
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


    supprimer_livraison(request,response)
    {
        if(request.session.connected==true)
            {
                
                        var etat = "non livré";
                        var id1 = request.query.id;
                        
                        sql.query("update commande c, livraison l set c.etat = '"+etat+"' where c.id = l.id_commande and l.id = '"+id1+"' ",(err,resl) =>{
                            if(err)
                            {
                                console.log(err);
                            }else{
                             var id2 = request.query.id;
                                sql.query("update produit p, commande c, livraison l, produit_commande pc set p.qte_en_stock = p.qte_en_stock - pc.quantite where p.id_produit = pc.id_produit and pc.id_commande = c.id and l.id_commande = c.id and l.id = '"+id2+"' ",(err,resl2) =>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }else{
                                     
                                        var id = request.query.id;
                                        sql.query("delete from livraison where id = '"+id+"'",(err,resl) =>{
                                            if(err)
                                            {
                                               console.log(err);
                                            }else{

                                                sql.query("select l.date, l.id, l.id_commande, f.nom as nom_f from commande c, livraison l , fournisseur f where l.id_commande = c.id  and f.id = c.id_fournisseur",(err,res) =>{
                                                    if(err)
                                                    {
                                                        console.log(err);
                                                    }else{
                                                        var etat ="non livré";
                                                        sql.query("select c.id, f.nom from commande c, fournisseur f where c.id_fournisseur = f.id  and  c.etat = '"+etat+"' ",(err,resc) =>{
                                                            if(err)
                                                            {
                                                                console.log(err);
                                                            }else{
                                                             
                                                                response.render("livraison/livraisons",{
                                                                    livraisons : res,
                                                                    nom : request.session.nom,
                                                                    commandes : resc,
                                                                    message : "la livraison a été supprimée"
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
                response.render("login");
            }
    }



    modifier_livraison_form(request,response)
    {
        if(request.session.connected==true)
            {
                var id = request.query.id;
    sql.query("select l.id as id,f.nom, c.id as id_commande from livraison l, commande c, fournisseur f, produit p where c.id = l.id_commande and f.id = p.id_fournisseur and p.id_produit = c.id_produit   and l.id ='"+id+"'",(err,resl) =>{
        if(err)
        {
            response.render("livraison/modifier_livraison_form",{
                message : 'il y a eu une erreur, réessayez  plutard !',
                nom : request.session.nom
            })
        }else{
         var etat ="non livré";
            sql.query("select c.id, f.nom from commande c, fournisseur f, produit p where c.id_produit = p.id_produit and p.id_fournisseur = f.id and  c.etat = '"+etat+"'",(err,resc) =>{
                if(err)
                {
                    response.render("livraison/modifier_livraison_form",{
                        message : 'il y a eu une erreur, réessayez  plutard !',
                        nom : request.session.nom
                    })
                }else{
                 
                    response.render("livraison/modifier_livraison_form",{
                        livraison : resl[0],
                        commandes : resc,
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


    one_livraison(request,response)
    {
        if(request.session.connected==true)
            {
                var id = request.query.id;
    sql.query("select l.date, l.id, c.quantite, f.nom as nom_p , p.nom as nom_f  from commande c, livraison l , produit p , fournisseur f where l.id_commande = c.id and p.id_produit = c.id_produit and f.id = p.id_fournisseur and l.id='"+id+"'",(err,res) =>{
        if(err)
        {
            response.render("livraison/one_livraison",{
                message : 'il y a eu une erreur, réessayez  plutard !',
                nom : request.session.nom
            })
        }else{
         
            response.render("livraison/one_livraison",{
                livraison : res[0],
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


    modifier_livraison(request,response,id_commande,id_livraison,a_id_commande)
    {
        if(request.session.connected==true)
            {
              
    sql.query("update livraison set id_commande =  '"+id_commande+"' where id = '"+id_livraison+"'",(err,res) =>{
        if(err)
        {
            console.log(err);
        }else{
         var etat = "livré";
            sql.query("update commande set etat ='"+etat+"' where id = '"+id_commande+"'",(err,res_c1) =>{
                if(err)
                {
                   console.log(err);
                }else{
                 
                    var etat1 = "non livré";
                    sql.query("update commande set etat ='"+etat1+"' where id = '"+a_id_commande+"'",(err,res_c1) =>{
                        if(err)
                        {
                            console.log(err);
                        }else{
                            sql.query("update produit p, produit_commande pc set p.qte_en_stock = p.qte_en_stock + pc.quantite where pc.id_produit = p.id_produit and pc.id_commande = '"+id_commande+"'",(err,res_c1) =>{
                                if(err)
                                {
                                    console.log(err);
                                }else{
                                    sql.query("update produit p, produit_commande pc set p.qte_en_stock = p.qte_en_stock - pc.quantite where p.id_produit = pc.id_produit and pc.id_commande = '"+a_id_commande+"'",(err,res_c1) =>{
                                        if(err)
                                        {
                                            console.log(err);
                                        }else{
                                            
                                            sql.query("select l.date, l.id, l.id_commande, f.nom as nom_f from commande c, livraison l , fournisseur f where l.id_commande = c.id  and f.id = c.id_fournisseur",(err,res) =>{
                                                if(err)
                                                {
                                                    console.log(err);
                                                }else{
                                                    var etat ="non livré";
                                                    sql.query("select c.id, f.nom from commande c, fournisseur f where c.id_fournisseur = f.id  and  c.etat = '"+etat+"' ",(err,resc) =>{
                                                        if(err)
                                                        {
                                                            console.log(err);
                                                        }else{
                                                         
                                                            response.render("livraison/livraisons",{
                                                                livraisons : res,
                                                                nom : request.session.nom,
                                                                commandes : resc,
                                                                message : "la livraison a été modifiée avec succès !"
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
            })
        }
    })

            }
            else
            {
                response.render("login");
            }
    }



    histo_livraison(request,response)
    {
        if(request.session.connected==true)
            {
                var id = request.query.id;
    sql.query("select l.date, l.id, f.nom as nom_f,c.montant  from commande c, livraison l , fournisseur f where l.id_commande = c.id   and f.id = c.id_fournisseur and f.id = '"+id+"' ",(err,res) =>{
        if(err)
        {
            response.render("livraison/histo_livraisons",{
                message : 'il y a eu une erreur, réessayez  plutard !',
                nom : request.session.nom
            })
        }else{
            console.log(res)
            response.render("livraison/histo_livraisons",{
                livraisons : res,
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


}

c = new controller();
module.exports=c;
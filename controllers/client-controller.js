const sql = require("./../Database/db.js");
const moment = require('moment');

class controller{

    constructor(){}


getClients(request,response)
{

    sql.query("SELECT * FROM clients", function (err, result, fields) {
        if (err) 
            
        {
            console.log(err);
            return;
        }else{
            return result;
        }
        
            
        
        
      });

    


}


histo_achat(request,response)
{
    if(request.session.connected==true)
    {
    var id = request.query.id;
    sql.query("SELECT f.date, c.id_client,c.nom, c.prenom , d.id as id_devis, f.id as id from client c,  facture f, devis d where  f.id_devis = d.id and c.id_client = d.id_client and d.id_client = '"+id+"' ", function (err, result, fields) {
        if (err) 
        {
            console.log(err)
        }
        else{
            sql.query(" select p.date, p.montant, p.id, p.id_facture from paiement p, facture f, devis d where d.id = f.id_devis and p.id_facture = f.id and d.id_client = '"+id+"' ", function (err, resultp, fields) {
                if (err) 
                {
                    console.log(err)
                }
                else{
                    return response.render('histo_achat', {
                        achat : result,
                        nom : request.session.nom,
                        paiements : resultp
                    });
                }
            })  
        }
    })  
}else{
    response.render("login");
}
            
}

histo_remb(request,response)
{
    if(request.session.connected==true)
        {
    var id = request.query.id;
    sql.query("SELECT r.date,r.id, r.montant, c.id_client, c.nom, c.prenom ,f.id as id_facture from remboursement r,  facture f, devis d, client c where  f.id_devis = d.id and r.id_facture = f.id and c.id_client = d.id_client and d.id_client = '"+id+"' ", function (err, result, fields) {
        if (err) 
        {
            console.log(err)
        }
        else{
            return response.render('histo_remb', {
                remb : result,
                nom : request.session.nom
            });
        }
    })  
}else{
    response.render("login");
}     
}


one_annulation(request,response)
{
    if(request.session.connected==true)
        {
    var id = request.query.id;
    sql.query("SELECT  c.nom, c.prenom, a.id, a.date from annulation a, facture f, devis d, client c where a.id_facture = f.id and f.id_devis = d.id and c.id_client = d.id_client and a.id = '"+id+"' ", function (err, result, fields) {
        if (err) 
        {
            console.log(err)
        }
        else{
           
           sql.query(" select p.nom, pa.quantite from produit p, produit_annulation pa where p.id_produit = pa.id_produit and pa.id_annulation = '"+id+"' ", function (err, resultp, fields) {
        if (err) 
        {
            console.log(err)
        }
        else{
            return response.render('one_annulation', {
                annulation : result[0],
                produits : resultp,
                nom : request.session.nom
            });
        }
    })  
        }
    })  
}else{
    response.render("login");
}     
}


histo_annulation(request,response)
{
    if(request.session.connected==true)
        {
    var id = request.query.id;
    sql.query("SELECT a.date,a.id as id, c.id_client, c.nom, c.prenom , f.id as id_facture from annulation a,  facture f, devis d, client c where a.id_facture = f.id and  f.id_devis = d.id  and c.id_client = d.id_client and d.id_client = '"+id+"' ", function (err, result, fields) {
        if (err) 
        {
            console.log(err);
        }
        else{
            
            sql.query("select ap.quantite, p.nom, ap.id_annulation from produit p, produit_annulation ap where p.id_produit = ap.id_produit ", function (err, resultap, fields) {
                if (err) 
                {
                    console.log(err);
                }
                else{
                    
                    return response.render('histo_annulation', {
                        annulations : result,
                        nom : request.session.nom,
                        ap : resultap
                    });
                }
            }) 
        }
    })  
        }else{
            response.render("login");
        }   
}


enregistrerClient(request,response,email,nom,adresse, prenom,tel)
{
    
    if(email==null || email== "")
    {
        sql.query("insert into client (nom,prenom,tel,adresse,email) values ('"+nom.trim()+"','"+prenom.trim()+"','"+tel.trim()+"','"+adresse.trim()+"','"+email.trim()+"')",(error,result) => {
            if(error)
            {
            console.log(error);
            
            }
            else{
                sql.query("SELECT count(f.id) as c1, c.id_client from facture f, client c, devis d  where c.id_client = d.id_client and f.id_devis = d.id  group by c.id_client", function (err, resulta, fields) {
                    if (err) {
                        console.log(err)
                       
                    }else{
                        
                        sql.query("SELECT count(r.id) as c1, c.id_client FROM remboursement r, facture f, devis d, client c where r.id_facture = f.id and f.id_devis = d.id  and c.id_client = d.id_client group by c.id_client", function (err, resultr, fields) {
                            if (err) {
                                console.log(err)
                               
                            }else{
                                sql.query("SELECT count(a.id) as c1, c.id_client FROM annulation a, client c, facture f , devis d where c.id_client = d.id_client and f.id_devis = d.id and a.id_facture = f.id group by c.id_client ", function (err, resultan, fields) {
                                    if (err) {
                                        console.log(err)
                                       
                                    }else{
                                        
                                        sql.query("SELECT * FROM client ", function (err, result, fields) {
                                            if (err) {
                                                console.log(err)
                                               
                                            }else{
                                                console.log(resulta[0].c)
                                                return response.render('clients', {
                                                    nom: request.session.nom,
                                                    r_client: result,
                                                    nbre_achat: resulta,
                                                    nbre_remb : resultr,
                                                    nbre_annulation: resultan,
                                                    r_message : "le client a été ajouté avec succès!"
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
    
    
        })
    }else{
    sql.query("select * from client where email='"+email.trim()+"'", (err,res) =>{
        if(err)
        {
            console.log(err);
           
        }else
        if(res.length>=1)
        {
            sql.query("select * from client ",(error,resultc) => {
                if(error)
                {
                console.log(error);
                
                }
                else{
                    return response.render('clients', {
                        r_message: 'cet email a déjà un compte',
                        r_nom :request.session.nom,
                        r_client : resultc
                    })
                }
        
        
            })
        }else{
    

    sql.query("insert into client (nom,prenom,tel,adresse,email) values ('"+nom.trim()+"','"+prenom.trim()+"','"+tel.trim()+"','"+adresse.trim()+"','"+email.trim()+"')",(error,result) => {
        if(error)
        {
        console.log(error);
        
        }
        else{
            sql.query("select * from client ",(error,resultc) => {
                if(error)
                {
                console.log(error);
                
                }
                else{
                    return response.render('clients', {
                        r_message: 'le client a été ajouté avec succès',
                        r_nom :request.session.nom,
                        r_client : resultc
                    })
                }
        
        
            })
        }


    })
}
})
    }

}

}

c = new controller();
module.exports=c;
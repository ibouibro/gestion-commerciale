var express = require("express");
var app = express()
const path = require("path")
const lc = require("./controllers/login-controller");
const lc1 = require("./controllers/livraison-controller");
const fc = require("./controllers/facture-controller");
const cc = require("./controllers/client-controller");
const coc = require("./controllers/commande-controller");
const dc = require("./controllers/devis-controller");
const pc = require("./controllers/paiement-controller");
const ic = require("./controllers/inventaire-controller");
const dc1 = require("./controllers/depense-controller");
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

const nocache = require("nocache");
const sql = require("./Database/db.js");
app.use(nocache());

app.use(cookieParser());
app.use( express.static( "controllers/public/" ) );
 
app.use(session({
    secret: "ibrahima",
    saveUninitialized: false,
    resave: false
}));




app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.listen(3000);

app.get("/",function(request,response)
{
    response.render("login");
});

app.get("/ajouter-utilisateur-form",function(request,response)
{
    
    if(request.session.connected==false || request.session.connected==null)
        {
            response.render("login");
        }else{
            return response.render('ajouter-utilisateur-form', {
                nom: request.session.nom
            })
        }

    
});




app.post("/ajouter_utilisateur",function(request,response)
{
    lc.register(request,response,request.body.email,request.body.password,request.body.nom,request.body.prenom);
  
})

app.post("/login",function(request,res)
{
    lc.verifyLogin(request,res,request.body.email,request.body.password);

});

app.post("/ajouter_client",function(request,res)
{
    
    cc.enregistrerClient(request,res,request.body.email,request.body.nom,request.body.adresse,request.body.prenom,request.body.tel,request.body.sexe);

});

app.get("/connexion",function(request,response)
{
    response.render("login");
});

app.get("/ajout-client-form",function(request,response)
{
    
    if(request.session.connected==false || request.session.connected==null)
        {
            response.render("login");
        }else{
            return response.render('ajout-client-form', {
                nom: request.session.nom
            })
        }
});

app.get("/clients",function(request,response)
{
    if(request.session.connected==true){
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

                                        const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result.length / limit);

                                        return response.render('clients', {
                                            nom: request.session.nom,
                                            r_client: paginatedData,
                                            nbre_achat: resulta,
                                            nbre_remb : resultr,
                                            nbre_annulation: resultan,
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
    }else{
        response.render("login");
    }
});

app.get("/deconnecter",function(request,response)
{
    request.session.connected=false
    request.session.nom=null
    response.render("login");
});

app.get("/histo_achat",function(request,response)
{
    cc.histo_achat(request,response);
});

app.get("/histo_remb",function(request,response)
{
    cc.histo_remb(request,response);
});

app.get("/histo_annulation",function(request,response)
{
    cc.histo_annulation(request,response);
});

app.get("/one_achat",function(request,response)
{
    pc.one_paiement(request,response);
});
app.get("/ajouter_annulation_form",function(request,response)
{
    pc.ajouter_annulation_form(request,response);
});

app.get("/modifier_annulation_form",function(request,response)
{
    pc.modifier_annulation_form(request,response);
});
app.post("/ajouter_annulation",function(request,response)
{
    pc.ajouter_annulation(request,response);
});

app.post("/modifier_annulation",function(request,response)
{
    pc.modifier_annulation(request,response);
});

app.post("/afficher_rapport",function(request,response)
{
    fc.rapport_caisse(request,response);
});

app.get("/rapport_caisse",function(request,response)
{
    fc.rapport_caisse(request,response);
});

app.get("/inventaires",function(request,response)
{
    ic.inventaires(request,response);
});

app.post("/ajouter_inventaire",function(request,response)
{
    ic.ajouter_inventaire(request,response);
});

app.get("/supprimer_inventaire",function(request,response)
{
    ic.supprimer_inventaire(request,response);
});

app.get("/one_inventaire",function(request,response)
{
    ic.one_inventaire(request,response);
});

app.get("/ajouter_inventaire_form",function(request,response)
{
    ic.ajouter_inventaire_form(request,response);
});

app.get("/ajouter_remboursement_form",function(request,response)
{
    pc.ajouter_remboursement_form(request,response);
});

app.get("/remboursements",function(request,response)
{
    pc.remboursements(request,response);
});

app.get("/modifier_remboursement_form",function(request,response)
{
    pc.modifier_remboursement_form(request,response);
});

app.post("/modifier_remboursement",function(request,response)
{
    pc.modifier_remboursement(request,response);
});

app.get("/supprimer_annulation",function(request,response)
{
    pc.supprimer_annulation(request,response);
});

app.get("/annulations",function(request,response)
{
    pc.annulations(request,response);
});

app.get("/supprimer_remboursement",function(request,response)
{
    pc.supprimer_remboursement(request,response);
});

app.get("/one_annulation",function(request,response)
{
    cc.one_annulation(request,response);
});

app.post("/ajouter_remboursement",function(request,response)
{
    pc.ajouter_remboursement(request,response);
});


app.get("/one_client",function(request,response)
{
    if(request.session.connected==true)
    {
        var id = request.query.id;

        sql.query("SELECT count(*) as c from facture where id_devis in (select id from devis where id_client='"+id+"')", function (err, resulta, fields) {
            if (err) {
                console.log(err)
               
            }else{
                
                sql.query("SELECT count(*) as c FROM remboursement where id_facture in (select id from facture where id_devis in (select id from devis where id_client='"+id+"' ))", function (err, resultr, fields) {
                    if (err) {
                        console.log(err)
                       
                    }else{
                        sql.query("SELECT count(*) as c FROM annulation where id_facture in  (select id from facture where id_devis in (select id from devis where id_client='"+id+"' ))", function (err, resultan, fields) {
                            if (err) {
                                console.log(err)
                               
                            }else{
                                
                                sql.query("SELECT * FROM client where id_client='"+id+"'", function (err, result, fields) {
                                    if (err) {
                                        console.log(err)
                                       
                                    }else{
                                        console.log(resulta[0].c)
                                        return response.render('one_client', {
                                            nom: request.session.nom,
                                            client: result[0],
                                            nbre_achat: resulta[0].c,
                                            nbre_remb : resultr[0].c,
                                            nbre_annulation: resultan[0].c
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
});


app.post("/modifier_client",function(request,response)
{
    if(request.session.connected==true){
var email="";

if(request.body.email==null)
{
    email = request.body.email;
}else{
    email= request.body.email.trim();
}

    sql.query("update  client set nom='"+request.body.nom.trim()+"', prenom='"+request.body.prenom.trim()+"',email='"+email+"',tel='"+request.body.tel.trim()+"', adresse='"+request.body.adresse.trim()+"' where id_client='"+request.body.id+"'",(error,result) => {
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
                                            const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result.length / limit);
                                            return response.render('clients', {
                                                nom: request.session.nom,
                                                r_client: paginatedData,
                                                nbre_achat: resulta,
                                                nbre_remb : resultr,
                                                nbre_annulation: resultan,
                                                r_message : "le client a été modifié",
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


    })
}else{
    response.render("login");
}
})






app.get("/one_client1",function(request,response)
{
    if(request.session.connected==false || request.session.connected==null)
    {
        response.render("login");
    }else{
        return response.render('one_client', {
            nom: request.session.nom,
            client: request.session.client
        })
    }
});

app.get("/loggedIn",function(request,response)
{
    if(request.session.connected==false || request.session.connected==null)
    {
        response.render("login");
    }else{


        sql.query("SELECT sum(p.prix) as c FROM produit p, devis d, produit_devis pd, facture f where p.id_produit = pd.id_produit and d.id = pd.id_devis and d.id = f.id_devis ", function (err, resulte, fields) {
            if (err) {
                console.log(err)
               
            }else{
                
                sql.query("SELECT count(*) as c FROM commande  where id not in (select id_commande from livraison)", function (err, resultc, fields) {
                    if (err) {
                        console.log(err)
                       
                    }else{
                        
                        sql.query("SELECT count(p.id_produit) as c FROM produit p, devis d, produit_devis pd, facture f where p.id_produit = pd.id_produit and d.id = pd.id_devis and d.id = f.id_devis ", function (err, results, fields) {
        if (err) {
            console.log(err)
           
        }else{
            
            sql.query("SELECT count(c.id_client) as c1  FROM client c", function (err, resultc, fields) {
                if (err) {
                    console.log(err)
                   
                }else{
                    
                    return response.render('homepage', {
                        nom: request.session.nom,
                        earnings : resulte[0].c,
                        clients : resultc[0].c1,
                        solds : results[0].c,
                        commandes : resultc[0].c


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

app.get("/modifier_client_form",function(request,response)
{
    if(request.session.connected==true)
    {
    var id = request.query.id

    sql.query("SELECT * FROM client where id_client='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)
           
        }else{
            
             response.render('modifier_client_form',{
                nom: request.session.nom,
                client: result[0]
            })
        }
        
      });
    }else{
        response.render("login");
    }
})

app.get("/supprimer_client",function(request,response)
{
    
    if(request.session.connected==true){
   
      var id = request.query.id

      sql.query("delete  FROM client where id_client='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err);
            
        }else{

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
                                            const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result.length / limit);
                                            return response.render('clients', {
                                                nom: request.session.nom,
                                                r_client: paginatedData,
                                                nbre_achat: resulta,
                                                nbre_remb : resultr,
                                                nbre_annulation: resultan,
                                                r_message : "le client a été supprimé!",
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


    }else{
        response.render("login");
    }
});

app.get("/deconnecter",function(request,response)
{
    request.session.connected=false
    request.session.nom=null
    response.render("login");
});


function getCategories()
{
    sql.query("SELECT nom FROM categorie", function (err, result, fields) {
        if (err) {
            console.log(err)
           
            
        }else{


          
            return result;
        }
        
      });
}


app.post("/ajouter_categorie",function(request,response)
{
    

    if(request.session.connected==true)
    {
        sql.query("insert into categorie (nom) values ('"+request.body.nom.trim()+"')", (err,res) =>{
            if(err)
            {
                console.log(err);
            }else
              {
                
                sql.query("SELECT p.image, p.id_produit , p.nom, p.marque, p.prix, p.qte_en_stock, p.pourcent_reduction_promo, f.nom as fournisseur, f.id , c.nom as categorie, c.id as id_c FROM produit p, fournisseur f, sous_categorie c where p.id_fournisseur = f.id and p.sous_categorie = c.id", function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
                            if (err) {
                                console.log(err)
                                
                            }else{
                    
                                sql.query("SELECT   c.nom, c.id, ca.nom as cat FROM  sous_categorie c , categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultc, fields) {
                                    if (err) {
                                        console.log(err)
                                        
                                    }else{
                            
                                        sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultcat, fields) {
                                    if (err) {
                                        console.log(err)
                                        
                                    }else{
                                        const page = parseInt(request.query.page) || 1;
                                        const limit = 10; // Rows per page
                                        const startIndex = (page - 1) * limit;
                                        const endIndex = page * limit;
                                    
                                        const paginatedData = resultcat.slice(startIndex, endIndex);
                                        const totalPages = Math.ceil(resultcat.length / limit);
                                        return response.render('categories/categories', {
                                            nom: request.session.nom,
                                            produit: result,
                                            fournisseurs : resultf,
                                           
                                            categories : paginatedData,
                                            message : "la catégorie a été créée avec succès!",
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
        })
    }else{
        response.render("login");
    }
    
});

app.post("/ajouter_sous_categorie",function(request,response)
{
    if(request.session.connected==true)
        {
            sql.query("insert into sous_categorie (id_categorie,nom) values ('"+request.body.categorie+"','"+request.body.nom.trim()+"')", (err,res) =>{
                if(err)
                {
                    console.log(err);
                }else
                  {
                    
                    sql.query("SELECT p.image, p.id_produit , p.nom, p.marque, p.prix, p.qte_en_stock, p.pourcent_reduction_promo, f.nom as fournisseur, f.id , c.nom as categorie, c.id as id_c FROM produit p, fournisseur f, sous_categorie c where p.id_fournisseur = f.id and p.sous_categorie = c.id", function (err, result, fields) {
                        if (err) {
                            console.log(err)
                            
                        }else{
                
                            sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
                                if (err) {
                                    console.log(err)
                                    
                                }else{
                        
                                    sql.query("SELECT   c.nom, c.id, ca.nom as categorie FROM  sous_categorie c , categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultsc, fields) {
                                        if (err) {
                                            console.log(err)
                                            
                                        }else{
                                
                                            sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultc, fields) {
                                        if (err) {
                                            console.log(err)
                                            
                                        }else{
                                            const page = parseInt(request.query.page) || 1;
                                        const limit = 10; // Rows per page
                                        const startIndex = (page - 1) * limit;
                                        const endIndex = page * limit;
                                    
                                        const paginatedData = resultsc.slice(startIndex, endIndex);
                                        const totalPages = Math.ceil(resultsc.length / limit);
                                
                                            return response.render('sous_categories/sous_categories', {
                                                nom: request.session.nom,
                                                produit: result,
                                                fournisseurs : resultf,
                                                sous_categories : paginatedData,
                                                categories : resultc,
                                                message : "la sous catégorie a été créée avec succès!",
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
            })
        }else{
            response.render("login");
        }
        
    
});
function getSCategorie()
{
    sql.query("SELECT nom FROM sous_categorie", function (err, result, fields) {
        if (err) {
            console.log(err)
            
        }else{



            return result;
        }
        
      });
}




app.get("/produits",function(request,response)
{
    if(request.session.connected==true){
        
    sql.query("SELECT p.image, p.id_produit,p.alerte , p.nom, p.marque, p.prix, p.qte_en_stock , c.nom as categorie, c.id as id_c FROM produit p,  sous_categorie c where  p.sous_categorie = c.id", function (err, result, fields) {
        if (err) {
            console.log(err)
            
        }else{

            sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
                if (err) {
                    console.log(err)
                    
                }else{
        
                    sql.query("SELECT   c.nom, c.id, ca.nom as cat FROM  sous_categorie c , categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultc, fields) {
                        if (err) {
                            console.log(err)
                            
                        }else{
                
                            sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultcat, fields) {
                        if (err) {
                            console.log(err)
                            
                        }else{
                
                            const page = parseInt(request.query.page) || 1;
                            const limit = 10; // Rows per page
                            const startIndex = (page - 1) * limit;
                            const endIndex = page * limit;
                        
                            const paginatedData = result.slice(startIndex, endIndex);
                            const totalPages = Math.ceil(result.length / limit);
                        
                            return response.render('produits', {
                                nom: request.session.nom,
                                produit: paginatedData,
                                fournisseurs : resultf,
                                categories : resultc,
                                cat : resultcat,
                                currentPage: page,
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
    }else{
        response.render("login");
    }
});




app.post("/ajouter_produit",function(request,response)
{
    if(request.session.connected==true){
        
    sql.query("SELECT id from fournisseur ", function (err, resultf, fields) {
        if (err) {
            console.log(err)
            
            
        }else{

            sql.query("SELECT id from sous_categorie where nom='"+request.body.categorie.trim()+"'", function (err, resultc, fields) {
                if (err) {
                    console.log(err)
                    
                    
                }else{
                    var img = request.body.img;
                    sql.query("insert into produit (image,nom,marque,prix,sous_categorie,qte_en_stock,alerte) values ('"+img+"','"+request.body.nom.trim()+"','"+request.body.marque.trim()+"','"+request.body.prix.trim()+"','"+resultc[0].id+"','"+request.body.stock.trim()+"','"+request.body.alerte+"')", function (err, res, fields) {
                        if (err) {
                            console.log(err)
                            
                            
                        }else{
                
                            sql.query("SELECT p.image, p.id_produit ,p.alerte, p.nom, p.marque, p.prix, p.qte_en_stock,  c.nom as categorie, c.id as id_c FROM produit p,  sous_categorie c where  p.sous_categorie = c.id", function (err, result1, fields) {
                                if (err) {
                                    console.log(err)
                                    
                                }else{
                        
                                    sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf1, fields) {
                                        if (err) {
                                            console.log(err)
                                            
                                        }else{
                                
                                            sql.query("SELECT   c.nom, c.id, ca.nom as cat FROM  sous_categorie c , categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultc1, fields) {
                                                if (err) {
                                                    console.log(err)
                                                    
                                                }else{
                                        
                                                    sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultcat1, fields) {
                                                        if (err) {
                                                            console.log(err)
                                                            
                                                        }else{
                                                            const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result1.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result1.length / limit);
                                                            return response.render('produits', {
                                                                nom: request.session.nom,
                                                                produit: paginatedData,
                                                                fournisseurs : resultf1,
                                                                categories : resultc1,
                                                                cat : resultcat1,
                                                                message : "le produit a été ajouté avec succès!",
                                                                currentPage: page,
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
    }else{
        response.render("login");
    }
});






app.get("/afficher_sous_categorie",function(request,response)
{
    if(request.session.connected==true){
    sql.query("SELECT categorie.nom as nom_c,sous_categorie.id as id,sous_categorie.nom  as sc_nom  FROM categorie, sous_categorie where categorie.id_categorie=sous_categorie.id_categorie", function (err, result, fields) {
        if (err) {
            console.log(err)
            return response.render('afficher_sous_categorie', {
                message: 'il y a eu une erreur!',
                nom : request.session.nom
            })
        }else{

           


            response.render('afficher_sous_categorie',{
                nom: request.session.nom,
                categories: result
            })
        }
        
      });
    }else{
        response.render("login");
    }
});


app.get("/categories",function(request,response)
{
    if(request.session.connected==true){
    sql.query("SELECT id_categorie as id, nom from categorie", function (err, result, fields) {
        if (err) {
            console.log(err)
            
        }else{

           

            const page = parseInt(request.query.page) || 1;
            const limit = 10; // Rows per page
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
        
            const paginatedData = result.slice(startIndex, endIndex);
            const totalPages = Math.ceil(result.length / limit);
            response.render('categories/categories',{
                nom: request.session.nom,
                categories: paginatedData,
                currentPage : page,
                totalPages
            })
        }
        
      });
    }else{
        response.render("login");
    }
});


app.get("/sous_categories",function(request,response)
{
    if(request.session.connected==true){
    sql.query("SELECT id_categorie as id, nom from categorie", function (err, resultc, fields) {
        if (err) {
            console.log(err)
            
        }else{

           


           sql.query("SELECT sc.id , sc.nom, c.nom as categorie  from categorie c, sous_categorie sc where c.id_categorie = sc.id_categorie", function (err, resultsc, fields) {
        if (err) {
            console.log(err)
            
        }else{

           
            const page = parseInt(request.query.page) || 1;
            const limit = 10; // Rows per page
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
        
            const paginatedData = resultsc.slice(startIndex, endIndex);
            const totalPages = Math.ceil(resultsc.length / limit);

            response.render('sous_categories/sous_categories',{
                nom: request.session.nom,
                categories: resultc,
                sous_categories : paginatedData,
                currentPage : page,
                totalPages
            })
        }
        
      });
        }
        
      });
    }else{
        response.render("login");
    }
});


app.get("/modifier_sous_categorie_form",function(request,response)
{
    var id =request.query.id
    sql.query("SELECT categorie.nom as nom_c,sous_categorie.id as id,sous_categorie.nom  as nom_sc  FROM categorie, sous_categorie where categorie.id_categorie=sous_categorie.id_categorie and sous_categorie.id='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)
            return response.render('modifier_sous_categorie_form', {
                message: 'il y a eu une erreur, ressayer plutard!',
                nom : request.session.nom
            })
        }else{

            sql.query("SELECT nom FROM categorie", function (err, result1, fields) {
                if (err) {
                    console.log(err)
                    return response.render('modifier_sous_categorie_form', {
                        message: 'il y a eu une erreur!',
                        nom : request.session.nom
                    })
                }else{
        
        
        
                    response.render('modifier_sous_categorie_form',{
                        nom: request.session.nom,
                        categories: result1,
                        categorie:result[0]
                    })
                }
                
              });


            
        }
        
      });
});



app.post("/modifier_sous_categorie",function(request,response)
{
    
    if(request.session.connected==true){

        sql.query("SELECT * FROM categorie where nom='"+request.body.categorie+"'", function (err, result1, fields) {
            if (err) {
                console.log(err)
                
            }else{
    
    
    console.log(request.body.id.trim())
               
               
    sql.query("update  sous_categorie set nom = ?, id_categorie = ? where id = ? ",[request.body.nom.trim(),result1[0].id_categorie,request.body.id.trim()],(error,result) => {
        if(error)
        {
        console.log(error);
        return response.render('modifier_sous_categorie_form', {
            message: 'y a une erreur, reéssayez plutard'
        })
        }
        else{
            return response.render('modifier_sous_categorie_form',{
                message: 'la sous catégorie a été modifiée!',
                nom :request.session.nom
            })
        }


    })
                
            }
            
          });


    
}else{
    response.render("login");
}
})


app.get("/supprimer_sous_categorie",function(request,response)
{
    
    var id =request.query.id
    if(request.session.connected==true){
   
      var id = request.query.id

      sql.query("delete  FROM sous_categorie where id='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)
           
        }else{

            sql.query("SELECT p.image, p.id_produit , p.nom, p.marque, p.prix, p.qte_en_stock, p.pourcent_reduction_promo, f.nom as fournisseur, f.id , c.nom as categorie, c.id as id_c FROM produit p, fournisseur f, sous_categorie c where p.id_fournisseur = f.id and p.sous_categorie = c.id", function (err, result, fields) {
                if (err) {
                    console.log(err)
                    
                }else{
        
                    sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
                        if (err) {
                            console.log(err)
                            
                        }else{
                
                            sql.query("SELECT   c.nom, c.id, ca.nom as categorie FROM  sous_categorie c , categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultsc, fields) {
                                if (err) {
                                    console.log(err)
                                    
                                }else{
                        
                                    sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultc, fields) {
                                        if (err) {
                                            console.log(err)
                                            
                                        }else{
                                            const page = parseInt(request.query.page) || 1;
                                            const limit = 10; // Rows per page
                                            const startIndex = (page - 1) * limit;
                                            const endIndex = page * limit;
                                        
                                            const paginatedData = resultsc.slice(startIndex, endIndex);
                                            const totalPages = Math.ceil(resultsc.length / limit);
                                            return response.render('sous_categories/sous_categories', {
                                                nom: request.session.nom,
                                                produit: result,
                                                fournisseurs : resultf,
                                                sous_categories : paginatedData,
                                                categories : resultc,
                                                message : "la sous catégorie a été supprimée avec succès!",
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


    }else{
        response.render("login");
    }
});

app.post("/modifier_categorie",function(request,response)
{
    if(request.session.connected==true){
        console.log(request.body.id)

        sql.query("select * from categorie where nom ='"+request.body.nom.trim()+"' and nom != '"+request.body.a_nom.trim()+"' ", (err,res) =>{
            if(err)
            {
                console.log(err);
                return response.render('modifier_categorie_form', {
                    message: 'il y a eu une erreur,veuillez ressayer plutard',
                    nom : request.session.nom
                })
            }else
            if(res.length>=1)
            {
                    return response.render('modifier_categorie_form', {
                        message: 'ce nom existe déjà',
                        nom : request.session.nom
                    })
            }else{
        
                sql.query("update categorie set nom = ? where id_categorie = ? ",[request.body.nom,request.body.id], function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        return response.render('modifier_categorie_form', {
                            message: 'il y a eu une erreur!',
                            nom : request.session.nom
                        })
                    }else{
            
                       
            
            
                        response.render('modifier_categorie_form',{
                            nom: request.session.nom,
                            message: 'la catégorie à été modifiée'
                            
                        })
                    }
                    
                  })
        
    }
    })



        

  ;
    }else{
        response.render("login");
    }
});

app.get("/modifier_categorie_form",function(request,response)
{
    if(request.session.connected==true)
    {
    var id =request.query.id
    sql.query("SELECT * from categorie where id_categorie='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)
            return response.render('modifier_categorie_form', {
                message: 'il y a eu une erreur, ressayer plutard!',
                nom : request.session.nom
            })
        }else{

            return response.render('modifier_categorie_form', {
                categorie:result[0],
                nom : request.session.nom
            }) 


            
        }
        
      });
    }else{
        response.render("login");
    }
});


app.get("/supprimer_categorie",function(request,response)
{
    
    
    if(request.session.connected==true){
   
      var id = request.query.id

      sql.query("delete  FROM categorie where id_categorie='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)


            
        }else{

            sql.query("SELECT p.image, p.id_produit , p.nom, p.marque, p.prix, p.qte_en_stock, p.pourcent_reduction_promo, f.nom as fournisseur, f.id , c.nom as categorie, c.id as id_c FROM produit p, fournisseur f, sous_categorie c where p.id_fournisseur = f.id and p.sous_categorie = c.id", function (err, result, fields) {
                if (err) {
                    console.log(err)
                    
                }else{
        
                    sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
                        if (err) {
                            console.log(err)
                            
                        }else{
                
                            sql.query("SELECT   c.nom, c.id, ca.nom as cat FROM  sous_categorie c , categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultc, fields) {
                                if (err) {
                                    console.log(err)
                                    
                                }else{
                        
                                    sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultcat, fields) {
                                        if (err) {
                                            console.log(err)
                                            
                                        }else{
                                            const page = parseInt(request.query.page) || 1;
                                            const limit = 10; // Rows per page
                                            const startIndex = (page - 1) * limit;
                                            const endIndex = page * limit;
                                        
                                            const paginatedData = resultcat.slice(startIndex, endIndex);
                                            const totalPages = Math.ceil(resultcat.length / limit);

                                            return response.render('categories/categories', {
                                                nom: request.session.nom,
                                                produit: result,
                                                fournisseurs : resultf,
                                                categories : paginatedData,
                                                message : "la catégorie a été supprimée avec succès!",
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


    }else{
        response.render("login");
    }
});

app.post("/modifier_produit",function(request,response)
{
    if(request.session.connected==true){
        
    sql.query("select id from sous_categorie where nom = '"+request.body.categorie.trim()+"'", function (err, resultc, fields) {
        if (err) {
            console.log(err)
           
        }else{

            sql.query("select id from fournisseur ", function (err, resultf, fields) {
                if (err) {
                    console.log(err)
                   
                }else{
        
                   if(request.body.img==null || request.body.img=='')
                   {
                    console.log("null");
                    sql.query("update produit set qte_en_stock = '"+request.body.stock.trim()+"',  nom = '"+request.body.nom.trim()+"' ,marque = '"+request.body.marque.trim()+"',prix = '"+request.body.prix.trim()+"', sous_categorie ='"+resultc[0].id+"',alerte = '"+request.body.alerte+"' where id_produit = '"+request.body.id+"'", function (err, resultc, fields) {
                        if (err) {
                            console.log(err)
                           
                        }else{
                
                            sql.query("SELECT p.image,p.alerte, p.id_produit , p.nom, p.marque, p.prix, p.qte_en_stock , c.nom as categorie, c.id as id_c FROM produit p,  sous_categorie c where  p.sous_categorie = c.id", function (err, result, fields) {
                                if (err) {
                                    console.log(err)
                                    
                                }else{
                        
                                    sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
                                        if (err) {
                                            console.log(err)
                                            
                                        }else{
                                
                                            sql.query("SELECT   c.nom, c.id, ca.nom as cat FROM  sous_categorie c , categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultc, fields) {
                                                if (err) {
                                                    console.log(err)
                                                    
                                                }else{
                                        
                                                    sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultcat, fields) {
                                                        if (err) {
                                                            console.log(err)
                                                            
                                                        }else{
                                                
                                                            const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result.length / limit);
                                                            return response.render('produits', {
                                                                nom: request.session.nom,
                                                                produit: paginatedData,
                                                                fournisseurs : resultf,
                                                                categories : resultc,
                                                                cat : resultcat,
                                                                message : "le produit a été modifié avec succès!",
                                                                currentPage: page,
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
                   }else{
                    sql.query("update produit set qte_en_stock = '"+request.body.stock.trim()+"', nom = '"+request.body.nom.trim()+"' ,marque = '"+request.body.marque.trim()+"',prix = '"+request.body.prix.trim()+"', sous_categorie ='"+resultc[0].id+"', image = '"+request.body.img+"',alerte = '"+request.body.alerte+"' where id_produit = '"+request.body.id+"'", function (err, resultc, fields) {
                        if (err) {
                            console.log(err)
                            
                        }else{
                
                            sql.query("SELECT p.image,p.alerte, p.id_produit , p.nom, p.marque, p.prix, p.qte_en_stock , c.nom as categorie, c.id as id_c FROM produit p,  sous_categorie c where p.sous_categorie = c.id", function (err, result, fields) {
                                if (err) {
                                    console.log(err)
                                    
                                }else{
                        
                                    sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
                                        if (err) {
                                            console.log(err)
                                            
                                        }else{
                                
                                            sql.query("SELECT   c.nom, c.id, ca.nom as cat FROM  sous_categorie c , categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultc, fields) {
                                                if (err) {
                                                    console.log(err)
                                                    
                                                }else{
                                        
                                                    sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultcat, fields) {
                                                        if (err) {
                                                            console.log(err)
                                                            
                                                        }else{
                                                            const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result.length / limit);
                                                            return response.render('produits', {
                                                                nom: request.session.nom,
                                                                produit: paginatedData,
                                                                fournisseurs : resultf,
                                                                categories : resultc,
                                                                cat : resultcat,
                                                                message : "le produit a été modifié avec succès!",
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
                    
                }
                
              });
            
        }
        
      });
    }else{
        response.render("login");
    }
});



app.get("/supprimer_produit",function(request,response)
{
    
    
    if(request.session.connected==true){
   
      var id = request.query.id

      sql.query("delete  FROM produit where id_produit ='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)

            

            
        }else{

            sql.query("SELECT p.image,p.alerte, p.id_produit , p.nom, p.marque, p.prix, p.qte_en_stock,  c.nom as categorie, c.id as id_c FROM produit p,  sous_categorie c where  p.sous_categorie = c.id", function (err, result, fields) {
                if (err) {
                    console.log(err)
                    
                }else{
        
                    sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
                        if (err) {
                            console.log(err)
                            
                        }else{
                
                            sql.query("SELECT   c.nom, c.id , ca.nom as cat FROM  sous_categorie c, categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultc, fields) {
                                if (err) {
                                    console.log(err)
                                    
                                }else{
                        
                                    sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultcat, fields) {
                                        if (err) {
                                            console.log(err)
                                            
                                        }else{
                                            const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result.length / limit);
                                
                                            return response.render('produits', {
                                                nom: request.session.nom,
                                                produit: paginatedData,
                                                fournisseurs : resultf,
                                                categories : resultc,
                                                cat : resultcat,
                                                message : "le produit a été supprimé avec succès!",
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


    }else{
        response.render("login");
    }
});


app.get("/fournisseurs",function(request,response)
{
    if(request.session.connected==true){
    sql.query("SELECT * from fournisseur", function (err, result, fields) {
        if (err) {
            console.log(err)
            
        }else{

            sql.query("SELECT count(l.id) as c, f.id from fournisseur f, livraison l,  commande c where c.id= l.id_commande and c.id_fournisseur = f.id group by f.id ", function (err, resultl, fields) {
        if (err) {
            console.log(err)
            
        }else{

            sql.query("SELECT count(c.id) as c, f.id from fournisseur f,  commande c where  c.id_fournisseur = f.id group by f.id ", function (err, resultc, fields) {
                if (err) {
                    console.log(err)
                    
                }else{
                    const page = parseInt(request.query.page) || 1;
                    const limit = 10; // Rows per page
                    const startIndex = (page - 1) * limit;
                    const endIndex = page * limit;
                
                    const paginatedData = result.slice(startIndex, endIndex);
                    const totalPages = Math.ceil(result.length / limit);

                    return response.render('fournisseurs', {
                        fournisseurs:paginatedData,
                        nom : request.session.nom,
                        nbre_l : resultl,
                        nbre_c : resultc,
                        currentPage : page,
                        totalPages
                    }) 
        
        
                    
                }
                
              });

            
        }
        
      });


            
        }
        
      });
    }else{
        response.render("login")
    }
});


app.post("/modifier_fournisseur",function(request,response)
{
    if(request.session.connected==true)
    {
    

        sql.query("update fournisseur set nom ='"+request.body.nom.trim()+"', email ='"+request.body.email.trim()+"', tel ='"+request.body.tel.trim()+"', adresse ='"+request.body.adresse.trim()+"'  where id='"+request.body.id+"'", function (err, resultx, fields) {
            if (err) {
                console.log(err)
               
            }else{
    
                sql.query("SELECT * from fournisseur", function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("SELECT count(l.id) as c, f.id from fournisseur f, livraison l,  commande c where c.id= l.id_commande and c.id_fournisseur = f.id group by f.id ", function (err, resultl, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("SELECT count(c.id) as c, f.id from fournisseur f,  commande c where  c.id_fournisseur = f.id group by f.id ", function (err, resultc, fields) {
                            if (err) {
                                console.log(err)
                                
                            }else{
                                const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = result.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(result.length / limit);
                                return response.render('fournisseurs', {
                                    fournisseurs:paginatedData,
                                    nom : request.session.nom,
                                    nbre_l : resultl,
                                    nbre_c : resultc,
                                    message : "le fournisseur a été modifié avec succè!",
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


    
    }else{
        response.render("login");
    }
});






app.get("/homepage",function(request,response)
{
    if(request.session.connected==true){
       
        sql.query("SELECT sum(p.prix) as c FROM produit p, devis d, produit_devis pd, facture f where p.id_produit = pd.id_produit and d.id = pd.id_devis and d.id = f.id_devis ", function (err, resulte, fields) {
            if (err) {
                console.log(err)
               
            }else{
                
                sql.query("SELECT count(*) as c FROM commande  where id not in (select id_commande from livraison)", function (err, resultc, fields) {
                    if (err) {
                        console.log(err)
                       
                    }else{
                        
                        sql.query("SELECT count(p.id_produit) as c FROM produit p, devis d, produit_devis pd, facture f where p.id_produit = pd.id_produit and d.id = pd.id_devis and d.id = f.id_devis ", function (err, results, fields) {
        if (err) {
            console.log(err)
           
        }else{
            
            sql.query("SELECT count(c.id_client) as c1  FROM client c", function (err, resultc, fields) {
                if (err) {
                    console.log(err)
                   
                }else{
                    
                    return response.render('homepage', {
                        nom: request.session.nom,
                        earnings : resulte[0].c,
                        clients : resultc[0].c1,
                        solds : results[0].c,
                        commandes : resultc[0].c


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
        response.render("login")
    }
});


app.post("/ajouter_fournisseur",function(request,response)
{
    if(request.session.connected==true)
    {
        sql.query("select * from fournisseur where email='"+request.body.email.trim()+"'", (err,res) =>{
            if(err)
            {
                console.log(err);
               
            }else
            if(res.length>=1)
            {
                sql.query("SELECT * from fournisseur", function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("SELECT count(l.id) as c, f.id from fournisseur f, livraison l,  commande c where c.id= l.id_commande and c.id_fournisseur = f.id group by f.id ", function (err, resultl, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("SELECT count(c.id) as c, f.id from fournisseur f,  commande c where  c.id_fournisseur = f.id group by f.id ", function (err, resultc, fields) {
                            if (err) {
                                console.log(err)
                                
                            }else{
                                const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = result.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(result.length / limit);
                                return response.render('fournisseurs', {
                                    fournisseurs:paginatedData,
                                    nom : request.session.nom,
                                    nbre_l : resultl,
                                    nbre_c : resultc,
                                    message : "cet email a déjà un compte",
                                    currentPage : page,
                                    totalPages
                                }) 
                    
                    
                                
                            }
                            
                          });
            
                        
                    }
                    
                  });
            
            
                        
                    }
                    
                  });
            }else{
        
                sql.query("insert into fournisseur (email,tel,adresse,nom) values ('"+request.body.email.trim()+"','"+request.body.tel.trim()+"','"+request.body.adresse.trim()+"','"+request.body.nom.trim()+"') ", function (err, result, fields) {
                    if (err) {
                        console.log(err)
                       
                    }else{
                        sql.query("SELECT * from fournisseur", function (err, result, fields) {
                            if (err) {
                                console.log(err)
                                
                            }else{
                    
                                sql.query("SELECT count(l.id) as c, f.id from fournisseur f, livraison l,  commande c where c.id= l.id_commande and c.id_fournisseur = f.id group by f.id ", function (err, resultl, fields) {
                            if (err) {
                                console.log(err)
                                
                            }else{
                    
                                sql.query("SELECT count(c.id) as c, f.id from fournisseur f,  commande c where  c.id_fournisseur = f.id group by f.id ", function (err, resultc, fields) {
                                    if (err) {
                                        console.log(err)
                                        
                                    }else{
                                        const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result.length / limit);
                            
                                        return response.render('fournisseurs', {
                                            fournisseurs:paginatedData,
                                            nom : request.session.nom,
                                            nbre_l : resultl,
                                            nbre_c : resultc,
                                            message : "le fournisseur a été créé avec succès !",
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
    })



    }else{
        response.render("login");
    }
});


app.get("/supprimer_fournisseur",function(request,response)
{
    if(request.session.connected==true){
        id=request.query.id

        sql.query("delete from fournisseur where id = '"+id+"'", function (err, result, fields) {
            if (err) {
                console.log(err)
               
            }else{

                sql.query("SELECT * from fournisseur", function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("SELECT count(l.id) as c, f.id from fournisseur f, livraison l,  commande c where c.id= l.id_commande and c.id_fournisseur = f.id group by f.id ", function (err, resultl, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("SELECT count(c.id) as c, f.id from fournisseur f,  commande c where  c.id_fournisseur = f.id group by f.id ", function (err, resultc, fields) {
                            if (err) {
                                console.log(err)
                                
                            }else{
                                const page = parseInt(request.query.page) || 1;
                                                            const limit = 10; // Rows per page
                                                            const startIndex = (page - 1) * limit;
                                                            const endIndex = page * limit;
                                                        
                                                            const paginatedData = result.slice(startIndex, endIndex);
                                                            const totalPages = Math.ceil(result.length / limit);
                    
                                return response.render('fournisseurs', {
                                    fournisseurs:paginatedData,
                                    nom : request.session.nom,
                                    nbre_l : resultl,
                                    nbre_c : resultc,
                                    message : "le fournisseur a été supprimé avec succès !",
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

    
    }else{
        response.render("login")
    }
});

app.get("/one_fournisseur",function(request,response)
{
    if(request.session.connected==true)
    {
    var id =request.query.id
    sql.query("select * from fournisseur  where id='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)
           
        }else{
            sql.query("select count(*) as n from commande c, produit p where c.id_produit=p.id_produit and p.id_fournisseur='"+id+"'", function (err, resultc, fields) {
                if (err) {
                    console.log(err)
                   
                }else{
        
                   sql.query("select count(*) as n from livraison l, commande c, produit p  where l.id_commande = c.id and c.id_produit = p.id_produit and p.id_fournisseur = '"+id+"'", function (err, resultl, fields) {
        if (err) {
            console.log(err)
           
        }else{

            return response.render('one_fournisseur', {
                fournisseur:result[0],
                nom : request.session.nom,
                nbre_commande : resultc[0].n,
                nbre_livraison : resultl[0].n
            }) 


            
        }
        
      });
        
        
                    
                }
                
              });


            
        }
        
      });
    }else{
        response.render("login");
    }
});


app.get("/commandes",function(request,response)
{
    if(request.session.connected==true)
    {
    var id =request.query.id
    sql.query("select c.etat, c.date, c.id, c.montant ,f.nom as nom_f  from commande c, fournisseur f   where   f.id = c.id_fournisseur  and f.id ='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)
           
        }else{

            sql.query(" select pc.quantite, p.nom, pc.id_commande from produit_commande pc, produit p where p.id_produit = pc.id_produit", function (err, resultpc, fields) {
                if (err) {
                    console.log(err)
                   
                }else{
        
                    return response.render('commandes', {
                        commande :result,
                        nom : request.session.nom,
                        pc : resultpc
                    }) 
        
        
                    
                }
                
              });


            
        }
        
      });
    }else{
        response.render("login");
    }
});


app.get("/supprimer_commande",function(request,response)
{
    if(request.session.connected==true)
    {
    var id =request.query.id
    sql.query("delete from commande where id ='"+id+"'", function (err, result, fields) {
        if (err) {
            console.log(err)
           
        }else{

            sql.query("select c.etat, c.date, c.id, c.montant, f.id as id_fournisseur, f.nom  from commande c, fournisseur f where c.id_fournisseur = f.id ", function (err, resultc, fields) {
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
                                    const page = parseInt(request.query.page) || 1;
                                    const limit = 10; // Rows per page
                                    const startIndex = (page - 1) * limit;
                                    const endIndex = page * limit;
                                
                                    const paginatedData = resultc.slice(startIndex, endIndex);
                                    const totalPages = Math.ceil(resultc.length / limit);

                        
                                    return response.render('all_commandes', {
                                        commande :paginatedData,
                                        nom : request.session.nom,
                                        produits : resultp1,
                                        message : "la commande a été supprimée avec succès!",
                                        pc : resultpc,
                                        fournisseurs: resultf,
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
    }else{
        response.render("login");
    }
});



app.get("/all_commandes",function(request,response)
{
    if(request.session.connected==true)
    {
    
        sql.query("select c.etat, c.date, c.id, c.montant, f.id as id_fournisseur, f.nom  from commande c, fournisseur f where c.id_fournisseur = f.id ", function (err, resultc, fields) {
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
                                const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = resultc.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(resultc.length / limit);

                    
                                return response.render('all_commandes', {
                                    commande :paginatedData,
                                    nom : request.session.nom,
                                    produits : resultp1,
                                    
                                    pc : resultpc,
                                    fournisseurs: resultf,
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
    }else{
        response.render("login");
    }
});



const fs = require('fs');
const fastcsv = require('fast-csv');


 const csv = require('csv-parser');
const { Readable } = require('stream');

 app.post("/importer", function(request,response)
 {
    if(request.session.connected == true)
    {
        var csvContent = request.body.fichier_csv;
       
        const readable = Readable.from(csvContent);

        var er = false;
// Analyser le contenu du CSV

readable
  .pipe(csv({ separator: ';', encoding: 'utf8'  }))
  .on('data', (row) => {
    console.log(row); // Traite chaque ligne

    if(row.prix == null || row.sous_categorie == null || row.nom == null || row.marque == null ||  row.promo ==null)
        {
            er=true;
            
        }
    else{
        sql.query("select id from sous_categorie where nom ='"+row.sous_categorie+"'", function (err, resultc, fields) {
            if (err) {
                console.log(err)
                er=true;
                
            }else{
    
                sql.query("select id from fournisseur where nom = '"+row.fournisseur+"'", function (err, resultf, fields) {
                    if (err) {
                        console.log(err);
                        er=true;
                       
                    }else{
            
                        if(resultc[0].id != null && resultf[0].id != null)
                        {
                        sql.query("insert into produit (nom, prix, marque,  pourcent_reduction_promo,sous_categorie,id_fournisseur)  values('"+row.nom+"','"+row.prix+"','"+row.marque+"','"+row.promo+"','"+resultc[0].id+"','"+resultf[0].id+"')", function (err, resultf, fields) {
                            if (err) {
                               er=true;
                               
                            }else{
                    
                               
                               
                    
                                
                            }
                            
                          });
                        }else{

                            er = true;
                        }
            
                        
                    }
                    
                  });
    
    
                
            }
            
          });
    }

  })
  .on('end', () => {
    console.log('CSV content successfully processed');


    
    

    
          
    
  });

  sql.query("SELECT p.image, p.id_produit , p.nom, p.marque, p.prix, p.qte_en_stock, p.pourcent_reduction_promo, f.nom as fournisseur, f.id , c.nom as categorie, c.id as id_c FROM produit p, fournisseur f, sous_categorie c where p.id_fournisseur = f.id and p.sous_categorie = c.id", function (err, result, fields) {
    if (err) {
        console.log(err)
        
    }else{

        sql.query("SELECT   f.nom, f.id FROM  fournisseur f ", function (err, resultf, fields) {
            if (err) {
                console.log(err)
                
            }else{
    
                sql.query("SELECT   c.nom, c.id , ca.nom as cat FROM  sous_categorie c, categorie ca where c.id_categorie =ca.id_categorie ", function (err, resultc, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("SELECT   c.nom, c.id_categorie as id FROM  categorie c ", function (err, resultcat, fields) {
                            if (err) {
                                console.log(err)
                                
                            }else{
                                const page = parseInt(request.query.page) || 1;
                    const limit = 10; // Rows per page
                    const startIndex = (page - 1) * limit;
                    const endIndex = page * limit;
                
                    const paginatedData = result.slice(startIndex, endIndex);
                    const totalPages = Math.ceil(result.length / limit);
                    
                                if(er==false){
                                return response.render('produits', {
                                    nom: request.session.nom,
                                    produit: paginatedData,
                                    fournisseurs : resultf,
                                    categories : resultc,
                                    cat : resultcat,
                                    message : "l'importation a été faite avec succès!",
                                    currentPage : page,
                                    totalPages
                                    
                                })
                            }else{
                                return response.render('produits', {
                                    nom: request.session.nom,
                                    produit: paginatedData,
                                    fournisseurs : resultf,
                                    categories : resultc,
                                    cat : resultcat,
                                    message : "il y a eu une erreur, vérifier votre fichier",
                                    currentPage : page,
                                    totalPages
                                    
                                })
                            }
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
 })


app.get("/exporter",function(request,response)
{
    if(request.session.connected==true)
    {
    
    sql.query("select p.nom, p.prix, p.marque,  p.pourcent_reduction_promo as promo, f.nom as fournisseur,  sc.nom as sous_categorie from produit p, fournisseur f, sous_categorie sc where p.id_fournisseur = f.id and p.sous_categorie = sc.id ", function (err, resultp, fields) {
        if (err) {
            console.log(err)
            
        }else{

            
            const ws = fs.createWriteStream('output.csv', { encoding: 'utf8' });
            ws.write('\ufeff');
                    fastcsv
                      .write(resultp, { headers: true, delimiter: ';'  })
                      .pipe(ws)
                      .on('finish', () => {
                        console.log('Exportation terminée.');
                         response.download('output.csv');
                      });
                   

            
        }
        
      });
    }else{
        response.render("login");
    }
});


app.post("/modifier_commande",function(request,response)
{
    if(request.session.connected==true)
    {
        sql.query("update produit p, commande c, produit_commande pc set p.qte_en_stock = p.qte_en_stock - pc.quantite   where p.id_produit = pc.id_produit and pc.id_commande = c.id and c.id = '"+request.body.id+"' and c.id in (select id_commande from livraison) ", function (err, resultu, fields) {
            if (err) {
                console.log(err)
                
            }else{
    
                
                sql.query("update commande set  montant = '"+request.body.montant+"', id_fournisseur='"+request.body.id_fournisseur+"' where id = '"+request.body.id+"' ", function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        
                    }else{
            
                        sql.query("delete from produit_commande where id_commande = '"+request.body.id+"'  ", function (err, resultp, fields) {
                                    
                        }); 

                        for(var i=0;i< request.body.produit.length;i++)
                        {
                            sql.query("insert into produit_commande (id_commande,id_produit,quantite) values ('"+request.body.id+"','"+request.body.produit[i]+"','"+request.body.quantite[i]+"')  ", function (err, resultp, fields) {
                                    
                            });

                           
                        }

                        sql.query(" update produit p, produit_commande pc set p.qte_en_stock = p.qte_en_stock + pc.quantite where p.id_produit = pc.id_produit and pc.id_commande in  (select id_commande from facture) and pc.id_commande =  '"+request.body.id+"'  ", function (err, resultp, fields) {
                                    
                        });
                        sql.query("select c.etat, c.date, c.id, c.montant, f.id as id_fournisseur, f.nom  from commande c, fournisseur f where c.id_fournisseur = f.id ", function (err, resultc, fields) {
                            if (err) {
                                console.log(err)
                               
                            }else{
                    
                                sql.query("select p.nom, p.id_produit from produit p ", function (err, resultp1, fields) {
                            if (err) {
                                console.log(err)
                               
                            }else{
                    
                                sql.query("select p.nom, p.id_produit, pc.id_commande, pc.quantite from produit p, produit_commande pc where pc.id_produit = p.id_produit ", function (err, resultpc, fields) {
                                    if (err) {
                                        console.log(err)
                                       
                                    }else{
                            
                                        sql.query("select id, nom from fournisseur ", function (err, resultf, fields) {
                                            if (err) {
                                                console.log(err)
                                               
                                            }else{
                                                const page = parseInt(request.query.page) || 1;
                                                const limit = 10; // Rows per page
                                                const startIndex = (page - 1) * limit;
                                                const endIndex = page * limit;
                                            
                                                const paginatedData = resultc.slice(startIndex, endIndex);
                                                const totalPages = Math.ceil(resultc.length / limit);
        
                                                return response.render('all_commandes', {
                                                    commande :paginatedData,
                                                    nom : request.session.nom,
                                                    produits : resultp1,
                                                    message : "la commande a été modifiée avec succès !",
                                                    pc : resultpc,
                                                    fournisseurs: resultf,
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
});

app.get("/depenses",function(request,response)
{
    dc1.depenses(request,response);
});

app.post("/ajouter_depense",function(request,response)
{
    dc1.ajouter_depense(request,response);
});

app.get("/supprimer_depense",function(request,response)
{
    dc1.supprimer_depense(request,response);
});
app.post("/afficher_inventaire",function(request,response)
{
    ic.afficher_inventaire(request,response);
});


app.get("/ajouter_commande_form",function(request,response)
{
    coc.creation_form(request,response);
});

app.post("/ajouter_commande",function(request,response)
{
    coc.ajouter_commande(request,response,request.body.quantite,request.body.produit,request.body.montant);
});

app.get("/livraisons",function(request,response)
{
    lc1.livraisons(request,response);
});
app.get("/one_livraison",function(request,response)
{
    lc1.one_livraison(request,response);
});
app.post("/modifier_livraison",function(request,response)
{
    lc1.modifier_livraison(request,response,request.body.id_commande,request.body.id_livraison,request.body.a_id_commande);
});

app.get("/modifier_livraison_form",function(request,response)
{
    lc1.modifier_livraison_form(request,response);
});

app.get("/ajouter_livraison_form",function(request,response)
{
    lc1.create_form(request,response);
});

app.post("/ajouter_livraison",function(request,response)
{
    lc1.ajouter_livraison(request,response,request.body.id_commande);
});

app.get("/supprimer_livraison",function(request,response)
{
    lc1.supprimer_livraison(request,response);
});

app.get("/ajouter_livraison1",function(request,response)
{
    lc1.ajouter_livraison(request,response,request.query.id);
});

app.get("/histo_livraison",function(request,response)
{
    lc1.histo_livraison(request,response,request.body.id_commande);
});

app.get("/devis",function(request,response)
{
    dc.devis(request,response);
});

app.get("/ajouter_devis_form",function(request,response)
{
    dc.create_form(request,response);
});

app.post("/ajouter_devis",function(request,response)
{
    dc.ajouter_devis(request,response);
})

app.post("/modifier_devis",function(request,response)
{
    dc.modifier_devis(request,response);
})

app.get("/one_devis",function(request,response)
{
    dc.one_devis(request,response);
});

app.get("/devis_pdf",function(request,response)
{
    dc.generer_devis_pdf(request,response);
});

app.get("/modifier_devis_form",function(request,response)
{
    dc.modifier_devis_form(request,response);
});

app.get('/pdf', (req, res) => {
    const pdfFilePath = path.join(__dirname, 'controllers/public/devis.pdf');

    res.sendFile(pdfFilePath);
});

app.get('/f_pdf', (req, res) => {
    const pdfFilePath = path.join(__dirname, 'controllers/public/facture.pdf');

    res.sendFile(pdfFilePath);
});

app.get("/facture_pdf",function(request,response)
{
    fc.generer_facture_pdf(request,response);
});

app.get("/factures",function(request,response)
{
    fc.factures(request,response);
});

app.post("/ajouter_facture_sd",function(request,response)
{
    fc.ajouter_facture_sd(request,response);
});

app.get("/ajouter_facture_form",function(request,response)
{
    fc.ajouter_facture_form(request,response);
})

app.post("/ajouter_facture",function(request,response)
{
    fc.ajouter_facture(request,response);
})

app.get("/one_facture",function(request,response)
{
    fc.one_facture(request,response);
})

app.get("/modifier_facture_form",function(request,response)
{
    fc.modifier_facture_form(request,response);
})

app.post("/modifier_facture",function(request,response)
{
    fc.modifier_facture(request,response);
})

app.get("/supprimer_facture",function(request,response)
{
    fc.supprimer_facture(request,response);
})

app.get("/supprimer_devis",function(request,response)
{
    dc.supprimer_devis(request,response);
})

app.get("/paiements",function(request,response)
{
    pc.paiements(request,response);
})

app.post("/ajouter_paiement",function(request,response)
{
    pc.ajouter_paiement(request,response);
})

app.post("/modifier_paiement",function(request,response)
{
    pc.modifier_paiement(request,response);
})

// Route pour l'interface
app.get('/stock', (req, res) => {
    res.render('stock'); // exemple de seuil par défaut
  });
  
  // API pour obtenir le stock en temps réel
  app.get('/api/stock', (req, res) => {
    const sql1 = 'SELECT nom, image FROM produit WHERE qte_en_stock < alerte'; // seuil de stock
  
    sql.query(sql1, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }
      res.json(results);
    });
  });
  
  app.get('/product', (req, res) => {
    res.render('product'); // exemple de seuil par défaut
  });
  
  // API pour obtenir le stock en temps réel
  app.get('/api/product', (req, res) => {
    const sql1 = 'SELECT nom, qte_en_stock, prix, id_produit, pourcent_reduction_promo FROM produit'; // seuil de stock
  
    sql.query(sql1, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }
      res.json(results);
    });
  });
  


  app.get('/reste', (req, res) => {
    res.render('reste'); // exemple de seuil par défaut
  });
  
  // API pour obtenir le stock en temps réel
  app.get('/api/reste', (req, res) => {
    const sql1 = 'SELECT f.id ,sum(p.prix*pd.quantite) - sum(p.prix*pd.quantite*d.remise/100) + sum(p.prix*pd.quantite*d.tva/100) as ttc from  facture f, produit p, devis d,  produit_devis pd where f.id_devis = d.id and p.id_produit = pd.id_produit and pd.id_devis = d.id  group by f.id '; // seuil de stock
  
    sql.query(sql1, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }
      res.json(results);
    });
  });

  
  app.get('/acompte', (req, res) => {
    res.render('acompte'); // exemple de seuil par défaut
  });
  
  // API pour obtenir le stock en temps réel
  app.get('/api/acompte', (req, res) => {
    const sql1 = 'SELECT f.acompte , f.id from facture f '; // seuil de stock
  
    sql.query(sql1, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }
      res.json(results);
    });
  });


  app.get('/paiement', (req, res) => {
    res.render('paiement'); // exemple de seuil par défaut
  });
  
  // API pour obtenir le stock en temps réel
  app.get('/api/paiement', (req, res) => {
    const sql1 = 'SELECT sum(p.montant) as s , p.id_facture from paiement p group by p.id_facture '; // seuil de stock
  
    sql.query(sql1, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }
      res.json(results);
    });
  });
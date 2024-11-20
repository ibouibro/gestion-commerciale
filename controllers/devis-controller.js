const sql = require("../Database/db.js");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

class controller{

    constructor(){}

devis(request,response)
{
   
    if(request.session.connected==true)
        {
            var type = "devis";
sql.query("select d.id, d.date, d.id_client, c.nom, c.prenom from devis d, client c where d.id_client = c.id_client and d.type= '"+type+"'",(err,res) =>{
    if(err)
    {
       console.log(err)
    }else{
     
        sql.query("select p.id_produit , p.nom from produit p",(err,resp) =>{
            if(err)
            {
               console.log(err)
            }else{
             
                sql.query("select p.nom, pd.id_produit, pd.quantite, pd.id_devis from produit_devis pd, produit p where pd.id_produit = p.id_produit",(err,respd) =>{
                    if(err)
                    {
                       console.log(err)
                    }else{
                     
                        sql.query("select c.nom, c.prenom, c.id_client from client c",(err,resc) =>{
                            if(err)
                            {
                               console.log(err)
                            }else{
                                const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = res.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(res.length / limit);
                             
                               return response.render("devis/devis",{
                                    devis : paginatedData,
                                    nom : request.session.nom,
                                    produits : resp,
                                    pd : respd,
                                    clients : resc,
                                    currentPage : page,
                                    totalPages
                                })
                        
                                return;
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


supprimer_devis(request,response)
{
   
    if(request.session.connected==true)
        {
            


var id = request.query.id;
sql.query("delete from produit_devis where id_devis = '"+id+"' ",(err,respd) =>{
    if(err)
    {
       console.log(err);
      
    }else{
     
        sql.query("delete from devis where id = '"+id+"' ",(err,res) =>{
            if(err)
            {
               console.log(err);
              
            }else{
             
                var type = "devis";
                sql.query("select d.id, d.date, d.id_client, c.nom, c.prenom from devis d, client c where d.id_client = c.id_client and d.type= '"+type+"'",(err,res) =>{
                    if(err)
                    {
                       console.log(err)
                    }else{
                     
                        sql.query("select p.id_produit , p.nom from produit p",(err,resp) =>{
                            if(err)
                            {
                               console.log(err)
                            }else{
                             
                                sql.query("select p.nom, pd.id_produit, pd.quantite, pd.id_devis from produit_devis pd, produit p where pd.id_produit = p.id_produit",(err,respd) =>{
                                    if(err)
                                    {
                                       console.log(err)
                                    }else{
                                     
                                        sql.query("select c.nom, c.prenom, c.id_client from client c",(err,resc) =>{
                                            if(err)
                                            {
                                               console.log(err)
                                            }else{
                                             
                                                const page = parseInt(request.query.page) || 1;
                                                const limit = 10; // Rows per page
                                                const startIndex = (page - 1) * limit;
                                                const endIndex = page * limit;
                                            
                                                const paginatedData = res.slice(startIndex, endIndex);
                                                const totalPages = Math.ceil(res.length / limit);
                                               return response.render("devis/devis",{
                                                    devis : paginatedData,
                                                    nom : request.session.nom,
                                                    produits : resp,
                                                    pd : respd,
                                                    clients : resc,
                                                    message : "le devis a été supprimé avec succès !",
                                                    currentPage : page,
                                                    totalPages
                                                })
                                        
                                                return;
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
          return  response.render("login");
        } 
}



modifier_devis(request,response)
{
   
    if(request.session.connected==true)
        {
           var tva = 0;
           if(request.body.tva=="tva")
           {
            tva=18;
           }

sql.query("update devis set id_client = '"+request.body.id_client+"', tva = '"+tva+"', remise = '"+request.body.rem+"' where id = '"+request.body.id+"' ",(err,res) =>{
    if(err)
    {
       console.log(err)
    }else{
     
        sql.query("delete from produit_devis where id_devis = '"+request.body.id+"' ",(err,res) =>{
            if(err)
            {
               console.log(err)
            }else{
             
                var str="";
                for(var i=0;i<request.body.produit.length;i++)
                {
                var s="\n";
                s=s+request.body.quant[i]+" # "+request.body.produit[i]+" | ";
            str=str+s;
                }

              var qp = str.replaceAll("\n","").replaceAll("\r","").split(" | ");
           
              qp=qp.slice(0, -1);
              
  for(var i=0; i< qp.length;i++)
  {
      
    this.f(request,response,qp[i],request.body.id);
      
  }  
var type="devis";
  sql.query("select d.id, d.date, d.id_client, c.nom, c.prenom from devis d, client c where d.id_client = c.id_client and d.type = '"+type+"'",(err,res) =>{
    if(err)
    {
       console.log(err)
    }else{
     
        sql.query("select p.id_produit , p.nom from produit p",(err,resp) =>{
            if(err)
            {
               console.log(err)
            }else{
             
                sql.query("select p.nom, pd.id_produit, pd.quantite, pd.id_devis from produit_devis pd, produit p where pd.id_produit = p.id_produit",(err,respd) =>{
                    if(err)
                    {
                       console.log(err)
                    }else{
                     
                        sql.query("select c.nom, c.prenom, c.id_client from client c",(err,resc) =>{
                            if(err)
                            {
                               console.log(err)
                            }else{
                             
                                const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = res.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(res.length / limit);
                               return response.render("devis/devis",{
                                    devis : paginatedData,
                                    nom : request.session.nom,
                                    produits : resp,
                                    pd : respd,
                                    clients : resc,
                                    message : "le devis a été modifié avec succès!",
                                    currentPage : page,
                                    totalPages
                                })
                        
                                return;
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
          return  response.render("login");
        } 
}

create_form(request,response)
{
    if(request.session.connected==true)
        {
sql.query("select nom, id_produit from produit",(err,resp) =>{
    if(err)
    {
        
    }else{
     
        sql.query("select nom, prenom,id_client from client",(err,resc) =>{
            if(err)
            {
               
            }else{
               
                response.render("devis/ajouter_devis_form",{
                    produits : resp,
                    clients : resc,
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


ajouter_devis(request,response)
{
   
    if(request.session.connected==true)
        {
                 

var type ="devis";
var tva = 0;
if(request.body.tva=="tva")
{
    tva=18;
}
            
            sql.query("insert into devis (date,id_client,type,tva,remise) values ('"+request.body.date+"','"+request.body.id_client+"','"+type+"','"+tva+"','"+request.body.rem+"')",(err,resd) =>{
                if(err)
                {
                throw err;
                    return;
                }else{
                    var qpx="";
for(var i=0;i<request.body.produit.length;i++)
{
var str="\n";
str=str+request.body.quant[i]+" # "+request.body.produit[i]+" | ";
qpx=qpx+str;
}

                    var qp = qpx.replaceAll("\n","").replaceAll("\r","").split(" | ");
           
            qp=qp.slice(0, -1);
            
for(var i=0; i< qp.length;i++)
{
    console.log(resd.insertId)
  this.f(request,response,qp[i],resd.insertId);
    
}  


sql.query("select d.id, d.date, d.id_client, c.nom, c.prenom from devis d, client c where d.id_client = c.id_client and d.type='"+type+"'",(err,res) =>{
    if(err)
    {
       console.log(err)
    }else{
     
        sql.query("select p.id_produit , p.nom from produit p",(err,resp) =>{
            if(err)
            {
               console.log(err)
            }else{
             
                sql.query("select p.nom, pd.id_produit, pd.quantite, pd.id_devis from produit_devis pd, produit p where pd.id_produit = p.id_produit",(err,respd) =>{
                    if(err)
                    {
                       console.log(err)
                    }else{
                     
                        sql.query("select c.nom, c.prenom, c.id_client from client c",(err,resc) =>{
                            if(err)
                            {
                               console.log(err)
                            }else{
                             
                                const page = parseInt(request.query.page) || 1;
                                const limit = 10; // Rows per page
                                const startIndex = (page - 1) * limit;
                                const endIndex = page * limit;
                            
                                const paginatedData = res.slice(startIndex, endIndex);
                                const totalPages = Math.ceil(res.length / limit);
                               return response.render("devis/devis",{
                                    devis : paginatedData,
                                    nom : request.session.nom,
                                    produits : resp,
                                    pd : respd,
                                    clients : resc,
                                    message : "le devis a été créé avec succès",
                                    currentPage : page,
                                    totalPages
                                })
                        
                                return;
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

f(request,response,qp,id_devis)
{
    var qte = qp.split(" # ")[0];
    var nom = qp.split(" # ")[1];
   sql.query("select id_produit as id from produit where nom = '"+nom.trim()+"'",(err,resp) =>{
        if(err)
        {
            console.log(err);

           
            return;
        }else{
        
         
          
                 
                   
                         console.log(resp[0])
                            sql.query("insert into produit_devis (id_produit,id_devis,quantite) values ('"+resp[0].id+"','"+id_devis+"','"+qte+"') ",(err,resd) =>{
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

one_devis(request,response)
{
    if(request.session.connected==true)
        {
            var id = request.query.id;
sql.query("select d.date, d.id as id, d.tva, d.remise, c.nom , c.prenom from client c, devis d where c.id_client = d.id_client and d.id = '"+id+"'",(err,resd) =>{
    if(err)
    {
        response.render("devis/one_devis",{
            message : 'il y a eu une erreur, réessayez  plutard !',
            nom : request.session.nom
        })
    }else{
        sql.query("select p.nom, p.prix , p.prix * '"+resd[0].tva+"'/100 as val_tax , p.prix*'"+resd[0].remise+"'/100 as remise, pd.quantite from produit p, produit_devis pd where p.id_produit = pd.id_produit and pd.id_devis = '"+id+"'",(err,resp) =>{
            if(err)
            {
                response.render("devis/one_devis",{
                    message : 'il y a eu une erreur, réessayez  plutard !',
                    nom : request.session.nom
                })
            }else{
             console.log(resp);

                 

        response.render("devis/one_devis",
            {
                nom : request.session.nom,
                produits : resp,
                devis : resd[0]
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




generer_devis_pdf(request,response)
{
    if(request.session.connected==true)
        {
            var id = request.query.id;
sql.query("select d.date, d.id as id, c.nom , c.prenom from client c, devis d where c.id_client = d.id_client and d.id = '"+id+"'",(err,resd) =>{
    if(err)
    {
        console.log(err);
    }else{
        console.log(resd[0]);
        sql.query("select p.nom, p.prix ,pd.quantite, p.prix * 18/100 as val_tax , p.prix*p.pourcent_reduction_promo/100 as remise, p.pourcent_reduction_promo as pr  from produit p, produit_devis pd where p.id_produit = pd.id_produit and pd.id_devis = '"+id+"'",(err,resp) =>{
            if(err)
            {
                console.log(err);
            }else{
             console.log(resp);

             function formatCurrency(value) {
                return value;
              }
              
             
              
              // Créer un document PDF
              const doc = new PDFDocument({ margin: 50 });
              const filePath = 'controllers/public/devis.pdf';
              const stream = fs.createWriteStream(filePath);
              doc.pipe(stream);
              
              // Ajouter le logo et les informations de l'entreprise dans un rectangle
              doc.roundedRect(50, 50, 500, 150,10)
                  .fill('#ADD8E6')
                  .fillColor('#000000') // Rectangle pour contenir les informations de l'entreprise
                 .stroke();
                 
              doc.image('controllers/public/logo.png', 60, 60, { width: 100 }) // Ajouter le logo
                 .fontSize(12)
                 .text('NETSYSTEME', 178, 80) // Nom de l'entreprise
                 .text('Adresse: Ouest Foire, route de l\'aéroport', 178, 100)
                 .text('Téléphone: 0123456789', 178, 120)
                 .text('spécialisée dans les domaines des systèmes d’information, du développement informatique, des réseaux et des télécommunications', 178, 140);
              
              // Tableau avec le nom du client
              doc.rect(50, 226, 200, 20)
              .stroke();

              doc.moveDown(4)
                 .fontSize(12)
                 .text('DEVIS : '+resd[0].id, 54, 232);
              
              // Bordures pour le tableau du client
              doc.rect(50, 250, 200, 20)
              .fill('#ADD8E6')
              .fillColor('#000000')
              .stroke(); // Bordure du tableau
              doc.text('Client : '+resd[0].prenom+' '+resd[0].nom, 55, 255); // Contenu de la ligne
              
              // Ajouter un tableau pour les services avec des bordures
              doc.moveDown(2)
                 .fontSize(12)
                 .text('Date : '+resd[0].date, 50, 280);
              
              // En-tête du tableau des services avec bordures
              doc.rect(50, 300, 500, 20)
              .fill('#ADD8E6')
              .fillColor('#000000')
              .stroke(); // Bordure de l'en-tête
              doc.text('Produit', 55, 305)
                 .text('Quantité', 170, 305)
                 .text('P. unitaire', 260, 305)
                 .text('Remise', 370, 305)
                 .text('Total HT  tva(18%)', 450, 305);
              
              // Exemple de données pour les services
              const services = resp;
              
              let totalHT = 0, totalRemise = 0, totalTTC = 0;
              
              // Ajouter les services dans le tableau avec des bordures
              services.forEach((service, index) => {
                const yPosition = 330 + index * 25;
                totalHT += service.prix * service.quantite;
                totalRemise += service.remise*service.quantite;
                totalTTC += (service.prix + service.val_tax - service.remise)*service.quantite;;
                var totalproduitHT = service.prix*service.quantite - service.remise*service.quantite;
              
                // Bordures autour de chaque ligne du tableau des services
                doc.rect(50, yPosition, 500, 20)
                .fill('#FFB6C1')
                .fillColor('#000000')
                .stroke();
              
                doc.text(service.nom, 55, yPosition + 5)
                   .text(service.quantite, 170, yPosition + 5)
                   .text(formatCurrency(service.prix.toFixed(2))+' Fcfa', 260, yPosition + 5)
                   .text(`-${formatCurrency(service.pr)+' %'}`, 370, yPosition + 5)
                   .text(formatCurrency(totalproduitHT.toFixed(2))+' Fcfa', 450, yPosition + 5);
              });
              
              // Tableau pour les totaux avec bordure
              var y = 340 + services.length*25;
              // Bordures pour les totaux
              doc.rect(50, y+7, 200, 20)
              .fill('#ADD8E6')
              .fillColor('#000000')
              .stroke(); // Total HT
              doc.rect(50, y+27, 200, 20)
              .fill('#FFB6C1')
              .fillColor('#000000')
              .stroke(); // Total Remise
             
              doc.rect(50, y+47, 200, 20)
              .fill('#ADD8E6')
              .fillColor('#000000')
              
              // Texte des totaux
              doc.fontSize(12)
                 .text('Total HT:', 55, y+10)
                 .text(formatCurrency(totalHT.toFixed(2))+' Fcfa', 150, y+10, { align: '' });
              
                 doc.text('Total Remise:', 55, y+30)
                 .text(`${formatCurrency(totalRemise.toFixed(2))+' Fcfa'}`, 150, y+30, { align: '' });
              

              doc.text('Total TTC:', 55, y+50)
                 .text(`${formatCurrency(totalTTC.toFixed(2))+' Fcfa'}`, 150, y+50, { align: '' });
              
            
              // Terminer le document
              doc.end();
              
              // Lorsque le fichier est prêt, l'enregistrer
              stream.on('finish', () => {
                console.log('Le devis a été généré avec succès.');
              });
        response.render("devis/devis_pdf",
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


modifier_devis_form(request,response)
{
   
    if(request.session.connected==true)
        {
            var id = request.query.id;

            sql.query("select d.id, d.tva, d.remise, c.id_client, c.prenom, c.nom from devis d, client c where d.id_client = c.id_client and d.id= '"+id+"' ",(err,resd) =>{
                if(err)
                {
                   console.log(err)
                }else{
                 console.log(resd[0]);
                    sql.query("select nom, prenom, id_client from client",(err,resc) =>{
                        if(err)
                        {
                           console.log(err)
                        }else{
                         
                          
                    
                            sql.query("select nom, id_produit from produit",(err,resp) =>{
                                if(err)
                                {
                                   console.log(err)
                                }else{
                                 
                                  
                                    sql.query("select p.nom, pd.quantite from produit p, produit_devis pd, devis d where pd.id_produit = p.id_produit and pd.id_devis = d.id and d.id = '"+id+"'",(err,res) =>{
                                        if(err)
                                        {
                                           console.log(err)
                                        }else{
                                         
                                         
                                    
                                          response.render("devis/modifier_devis_form",
                                            {
                                                nom : request.session.nom,
                                                devis : resd[0],
                                                produits : resp,
                                                pd: res,
                                                clients : resc
            
                                            }
                                        )
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

    
}

c = new controller();
module.exports=c;
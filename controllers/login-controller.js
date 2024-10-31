const sql = require("./../Database/db.js");

const bcrypt = require("bcrypt")

class controller{

    constructor(){}


verifyLogin(request,response,email,password)
{
   
    sql.query("select * from users where email='"+email+"'", (error,result) => {
if(error){
    console.log(error)
    return response.render('login', {
        message: 'il y a eu une erreur, veuillez réessayez plutard !'
    })

}else{
if(result.length==0){
    return response.render('login', {
        message: 'incorrect email'
    })
}else{

    bcrypt.compare(password, result[0].password, (error, res) => {
        if (error) {
            console.error('Error: ', error);
        } else {
            if(res==true){
                // true or false
                request.session.connected=true;
                
                request.session.nom=result[0].prenom;
                return response.redirect("loggedIn")
               
        }else
    {
        return response.render('login', {
            message: 'incorrect password'
        })
    }}
    });
   
}
}
    })

}

register(request,response,email,password, nom,prenom)
{
    if(request.session.connected == true)
    {
    sql.query("select * from users where email='"+email+"'", (err,res) =>{
        if(err)
        {
            console.log(err);
        }else
        if(res.length>=1)
        {
                return response.render('ajouter-utilisateur-form', {
                    message: 'cet email a déjà un compte',
                    nom : request.session.nom
                })
        }
    })

    bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in your password DB.
   
    sql.query("insert into users (nom,prenom,password,email) values ('"+nom+"','"+prenom+"','"+hash+"','"+email+"')",(error,result) => {
        if(error)
        {
        console.log(error);
        return response.render('ajouter-utilisateur-form', {
            message: 'y a une erreur, reéssayez plutard',
            nom : request.session.nom
        })
        }
        else{
            return response.render('ajouter-utilisateur-form', {
                message: 'l\'utilisateur a été ajouté!',
                nom : request.session.nom
            })
        }


    })
});
    }else{
        response.render("login");
    }
}

}

c = new controller();
module.exports=c;
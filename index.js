const express = require("express");
const fs = require("fs");
const path= require("path");
const sharp=require("sharp");
const sass=require('sass');
const ejs=require('ejs');
const {Client}=require('pg');

var client= new Client({database:"proiect_web",
        user:"gioni",
        password:"123456",
        host:"localhost",
        port:5432});
client.connect();
client.query("select * from lab8_10", function(err,rez){
    console.log("eroare bd",err);
    console.log("rezultat bd",rez)
})



app= express();

client.query("select * from unnest(enum_range(null::tipuri_produse))",function(err, rezTipuri){
    if(err)
        console.log(err)
    else
        obGlobal.optiuniMeniu=rezTipuri.rows;
})

obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname,"backup"),
    optiuniMeniu:[]

}

console.log("Folder proiect", __dirname);
console.log("Cale fisier",__filename);
console.log("Director de lucru",process.cwd());


function compileazaScss(caleScss,caleCss){
    if(!caleCss){
        let nume_fis_ext=path.basename(caleScss)
        let nume_fis=nume_fis_ext.split(".")[0]
        caleCss=nume_fis+".css";
    }
    if(!path.isAbsolute(caleScss))
    {
        caleScss=path.join(obGlobal.folderScss,caleScss)
    }
    if(!path.isAbsolute(caleCss))
    {
        caleCss=path.join(obGlobal.folderCss,caleCss)
    }
    //la acest punct avem cai absolute in folder caleScss si caleCss
    let caleResBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if(!fs.existsSync(caleResBackup))
        fs.mkdirSync(caleResBackup,{recursive:true})
    let numeFisCss= path.basename(caleCss)
    if(fs.existsSync(caleCss))
        {
            fs.copyFileSync(caleCss,path.join(obGlobal.folderBackup,"resurse/css",numeFisCss))
        }

    rez=sass.compile(caleScss,{"sourceMap":true})
    fs.writeFileSync(caleCss,rez.css)
    console.log("compilare scss",rez)
}
compileazaScss("a.scss")
vFisiere=fs.readdirSync(obGlobal.folderScss)
console.log(vFisiere)
for(let numeFis of vFisiere){
    if(path.extname(numeFis)==".scss")
    {
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss,function(eveniment,NumeFis){
    console.log(eveniment,numeFis)
    if(eveniment=="change" || eveniment=="rename")
    {
        let caleCompleta=path.join(obGlobal.folderScss,numeFis);
        if(fs.existsSync(caleCompleta))
            {
                compileazaScss(caleCompleta);
            }
    }
})

vectorFoldere=["temp","temp1","backup"]
for(let folder of vectorFoldere)
{
    let caleFolder=path.join(__dirname, folder)
    if(!fs.existsSync(caleFolder))
    {
        fs.mkdirSync(caleFolder);
    }
}


app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse")); /*trim toate fisierele statice din resurse*/
app.use("/node_modules", express.static(__dirname+"/node_modules"));

app.use("/*",function(req,res,next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    next();
})
app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/,function(req,res){
    afisareEroare(res,{_identificator:403}); // et 4
})


app.get("/favicon.ico",function (req,res)
{
    res.sendFile(__dirname+"/resurse/imagini/favicon/favicon.ico"); /* et4*/
})


app.get("/ceva", function(req, res){
    console.log("cale:",req.url)
    res.send("<h1>altceva</h1> ip:"+req.ip);
})

app.get(["/index","/home","/","/acasa"], function(req, res){
    
    res.render("pagini/index", {ip: req.ip, imagini:obGlobal.obImagini.imagini});
})
app.get("/*.ejs",function(req,res)
{
    afisareEroare(res,{_identificator:400});
})


app.get("/contact", function(req, res){
    
    res.render("pagini/contact", {ip: req.ip});
})
function initializeazaErori(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8");
    var obErori=JSON.parse(continut);
    // for(let i=0; i < obErori.info_erori.length; i++)
    // {

    // }
    for(let eroare of obErori.info_erori){//eroare e pe rand fiecare el al vectorului
        eroare.imagine="/"+obErori.cale_baza+"/"+eroare.imagine; //toate ./resurse se transf. in /resurse
    }
    obGlobal.obErori=obErori;

}

initializeazaErori();

//-------------------------------------------------PRODUSE------------------------------------------------
app.get("/produse",function(req, res){


    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura

    client.query("select * from unnest(enum_range(null::categ_prajitura))",function(err, rezCategorie){
        // console.log(err);
        // console.log(rez);
        let conditieWhere=""
        if(req.query.tip)
            conditieWhere=`where tip_produs='${req.query.tip}'`

        client.query("select * from prajituri "+conditieWhere , function( err, rez){
            console.log(300)
            if(err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else
                res.render("pagini/produse", {produse:rez.rows, optiuni:rezCategorie.rows});
        });
    })

    


});


app.get("/produs/:id",function(req, res){
    console.log(req.params);
   
    client.query(`select * from prajituri where id=${req.params.id}`, function(err, rezultat){
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});


app.get("/*",function(req, res){
    try{res.render("pagini"+req.url, function(err, rezRandare){
        if(err){
            console.log(err);
            if(err.message.startsWith("Failed to lookup view"))
                afisareEroare(res,{_identificator:404});
            else
                afisareEroare(res);
        }
        else{
            console.log(rezRandare);
            res.send(rezRandare);
        }
    } );
        }
        catch (err)
        {
            console.log(err);
            if(err.message.startsWith("Cannot find module"))
            {
                afisareEroare(res,{_identificator:400});
            }
        }
 
});



function afisareEroare(res, {_identificator, _titlu, _text, _imagine}={}){
    let vErori=obGlobal.obErori.info_erori;
    let eroare=vErori.find(function(elem) {return elem.identificator==_identificator;} )
    if(eroare){
        let titlu1= _titlu || eroare.titlu;
        //daca programatorul seteaza un titlu se ia cel din argument, daca nu se ia cel din json, 
        //daca nu avem titlu nici in json se ia titlul din valoarea default; idem pentru celelalte
        let text1= _text || eroare.text;
        let imagine1= _imagine || eroare.imagine;
        if(eroare.status)
            res.status(eroare.identificator).render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
        else
            res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
    }
    else{
        let errDef=obGlobal.obErori.eroare_default;
        res.render("pagini/eroare", {titlu:errDef.titlu, text:errDef.text, imagine:obGlobal.obErori.cale_baza+"/"+errDef.imagine});
    }
    

}

function initImagini(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");
    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleAbs=path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleMediu=path.join(caleAbs,"mediu")
    let caleMic=path.join(caleAbs,"mic")
    if(!fs.existsSync(caleMediu))
        fs.mkdirSync(caleMediu)
    if(!fs.existsSync(caleMic))
        fs.mkdirSync(caleMic)
    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier.split(".")
        let caleAbsFisier=path.join(caleAbs,imag.fisier);
        let caleAbsFisierMediu=path.join(caleMediu,numeFis)+".webp";
        let caleAbsFisierMic=path.join(caleMic,numeFis)+".webp"
        sharp(caleAbsFisier).resize(400).toFile(caleAbsFisierMediu)
        sharp(caleAbsFisier).resize(200).toFile(caleAbsFisierMic)
        imag.fisier_mediu="/"+path.join(obGlobal.obImagini.cale_galerie, "mediu", numeFis+".webp");
        imag.fisier_mic="/"+path.join(obGlobal.obImagini.cale_galerie, "mic", numeFis+".webp");
        imag.fisier="/"+obGlobal.obImagini.cale_galerie+"/"+imag.fisier;
    }
}
initImagini();



app.listen(8080);
console.log("Serverul a pornit");
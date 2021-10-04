const express = require('express');
const ObjectsToCsv = require('objects-to-csv')
const ftp = require('basic-ftp');
const cron = require('node-cron');
const mysql = require('mysql');
require('dotenv').config()
const http = require('http');


var server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  var message = 'It works!\n',
    version = 'NodeJS ' + process.versions.node + '\n',
    response = [message, version].join('\n');
  res.end(response);
});

cron.schedule('* * * * *', function () {
  let buildOption = []
  const con = mysql.createPool({
    host: process.env.DB_HOST_DOLIBARR,
    user: process.env.DB_USER_DOLIBARR,
    port: process.env.DB_DATABASE_PORT,
    password: process.env.DB_PASSWORD_DOLIBARR,
    database: process.env.DB_DATABASE_DOLIABRR
  });

  con.getConnection(async function (err) {
    if (err) {
      console.log("[mysql error]", err);
    } else {
      console.log("Connecté à la base de données MySQL!");
      await con.query("SELECT * FROM alpha_pneu", async function (err, rows) {
        if (err) {
          throw err
        } else {
          const client = new ftp.Client();
          client.ftp.verbose = true;
          const newCsv = []
          for (let i = 0; i < rows.length; i++) {
            var runflatOrNot = 0
            var typeCars = null
            var descTyre = null
            if (rows[i].p_ref === "2355018PI2713900") {
              rows[i].p_description = 'Tourisme'
              console.log(rows[i])
            }

            if (rows[i].p_description.includes("RUNFLAT")) {
              runflatOrNot = 1
              typeCars = 'Tourisme'
            } else if (rows[i].p_description.includes("4x4 RUNFLAT")) {
              runflatOrNot = 1
              typeCars = "4x4"
            } else if (rows[i].p_label.includes('SUV')) {
              typeCars = 'SUV'
            } else if (rows[i].p_label.startsWith('PM')) {
              typeCars = "MOTO"
            } else if (rows[i].p_description == "4 X 4") {
              typeCars = "4x4"
            } else {
              typeCars = rows[i].p_description
            }


            if (rows[i].extra_brand == "MINERVA") {
              descTyre = "Minerva est une marque privée belge qui a été fondée en 1992. Distribués à l'origine par le groupe allemand Continental, les pneus Minerva sont maintenant produits en Europe et en Asie. La qualité, la valeur et la constance sont les valeurs fondamentales de cette marque exclusive de Canada Tire. Offerts dans un large éventail de produits et de dimensions, les pneus Minerva répondent aux besoins du marché canadien en toutes saisons et pour de multiples usages. Avec plus de 1,5 million de pneus vendus par année, Minerva est une marque leader partout dans le monde et est vendue dans plus de 70 pays sur tous les continents. Autrefois la déesse des automobiles, la marque et le logo de Minerva étaient synonymes de luxe, de performance et de confort. Aujourd’hui, la marque est renommée pour ses pneus de qualité abordables vendus partout dans le monde."
            } else if (rows[i].extra_brand == "NEXEN") {
              descTyre = "Le Centre de R&D de NEXEN TIRE s’efforce de développer les technologies propres aux pneus du futur, afin de garantir une meilleure sécurité et des normes de confort supérieures pour tous."
            } else if (rows[i].extra_brand == "MICHELIN") {
              descTyre = "Michelin est un leader mondial de fabrication de pneumatiques. Ses produits sont destinés à tous types de véhicules : automobiles, camions, deux-roues,..."
            } else if (rows[i].extra_brand == "BRIDGESTONE") {
              descTyre = "Bridgestone propose des pneus d'ingénierie haut de gamme depuis près de 90 ans, permettant aux conducteurs de tous les types de véhicules de continuer, quoi qu'il arrive."
            } else if (rows[i].extra_brand == "CONTINENTAL") {
              descTyre = "Continental est un équipementier automobile qui affiche une philosophie haut de gamme exprimée avec talent à travers quatre domaines d’activités dynamiques. Il s’agit des tests sur les pneus, de l’équipement d’origine, du savoir-faire automobile et de l’ingénierie allemande."
            } else if (rows[i].extra_brand == "DUNLOP") {
              descTyre = "Depuis plus de 125 ans, Dunlop est animé par un engagement indéfectible envers la performance et l’innovation. Le fabricant sait ce que représente la conception et la fabrication de pneumatiques hautes et très hautes performances pour les passionnés de conduite automobile."
            } else if (rows[i].extra_brand == "ATLAS") {
              descTyre = "Les pneus Atlas sont fabriqués par l'un des plus grands fabricants de pneus au monde et ont passé toutes les certifications US DOT, ECE européenne et CCC, garantissant que les pneus Atlas sont fabriqués pour offrir une qualité, des performances et une durabilité supérieures."
            } else if (rows[i].extra_brand == "COOPER") {
              descTyre = "société américaine depuis 1914, Cooper cherche à fabriquer des pneus de qualité qui offrent une bonne performance et qui durent des milliers de kilomètres. Avec plus d’un siècle dans l’industrie des pneus, ils savent que les pneus sont importants dans le comportement du véhicule"
            } else if (rows[i].extra_brand == "DELINTE") {
              descTyre = ""
            } else if (rows[i].extra_brand == "DOUBLECOIN") {
              descTyre = "Double Coin est synonyme de performance, de qualité, de valeur exceptionnelle et de sécurité."
            } else if (rows[i].extra_brand == "FIRESTONE") {
              descTyre = "La Firestone Tire Company a été fondée sur la volonté d'offrir la qualité et le service nécessaires pour gagner la course, quelle que soit la course."
            } else if (rows[i].extra_brand == "GOODYEAR") {
              descTyre = "Les ingénieurs de Goodyear testent tous les nouveaux pneus sur plus de 50 critères de performance afin de garantir que chacun d'entre eux apporte une meilleure expérience de conduite."
            } else if (rows[i].extra_brand == "GRABBER") {
              descTyre = ""
            } else if (rows[i].extra_brand == "GREENMAX") {
              descTyre = ""
            } else if (rows[i].extra_brand == "HANKOOK") {
              descTyre = "Hankook s’engage activement sur la scène mondiale grâce à un développement technologique constant et à son engagement en faveur de l'innovation. Ils progressent vers une position de leader à l'échelle internationale qui propose des solutions durables afin d’offrir une satisfaction de conduite optimale à tous ses clients."
            } else if (rows[i].extra_brand == "KLEBER") {
              descTyre = ""
            } else if (rows[i].extra_brand == "KUMHO") {
              descTyre = "Kumho Tyre, traduit sa volonté d’être une entreprise éco-responsable en prenant l’initiative d’une gestion d’entreprise respectueuse de l’environnement, d’une fabrication de produits écologiques"
            } else if (rows[i].extra_brand == "LANDSAIL") {
              descTyre = "Le Landsail est un pneu moderne qui offre une qualité abordable.  Lors de la production des pneus Landsail, on utilise les technologies les plus récentes, ainsi ces pneus proviennent des chaînes de fabrication les plus modernes.  La composition en caoutchouc est un mélange équilibré de matières premières qui sont dans une large mesure déterminantes pour la qualité du produit final.  Les profils disponibles varient de simples mais efficaces à ingénieux et réfléchis et sont par conséquent d’une performance maximale."
            } else if (rows[i].extra_brand == "LEAO") {
              descTyre = "14ème manufacturier mondial, Leao Tire possède toute l’expérience, les compétences et les structures pour vous proposer des gammes de pneumatiques Ultra Hautes performance au rapport qualité/prix inégalable"
            } else if (rows[i].extra_brand == "LINGLONG") {
              descTyre = "Linglong Tire, est un fabricant de pneus spécialisé et à grande échelle axé sur la technologie avec des produits de premier plan tels que des pneus radiaux pour voitures de tourisme haute performance, des pneus radiaux pour camions légers, des dizaines de milliers de spécifications des pneus radiaux tout acier pour camions et autobus radiaux."
            } else if (rows[i].extra_brand == "MASTERSTEEL") {
              descTyre = "Mastersteel propose une large gamme de profils, de types et de dimensions pour tous les types de voitures particulières et de camionnettes, sans oublier les voitures sportives, les multisegments et les SUV."
            } else if (rows[i].extra_brand == "METZELER") {
              descTyre = ""
            } else if (rows[i].extra_brand == "NEOLIN") {
              descTyre = ""
            } else if (rows[i].extra_brand == "PETLAS") {
              descTyre = "Petlas est une marque mondiale ciblant les prochaines générations avec des produits et services technologiques dans une perspective de sécurité, de sensibilisation à l'environnement et d'économie."
            } else if (rows[i].extra_brand == "PIRELLI") {
              descTyre = "Pirelli est aujourd'hui une marque mondiale connue pour sa technologie de pointe, l'excellence de sa production haut de gamme et sa passion pour l'innovation qui s'appuie fortement sur ses racines italiennes."
            } else if (rows[i].extra_brand == "SAILUN") {
              descTyre = "Sailun Tyres s'est bâti une réputation enviable dans le monde entier en tant que fabricant et fournisseur de pneus économiques premium de haute qualité et d'un excellent rapport qualité-prix. Couvrant un certain nombre d'applications, Sailun fabrique des modèles de pneus basés sur la recherche pour chaque type d'utilisation quotidienne."
            } else if (rows[i].extra_brand == "ROADHOG") {
              descTyre = "La structure des pneus d’été Roadhog assure avec la composition du caoutchouc une expérience de conduite stable et fiable. Tous les pneus d’été de Roadhog se caractérisent par la structure spéciale des sculptures avec comme base des rainures continues en longueur. Cela assure une tenue de route optimale et une rapide évacuation de l’eau, ce qui réduit considérablement le risque d’aquaplanage. Les blocs de profil robustes qui continuent sur les flancs offrent un comportement stable, dans les virages comme lors des freinages d’urgence ou des manœuvres d’évitement. Les pneus Roadhog génèrent en toute circonstance et sur toutes les surfaces une adhérence optimale."
            } else if (rows[i].extra_brand == "TRISTAR") {
              descTyre = ""
            } else if (rows[i].extra_brand == "TOYO") {
              descTyre = "Présent dans plus de 100 pays, TOYO fait partie des manufacturiers les plus importants au monde. Fondé en 1945, le siège est basé à Osaka au Japon. Le groupe produit différentes pièces liées à la transformation du caoutchouc telles que les supports antisismiques ou pièces automobiles. La partie pneu représente 70% du chiffre d’affaires. Plus de 3 000 personnes travaillent afin de concevoir, développer, produire et distribuer les 35 millions de pneus produits dans les usines réparties dans le monde.            "
            } else if (rows[i].extra_brand == "UNIROYAL") {
              descTyre = ""
            } else if (rows[i].extra_brand == "VREDESTEIN") {
              descTyre = ""
            } else if (rows[i].extra_brand == "YOKOHAMA") {
              descTyre = "En mettant l'accent sur la production de produits de haute qualité pour améliorer la qualité de vie des personnes et des communautés dans lesquelles elle opère, la société japonaise de pneus premium YOKOHAMA utilise son vaste savoir-faire dans le monde des sports mécaniques, professionnels de haut niveau pour transmettre les avantages dont bénéficient normalement les héros de l'asphalte, des meilleurs championnats professionnels, aux utilisateurs normaux de voitures particulières"
            }

            if (typeCars != "MOTO") {

              newCsv.push(
                {
                  Product_Id: rows[i].p_rowid,
                  Model: rows[i].p_ref,
                  Name: rows[i].p_label,
                  Description: descTyre,
                  Meta_Description: "Pneus pas chers au meilleur prix, de la marque premium au budget",
                  Meta_Title: "Pneus pas chers île de la Réunion",
                  EAN: rows[i].p_barcode,
                  Subtract: 1,
                  Price: rows[i].p_price,
                  Quantity: rows[i].p_stock,
                  Main_Image: rows[i].p_url,
                  Image2: rows[i].extra_newlabel,
                  cat1: typeCars.toUpperCase(),
                  cat2: rows[i].p_note,
                  attGroup1: "Dimension",
                  attName1: "Largeur",
                  attValue1: rows[i].extra_width,
                  attGroup2: "Dimension",
                  attName2: "Hauteur",
                  attValue2: rows[i].extra_height,
                  attGroup3: "Dimension",
                  attName3: "Diamétre",
                  attValue3: rows[i].extra_rim,
                  attGroup4: "Dimension",
                  attName4: "Charge",
                  attValue4: rows[i].extra_loadindex,
                  attGroup5: "Dimension",
                  attName5: "Vitesse",
                  attValue5: rows[i].extra_speed,
                  tyre_width: rows[i].extra_width,
                  tyre_profile: rows[i].extra_height,
                  tyre_diametre: rows[i].extra_rim,
                  tyre_loadindex: rows[i].extra_loadindex,
                  tyre_speed: rows[i].extra_speed,
                  tyre_eco: rows[i].extra_RR,
                  tyre_disfr: rows[i].extra_WG,
                  tyre_runflat: runflatOrNot,
                  noiseDb: rows[i].extra_dB,
                  noiseLevel: rows[i].extra_W,
                  brand: rows[i].extra_brand,
                  shipping: 1,
                  status: 1,
                }
              )
            }

            buildOption.push(
              {
                productId: rows[i].p_rowid,

              },
              {
                optionName: "Ou voulez-vous retirer vos pneus ?",
                optionRequired : true, 
                optionType: "select",
                optionValue: "Pneus974"
              },
              {
                productId: "",
                optionName: "Ou voulez-vous retirer vos pneus ?",
                optionRequired : true, 
                optionType: "select",
                optionValue: "Auto-Comptoire Saint-Paul"
              },
              {
                productId: "",
                optionName: "Ou voulez-vous retirer vos pneus ?",
                optionRequired : true, 
                optionType: "select",
                optionValue: "Auto-Comptoire Saint-Leu"
              },
              {
                optionName: "?",
                optionRequired : true, 
                optionType: "select",
                optionValue: "Pneus974"
              },
              {
                productId: "",
                optionName: "Ou voulez-vous monter vos pneus ?",
                optionRequired : true, 
                optionType: "select",
                optionValue: "Auto-Comptoire Saint-Paul"
              },
              {
                productId: "",
                optionName: "Ou voulez-vous monter vos pneus ?",
                optionRequired : true, 
                optionType: "select",
                optionValue: "Auto-Comptoire Saint-Leu"
              },
            )
          }

<<<<<<< HEAD
=======
          // console.log(newCsv)
>>>>>>> 52248b49732ba91f146479a171cba47ed29a3bf8
          const csv = new ObjectsToCsv(newCsv)
          await csv.toDisk('./data/data.csv')
          try {
            await client.access({
              host: process.env.DB_HOST_FTP,
              port: process.env.DB_PORT_FTP,
              user: process.env.DB_USER_FTP,
              password: process.env.DB_PASSWORD_FTP,
            })
            console.log(await client.list());
            await client.uploadFromDir("./data/", "./")
          } catch (erro) {
            console.log(err)
          }
          await client.close()
          await con.end(function (err) {
            if (err) {
              return console.log(err.message)
            } else {
              console.log("connection terminé");
            }
          })
        }
      })
    }
  });
})

server.listen(process.env.PORT || 5000);

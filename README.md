Translator
============

Translator est un script qui permet de transformer un fichier csv vers un fichier json

# Required

- npm
- node

# Install

``` shell
npm install
```


# Example

Input (.csv)
````
"global.loading","Chargement","75"
"global.yes","Oui","75"
"global.no","Non","53"
"global.help","Aide","53"
"global.button.export.csv","Exporter en csv","53"
"global.search.no_results","Aucun résultat trouvé","53"
....
````

Output (.csv)
````
{
  "global": {
    "loading": "Chargement",
    "yes": "Oui",
    "no": "Non",
    "help": "Aide",
    "button": {
      "export": {
        "csv": "Exporter en csv"
      }
    },
    "search": {
      "no_results": "Aucun résultat trouvé"
    },
....
````


Ligne de commande qui permet d'avoir le help

````
node app.js create --help
````

Ligne de commande qui permet de lancer la generation d'un fichier JSON depuis un fichier CSV : 

````
node app.js create -i './mocks/translate_en_to_fr.csv' -o './mocks/data.json' -s 4  -l fr:53 en:75
````
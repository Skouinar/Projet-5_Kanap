//Modification de la balise title du navigateur cart --> Page Panier (plus compréhensible par l'utilisateur)
document.title = "Page Panier";

//Déclaration de la variable "productRegisterInLocalStorage" dans laquelle on met les keys et les values qui sont dans le local Storage
//JSON.parse -> Convertir les données au format JSON qui sont dans le localStorage en objet javascript
let productRegisterInLocalStorage = JSON.parse(localStorage.getItem("produit"));

//Sélection de la balise de la page product.html dans laquel on va insérer les produits et leurs infos
const productsPositionHtml = document.getElementById("cart__items");


//Déclaration des variables
let compositionProduitsPanier = [];
//On déclare nos variables globales pour pouvoir calculer la quantité total d'articles et le prix total du panier
let totalPrice = 0;  
let totalQuantity = 0;
let quantityProductPanier = 0;
let priceProductPanier = 0;
let totalProductPricePanier = 0;
let mesProduits = [];
const findProducts = 0;

//On déclare nos variables utilisées dans le fonction supprimer
let idDelete = 0;
let colorDelete = 0;

//On déclare nos variables utilisées pour la validation du panier
const boutonCommander = document.getElementById("order");
let errorFormulaireFirstName = true;
let errorFormulaireLastName = true;
let errorFormulaireAddress = true;
let errorFormulaireCity = true;
let errorFormulaireEmail = true;


//FONCTIONS
//Fonction Calcul de la quantité total d'articles dans le panier, au chargement de la page Panier.html 
function totalProductsQuantity(){
    totalQuantity += parseInt(quantityProductPanier);
    console.log("Total quantité panier",totalQuantity);
    document.getElementById("totalQuantity").innerText = totalQuantity;
}

//Fonction Calcul du montant total du panier, au chargement de la page Panier.html
function totalProductsPrice (){
// Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
    totalProductPricePanier = quantityProductPanier * priceProductPanier;
// Calcul du prix total du panier
    totalPrice += totalProductPricePanier;
    console.log("Total prix panier",totalPrice);
    document.getElementById("totalPrice").innerText = totalPrice; 
}
function totaux (){
    totalProductsQuantity();
    totalProductsPrice();
}

//Fonction Recalcul de la quantité total d'articles dans le panier, lors de la modification de la quantité ou de la suppression d'un article
function recalculTotalQuantity() {
    let newTotalQuantity = 0;
    for (const item of productRegisterInLocalStorage) {
    //On calcul le nombre de quantité total de produits dans le localStorage
        newTotalQuantity += parseInt(item.quantityProduct);
    }
        console.log("Nouvelle quantité totale panier",newTotalQuantity);
    //On affichage la nouvelle quantité totale de produits dans le html
    document.getElementById("totalQuantity").innerText = newTotalQuantity;
}

//Fonction Recalcul du montant total du panier, lors de la modification de la quantité ou de la suppression d'un article
function recalculTotalPrice() {
    let newTotalPrice = 0;
    //(1) On fait une boucle sur le productRegisterInLocalStorage et dans cette boucle, 
    for (const item of productRegisterInLocalStorage) {
        const idProductsLocalStorage = item.idProduct;
        const quantityProductsLocalStorage = item.quantityProduct;
        //(2) on vérifie si l'id correspond
        const findProducts = mesProduits.find((element) => element._id === idProductsLocalStorage);
            //console.log(findProducts);
        //(3) et si c'est le cas, on récupère le prix.
        if (findProducts) {
            const newTotalProductPricePanier = findProducts.price * quantityProductsLocalStorage;
            newTotalPrice += newTotalProductPricePanier;
                console.log("Nouveau prix total panier",newTotalPrice);
        }
    //On affichage le nouveau prix total du panier dans le html
    document.getElementById("totalPrice").innerText = newTotalPrice;
    } 
}

//Fonction Modifier la quantité d'un article du panier
let messageErrorQuantity = false;
function changeQuantity() {
    // On sélectionne l'élément html (input) dans lequel la quantité est modifiée
    let changeQuantity = document.querySelectorAll(".itemQuantity");
    changeQuantity.forEach((item) => {
        // On écoute le changement sur l'input "itemQuantity"
        item.addEventListener("change", (event) => {
            event.preventDefault();
            choiceQuantity = Number(item.value);
            // On pointe le parent hiérarchique <article> de l'input "itemQuantity"
            let myArticle = item.closest('article');
                //console.log(myArticle);
            // On récupère dans le localStorage l'élément (même id et même couleur) dont on veut modifier la quantité
            let selectMyArticleInLocalStorage = productRegisterInLocalStorage.find
            ( element => element.idProduct === myArticle.dataset.id && element.colorProduct === myArticle.dataset.color );
            
            // Si la quantité est comprise entre 1 et 100 et que c'est un nombre entier,...
            //...on met à jour la quantité dans le localStorage et le DOM
            if(choiceQuantity > 0 && choiceQuantity <= 100 && Number.isInteger(choiceQuantity)){
                parseChoiceQuantity = parseInt(choiceQuantity);
                selectMyArticleInLocalStorage.quantityProduct = parseChoiceQuantity;
                localStorage.setItem("produit", JSON.stringify(productRegisterInLocalStorage));
                // Et, on recalcule la quantité et le prix total du panier
                recalculTotalQuantity();
                recalculTotalPrice();
                messageErrorQuantity = false;
            }
            // Sinon, on remet dans le DOM la quantité indiquée dans le localStorage et on indique un message d'erreur
            else{
                item.value = selectMyArticleInLocalStorage.quantityProduct;
                messageErrorQuantity = true;
            }
            if(messageErrorQuantity){       
                alert("La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100 et être un nombre entier. Merci de rectifier la quantité choisie.");
            } 
        });
    });
}

//Fonction Suppression d'un article du panier
function deleteProduct() {
    let selectSupprimer = document.querySelectorAll(".deleteItem");
    selectSupprimer.forEach((selectSupprimer) => {
            selectSupprimer.addEventListener("click" , (event) => {
                event.preventDefault();
                            
                // On pointe le parent hiérarchique <article> du lien "supprimer"
                let myArticle = selectSupprimer.closest('article');
                console.log(myArticle);
                // on filtre les éléments du localStorage pour ne garder que ceux qui sont différents de l'élément qu'on supprime
                productRegisterInLocalStorage = productRegisterInLocalStorage.filter
                ( element => element.idProduct !== myArticle.dataset.id || element.colorProduct !== myArticle.dataset.color );
                
                // On met à jour le localStorage
                localStorage.setItem("produit", JSON.stringify(productRegisterInLocalStorage));
                
                //Alerte produit supprimé
                alert("Ce produit va être supprimé du panier.");
                 
                
                // On supprime physiquement la balise <article> du produit que l'on supprime depuis son parent, si elle existe
                if (myArticle.parentNode) {
                    myArticle.parentNode.removeChild(myArticle);
                }
                //Si, du coup, le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide)
                //on affiche "Le panier est vide"
                if(productRegisterInLocalStorage === null || productRegisterInLocalStorage.length === 0){
                    messagePanierVide();
                }
                else{
                // Et, on recalcule la quantité et le prix total du panier
                recalculTotalQuantity();
                recalculTotalPrice();
                }
            }); 
    })
}

//Fonction pour afficher la phrase "Le panier est vide !"
function messagePanierVide() {
    compositionProduitsPanier = 'Le panier est vide !';
    let newH2 = document.createElement('h2');
    productsPositionHtml.appendChild(newH2);
    newH2.innerText = compositionProduitsPanier;
    // On insère 0 dans le html pour la quantité et le prix du panier
    document.getElementById("totalQuantity").innerText = 0;
    document.getElementById("totalPrice").innerText = 0;
}
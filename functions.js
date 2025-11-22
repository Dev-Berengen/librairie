export const generateDialogHTML = (product) => {
  const link = product.liens && product.liens.toString().trim() !== "" ? product.liens : `./product.html?id=${product.id}`;
  return `
    <div class="product-page">
      <div class="gauche">
        <img src="${product.img}" alt="Image de ${product.nom}"/>
      </div>
      <div class="droite">
        <div class="titre">
          <h1>${product.nom}</h1>
        </div>
        <p class="description">
         <h4> ${product.description}</h4>
        </p>
        <div class="prix"> <h4> ${product.prix}</h4></div>
        </div>
        
        <div class="footer">
          <button class="send-whatsapp" data-product-link="${link}" data-product-name="${product.nom}" title="Envoyer par WhatsApp">
            <i class="fa-brands fa-whatsapp"></i>
            <p>commander</p>
          </button>
        </div>
      </div>
    </div>
    <div class="accessoire">
      <div class="avantages">
        <div class="carte-service">
          <div class="icone">
            <i class="fa-solid fa-cart-arrow-down"></i>
          </div>
          <p>Pré-commande</p>
        </div>
        <div class="carte-service">
          <div class="icone">
           <i class="fa-solid fa-truck"></i> 
          </div>
          <p>Livraison disponible</p>
        </div>
        <div class="carte-service">
          <div class="icone">
            <i class="fa-solid fa-credit-card"></i>
          </div>
          <p>Paiement à la livraison</p>
        </div>
      </div>
    </div>
    `;
};

// On crée une fonction qui va nous permettre de générer le HTML pour chaque produit
export function generateProductHTML(product) {
  const link = product.liens && product.liens.toString().trim() !== "" ? product.liens : `./product.html?id=${product.id}`;
  return `
    <div class="img">
      <img src='${product.img}' alt="${product.nom}" />  
    </div>
    <div class="text">
      <p class="nom">Stock: ${product.stock}</p>
      <h3>${product.nom}</h3>
    </div>
    <div class="footer">
      <div class="prix">
        <p class="prix-actuel">${product.prix}</p>
      </div>
    </div>
    `;
}

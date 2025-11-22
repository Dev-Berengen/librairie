// Section des Articles
// Use relative imports so modules load correctly in the browser when
// `index.js` is included as a module in the HTML page.
import { data } from "./data.js";
import { generateDialogHTML, generateProductHTML } from "./functions.js";

// selection des elements
const productsContainer = document.querySelector(".produits");
const dialog = document.querySelector("dialog");
const cartNumber = document.querySelector(".nombre");

let currentItem = null;

// Items in cart
let cartItems = [];
// cartNumber.textContent = cartItems.length;
let produitAffciher = data;

// Code pour looper entre différents produits et les afficher

const afficherProduit = (produits) => {
  produits.forEach((product) => {
    const productHTML = document.createElement("div");
    productHTML.classList.add("carte-produit");
    //Ajout de l'id pour identifier chaque produit cliqué
    productHTML.setAttribute("data-id", product.id);
    productHTML.innerHTML = generateProductHTML(product);
    productsContainer.appendChild(productHTML);
  });
};

afficherProduit(produitAffciher);

// Recherche des produits
const input = document.querySelector(".recherche");
input.addEventListener("keyup", (e) => {
  console.log(e.target.value);
	const query = (e.target.value || "").toLocaleLowerCase().trim();
	const resultat = data.filter((p) =>
		(p.nom || "").toLocaleLowerCase().includes(query)
	);
  productsContainer.innerHTML = "";
  if (resultat.length > 0) {
    afficherProduit(resultat);
    actionProduit();
  } else {
    const vide = document.createElement("h3");
    vide.textContent = "Aucun produit trouvé";
    productsContainer.appendChild(vide);
  }
});

const actionProduit = () => {
  // Ajout de l'action pour afficher la boite de dialogue
  const cards = document.querySelectorAll(".carte-produit");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Selection des elements
      const dialog = document.querySelector("dialog");
      

      // Effacer le contenu d'avant
      const dialogContent = document.querySelector(".dialog-menu");

      dialogContent && dialogContent.remove();
      dialog.showModal();
      dialog.scrollTo(0, 0);
      const section = document.createElement("section");
      section.classList.add("dialog-menu");
      currentItem = data.filter((i) => i.id == card.dataset.id)[0];
      section.innerHTML = generateDialogHTML(currentItem);
      dialog.appendChild(section);

      // Rendre le bouton "commander" cliquable pour ouvrir le lien du produit
      const btnAdd = dialog.querySelector('.ajouter');
      if (btnAdd) {
        btnAdd.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const link = currentItem.liens && currentItem.liens.toString().trim() !== ''
            ? currentItem.liens
            : `./product.html?id=${currentItem.id}`;
          // ouvrir dans un nouvel onglet
          window.open(link, '_blank', 'noopener');
        });
      }

      // Envoyer le lien du produit via WhatsApp au numéro spécifié
      const btnWhatsapp = dialog.querySelector('.send-whatsapp');
      if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const link = btnWhatsapp.getAttribute('data-product-link');
          const productName = btnWhatsapp.getAttribute('data-product-name');
          const phoneNumber = '22890381883'; // Numéro WhatsApp sans le +
          const message = `Bonjour, je suis intéressé par ce produit:\n${productName}\n\n${link}`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank', 'noopener');
        });
      }

    });
  });
};

actionProduit();
// Close popover
const btnClose = document.querySelector(".close");
btnClose.addEventListener("click", () => {
  dialog.close();
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('header[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// PWA install prompt handling (Add to Home Screen)
let deferredInstallPrompt = null;
const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');
const installDismiss = document.getElementById('install-dismiss');

console.log('PWA Install: Elements found', { installBanner: !!installBanner, installBtn: !!installBtn, installDismiss: !!installDismiss });

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event triggered');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  deferredInstallPrompt = e;
  // Show our custom install banner
  if (installBanner) {
    installBanner.style.display = 'flex';
    console.log('Install banner shown');
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    console.log('Install button clicked', deferredInstallPrompt);
    if (!deferredInstallPrompt) {
      console.warn('deferredInstallPrompt is null');
      return;
    }
    try {
      // Show native prompt
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      console.log('User choice result:', choiceResult);
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
    deferredInstallPrompt = null;
    if (installBanner) installBanner.style.display = 'none';
  });
}

if (installDismiss) {
  installDismiss.addEventListener('click', () => {
    console.log('Dismiss button clicked');
    if (installBanner) installBanner.style.display = 'none';
  });
}

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  if (installBanner) installBanner.style.display = 'none';
});



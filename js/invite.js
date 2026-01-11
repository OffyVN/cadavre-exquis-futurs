/**
 * Cadavre Exquis des Futurs — Invite Page
 * Gestion du système d'invitation personnalisée
 */

let currentInvite = null;

/**
 * Initialisation au chargement
 */
document.addEventListener('DOMContentLoaded', initInvitePage);

/**
 * Initialise la page d'invitation
 */
async function initInvitePage() {
    const token = getTokenFromURL();

    if (!token) {
        showView('error');
        return;
    }

    const invite = await loadInviteData(token);

    if (!invite) {
        showView('error');
        return;
    }

    currentInvite = invite;
    currentInvite.token = token;

    // Personnaliser le contenu
    personalizeContent(invite);

    // Vérifier si déjà soumis
    if (Storage.isSubmitted(token)) {
        showView('confirmation');
    } else {
        showView('landing');
    }

    // Initialiser le formulaire
    initForm(token);
}

/**
 * Extrait le token de l'URL
 */
function getTokenFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}

/**
 * Charge les données de l'invité
 */
async function loadInviteData(token) {
    try {
        const response = await fetch('data/invites.json');
        const invites = await response.json();
        return invites[token] || null;
    } catch (error) {
        console.error('Erreur chargement invitation:', error);
        return null;
    }
}

/**
 * Personnalise le contenu avec les données de l'invité
 */
function personalizeContent(invite) {
    // Greeting basé sur le genre
    const greeting = invite.gender === 'F'
        ? `Chère ${invite.firstName},`
        : `Cher ${invite.firstName},`;

    document.querySelectorAll('[data-personalize="greeting"]').forEach(el => {
        el.textContent = greeting;
    });

    document.querySelectorAll('[data-personalize="firstName"]').forEach(el => {
        el.textContent = invite.firstName;
    });

    // Adapter les accords selon le genre
    adaptTextToGender(invite.gender);

    // Adapter le texte tu/vous dans le message
    if (invite.formality === 'vous') {
        adaptTextToVous();
    }
}

/**
 * Adapte les textes selon le genre (supprime l'écriture inclusive)
 */
function adaptTextToGender(gender) {
    const isFemale = gender === 'F';

    // Mapping des accords
    const replacements = isFemale ? {
        'partant·e': 'partante',
        'curieux·se': 'curieuse',
        'réservé·e': 'réservée',
        'invité·e': 'invitée',
        'accueilli·e': 'accueillie',
        'jugé·e': 'jugée'
    } : {
        'partant·e': 'partant',
        'curieux·se': 'curieux',
        'réservé·e': 'réservé',
        'invité·e': 'invité',
        'accueilli·e': 'accueilli',
        'jugé·e': 'jugé'
    };

    // Appliquer les remplacements sur tous les textes du formulaire
    const elements = document.querySelectorAll('.form-option-text, .form-label, .invite-message p');
    elements.forEach(el => {
        let html = el.innerHTML;
        for (const [inclusive, gendered] of Object.entries(replacements)) {
            html = html.replace(new RegExp(inclusive, 'g'), gendered);
        }
        el.innerHTML = html;
    });
}

/**
 * Adapte les textes au vouvoiement
 */
function adaptTextToVous() {
    // Sélectionner les éléments de texte à adapter
    const messageEl = document.querySelector('.invite-message');
    if (messageEl) {
        messageEl.innerHTML = messageEl.innerHTML
            .replace(/Je t'écris/g, 'Je vous écris')
            .replace(/te proposer/g, 'vous proposer')
            .replace(/t'intéresser/g, 'vous intéresser')
            .replace(/de ton côté/g, 'de votre côté');
    }

    // Adapter les labels du formulaire (tu → vous)
    const formLabels = document.querySelectorAll('.form-label, .form-option-text');
    formLabels.forEach(el => {
        el.innerHTML = el.innerHTML
            .replace(/t'intrigue-t-il/g, 'vous intrigue-t-il')
            .replace(/Te sentirais-tu/g, 'Vous sentiriez-vous')
            .replace(/Ton ressenti/g, 'Votre ressenti')
            .replace(/tu arriveras/g, 'vous arriverez')
            .replace(/tu rejoindra/g, 'vous rejoindrez')
            .replace(/te rejoindre/g, 'vous rejoindre')
            .replace(/tu aurais/g, 'vous auriez')
            .replace(/te font/g, 'vous font')
            .replace(/tu le souhaites/g, 'vous le souhaitez')
            .replace(/Autorises-tu/g, 'Autorisez-vous');
    });
}

/**
 * Affiche une vue spécifique
 */
function showView(viewName) {
    document.querySelectorAll('[data-view]').forEach(el => {
        el.classList.remove('active');
    });

    const view = document.querySelector(`[data-view="${viewName}"]`);
    if (view) {
        view.classList.add('active');
    }
}

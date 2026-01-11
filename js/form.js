/**
 * Cadavre Exquis des Futurs — Form Logic
 * Gestion du formulaire d'invitation (sections A-E)
 * A: Intérêt & disponibilité
 * B: Confort avec le cadre
 * C: Affinités de chevauchement
 * D: Cartes / bascules
 * E: Flux financiers
 */

let formData = {};
let bascules = [];
let otherInvitees = [];
let currentToken = null;

/**
 * Initialise le formulaire
 */
async function initForm(token) {
    currentToken = token;

    // Charger les données
    await loadFormData();

    // Configurer les listeners
    setupFormListeners();

    // Charger une réponse existante si présente
    const savedResponse = Storage.loadResponse(token);
    if (savedResponse) {
        prefillForm(savedResponse);
    }
}

/**
 * Charge les données du formulaire (bascules, invités)
 */
async function loadFormData() {
    try {
        const response = await fetch('data/bascules.json');
        const data = await response.json();
        bascules = data.bascules || [];
        otherInvitees = data.otherInvitees || [];

        renderBascules();
        renderInvitees();
    } catch (error) {
        console.error('Erreur chargement données:', error);
        // Fallback avec données par défaut
        bascules = [
            { id: 'salariat', text: 'Le salariat devient minoritaire' },
            { id: 'passeport', text: 'Le passeport cesse d\'être central' },
            { id: 'refus-ia', text: 'Le droit de refuser l\'IA devient fondamental' }
        ];
        otherInvitees = ['Marie', 'Jean-Pierre', 'Sophie'];
        renderBascules();
        renderInvitees();
    }
}

/**
 * Affiche les bascules (section D1) — uniquement les "revealed" en matrice de cartes
 */
function renderBascules() {
    const container = document.getElementById('bascules-list');
    if (!container) return;

    // Filtrer uniquement les bascules révélées (avec image)
    const revealedBascules = bascules.filter(b => b.revealed && b.image);

    // Générer le HTML en matrice 2x3
    let html = '';
    revealedBascules.forEach(b => {
        html += `
        <div class="bascule-card" data-id="${b.id}" data-text="${b.text}" title="${b.text}">
            <input type="checkbox" name="D1" value="${b.id}" data-text="${b.text}" style="display: none;">
            <img src="${b.image}" alt="${b.categoryName}">
            <div class="bascule-card-overlay">
                <span class="bascule-card-check">✓</span>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    // Ajouter listeners pour sélection par clic sur carte
    container.querySelectorAll('.bascule-card').forEach(card => {
        card.addEventListener('click', () => {
            const checkbox = card.querySelector('input[name="D1"]');
            const checkedCount = container.querySelectorAll('input[name="D1"]:checked').length;

            // Si déjà 3 sélectionnées et on essaie d'en ajouter une autre
            if (!checkbox.checked && checkedCount >= 3) {
                // Faire clignoter la carte et ne pas sélectionner
                card.classList.add('bascule-card--shake');
                setTimeout(() => card.classList.remove('bascule-card--shake'), 500);
                return;
            }

            // Toggle la sélection
            checkbox.checked = !checkbox.checked;
            card.classList.toggle('bascule-card--selected', checkbox.checked);

            handleBasculeSelection();
        });
    });
}

/**
 * Affiche les autres invités (section C1)
 */
function renderInvitees() {
    const container = document.getElementById('invitees-list');
    if (!container) return;

    const inviteesHtml = otherInvitees.map(name => `
        <label class="form-option">
            <input type="checkbox" name="C1" value="${name}">
            <span class="form-option-text">${name}</span>
        </label>
    `).join('');

    container.innerHTML = inviteesHtml + `
        <label class="form-option">
            <input type="checkbox" name="C1" value="aucune">
            <span class="form-option-text">Aucune préférence</span>
        </label>
    `;
}

/**
 * Gère la sélection des bascules (max 3)
 */
function handleBasculeSelection() {
    const checkboxes = document.querySelectorAll('input[name="D1"]');
    const checked = document.querySelectorAll('input[name="D1"]:checked');

    // Désactiver les non-cochées si 3 sont sélectionnées
    if (checked.length >= 3) {
        checkboxes.forEach(cb => {
            if (!cb.checked) cb.disabled = true;
        });
    } else {
        checkboxes.forEach(cb => cb.disabled = false);
    }

    // Mettre à jour les réactions (D2)
    updateBasculeReactions(checked);

    // Auto-save
    autoSave();
}

/**
 * Met à jour les réactions par bascule (D2)
 */
function updateBasculeReactions(selectedCheckboxes) {
    const container = document.getElementById('bascule-reactions');
    const listContainer = document.getElementById('bascule-reactions-list');

    if (selectedCheckboxes.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    listContainer.innerHTML = Array.from(selectedCheckboxes).map(cb => {
        const id = cb.value;
        const text = cb.dataset.text;
        return `
            <div class="form-group" style="background: var(--color-bg-secondary); padding: var(--space-4); margin-bottom: var(--space-4);">
                <p class="form-label" style="font-size: var(--font-size-base);">${text}</p>
                <div class="form-options-grid" style="display: flex; flex-wrap: wrap; gap: var(--space-4);">
                    <label class="form-option">
                        <input type="radio" name="D2_${id}" value="probable">
                        <span class="form-option-text">Probable</span>
                    </label>
                    <label class="form-option">
                        <input type="radio" name="D2_${id}" value="souhaitable">
                        <span class="form-option-text">Souhaitable</span>
                    </label>
                    <label class="form-option">
                        <input type="radio" name="D2_${id}" value="les-deux">
                        <span class="form-option-text">Les deux</span>
                    </label>
                    <label class="form-option">
                        <input type="radio" name="D2_${id}" value="ni-lun-ni-lautre">
                        <span class="form-option-text">Ni l'un ni l'autre</span>
                    </label>
                </div>
            </div>
        `;
    }).join('');

    // Ajouter listeners pour auto-save
    listContainer.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', autoSave);
    });
}

/**
 * Configure les listeners du formulaire
 */
function setupFormListeners() {
    const form = document.getElementById('invite-form');
    if (!form) return;

    // E1 → E2/E3 conditionnels (Flux financiers)
    setupSectionEListeners();

    // Auto-save sur tous les champs
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('change', autoSave);
        if (input.tagName === 'TEXTAREA' || input.type === 'text') {
            input.addEventListener('input', debounce(autoSave, 500));
        }
    });

    // Soumission
    form.addEventListener('submit', handleSubmit);
}

/**
 * Configure les listeners pour la section E (champs conditionnels Flux financiers)
 */
function setupSectionEListeners() {
    const e1Radios = document.querySelectorAll('input[name="E1"]');
    const e2Group = document.getElementById('E2-group');
    const e3Group = document.getElementById('E3-group');

    if (!e1Radios.length || !e2Group || !e3Group) return;

    e1Radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const value = document.querySelector('input[name="E1"]:checked')?.value;

            // Afficher E2 si "tiers" sélectionné
            e2Group.style.display = value === 'tiers' ? 'block' : 'none';

            // Afficher E3 si "autre" sélectionné
            e3Group.style.display = value === 'autre' ? 'block' : 'none';

            autoSave();
        });
    });
}

/**
 * Auto-sauvegarde
 */
function autoSave() {
    if (!currentToken) return;

    const data = collectFormData();
    Storage.saveResponse(currentToken, data);
}

/**
 * Collecte les données du formulaire
 */
function collectFormData() {
    const form = document.getElementById('invite-form');
    if (!form) return {};

    const data = {
        A: {
            interest: form.querySelector('input[name="A1"]:checked')?.value || null,
            timeSlots: Array.from(form.querySelectorAll('input[name="A2"]:checked')).map(cb => cb.value),
            constraints: form.querySelector('#A3')?.value || ''
        },
        B: {
            comfortItems: Array.from(form.querySelectorAll('input[name="B1"]:checked')).map(cb => cb.value),
            overallFeeling: form.querySelector('input[name="B2"]:checked')?.value || null,
            vigilancePoint: form.querySelector('#B3')?.value || ''
        },
        C: {
            preferredCrossings: Array.from(form.querySelectorAll('input[name="C1"]:checked')).map(cb => cb.value),
            avoidCrossing: form.querySelector('#C2')?.value || ''
        },
        D: {
            selectedBascules: Array.from(form.querySelectorAll('input[name="D1"]:checked')).map(cb => cb.value),
            basculeReactions: {},
            proposedBascule: {
                category: form.querySelector('#D2-category')?.value || '',
                title: form.querySelector('#D2-title')?.value || '',
                concept: form.querySelector('#D2-concept')?.value || '',
                narrative: form.querySelector('#D2-narrative')?.value || ''
            }
        },
        E: {
            fluxChoice: form.querySelector('input[name="E1"]:checked')?.value || null,
            tiersDesignation: form.querySelector('#E2')?.value || '',
            autreExplication: form.querySelector('#E3')?.value || ''
        }
    };

    // Collecter les réactions D2
    data.D.selectedBascules.forEach(basculeId => {
        const reaction = form.querySelector(`input[name="D2_${basculeId}"]:checked`)?.value;
        if (reaction) {
            data.D.basculeReactions[basculeId] = reaction;
        }
    });

    return data;
}

/**
 * Pré-remplit le formulaire avec des données sauvegardées
 */
function prefillForm(savedData) {
    const form = document.getElementById('invite-form');
    if (!form || !savedData) return;

    // Section A
    if (savedData.A) {
        if (savedData.A.interest) {
            const radio = form.querySelector(`input[name="A1"][value="${savedData.A.interest}"]`);
            if (radio) radio.checked = true;
        }
        savedData.A.timeSlots?.forEach(slot => {
            const cb = form.querySelector(`input[name="A2"][value="${slot}"]`);
            if (cb) cb.checked = true;
        });
        if (savedData.A.constraints) {
            form.querySelector('#A3').value = savedData.A.constraints;
        }
    }

    // Section B
    if (savedData.B) {
        savedData.B.comfortItems?.forEach(item => {
            const cb = form.querySelector(`input[name="B1"][value="${item}"]`);
            if (cb) cb.checked = true;
        });
        if (savedData.B.overallFeeling) {
            const radio = form.querySelector(`input[name="B2"][value="${savedData.B.overallFeeling}"]`);
            if (radio) radio.checked = true;
        }
        if (savedData.B.vigilancePoint) {
            form.querySelector('#B3').value = savedData.B.vigilancePoint;
        }
    }

    // Section C
    if (savedData.C) {
        savedData.C.preferredCrossings?.forEach(name => {
            const cb = form.querySelector(`input[name="C1"][value="${name}"]`);
            if (cb) cb.checked = true;
        });
        if (savedData.C.avoidCrossing) {
            form.querySelector('#C2').value = savedData.C.avoidCrossing;
        }
    }

    // Section D
    if (savedData.D) {
        savedData.D.selectedBascules?.forEach(id => {
            const cb = form.querySelector(`input[name="D1"][value="${id}"]`);
            if (cb) {
                cb.checked = true;
                // Ajouter la classe de sélection à la carte parente
                const card = cb.closest('.bascule-card');
                if (card) card.classList.add('bascule-card--selected');
            }
        });
        // Déclencher la mise à jour des réactions
        handleBasculeSelection();

        // Remplir les réactions après un court délai (pour que le DOM soit prêt)
        setTimeout(() => {
            Object.entries(savedData.D.basculeReactions || {}).forEach(([basculeId, reaction]) => {
                const radio = form.querySelector(`input[name="D2_${basculeId}"][value="${reaction}"]`);
                if (radio) radio.checked = true;
            });
        }, 100);

        // Proposition de bascule
        if (savedData.D.proposedBascule) {
            const proposal = savedData.D.proposedBascule;
            if (proposal.category) {
                const select = form.querySelector('#D2-category');
                if (select) select.value = proposal.category;
            }
            if (proposal.title) {
                const input = form.querySelector('#D2-title');
                if (input) input.value = proposal.title;
            }
            if (proposal.concept) {
                const textarea = form.querySelector('#D2-concept');
                if (textarea) textarea.value = proposal.concept;
            }
            if (proposal.narrative) {
                const textarea = form.querySelector('#D2-narrative');
                if (textarea) textarea.value = proposal.narrative;
            }
        }
    }

    // Section E (Flux financiers)
    if (savedData.E) {
        if (savedData.E.fluxChoice) {
            const radio = form.querySelector(`input[name="E1"][value="${savedData.E.fluxChoice}"]`);
            if (radio) {
                radio.checked = true;
                // Afficher les champs conditionnels si nécessaire
                if (savedData.E.fluxChoice === 'tiers') {
                    document.getElementById('E2-group').style.display = 'block';
                } else if (savedData.E.fluxChoice === 'autre') {
                    document.getElementById('E3-group').style.display = 'block';
                }
            }
        }
        if (savedData.E.tiersDesignation) {
            const e2 = form.querySelector('#E2');
            if (e2) e2.value = savedData.E.tiersDesignation;
        }
        if (savedData.E.autreExplication) {
            const e3 = form.querySelector('#E3');
            if (e3) e3.value = savedData.E.autreExplication;
        }
    }
}

/**
 * Gère la soumission du formulaire
 */
function handleSubmit(e) {
    e.preventDefault();

    // Validation
    const form = document.getElementById('invite-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Collecter et soumettre
    const data = collectFormData();
    Storage.submitResponse(currentToken, data);

    // Afficher la confirmation
    showView('confirmation');
}

/**
 * Debounce helper
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

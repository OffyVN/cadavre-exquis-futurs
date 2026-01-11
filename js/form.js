/**
 * Cadavre Exquis des Futurs — Form Logic
 * Gestion du formulaire d'invitation (sections A-E)
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
 * Affiche les bascules (section D1) — uniquement les "revealed"
 */
function renderBascules() {
    const container = document.getElementById('bascules-list');
    if (!container) return;

    // Filtrer uniquement les bascules révélées
    const revealedBascules = bascules.filter(b => b.revealed);

    // Grouper par catégorie
    const byCategory = {};
    revealedBascules.forEach(b => {
        if (!byCategory[b.category]) {
            byCategory[b.category] = {
                name: b.categoryName,
                items: []
            };
        }
        byCategory[b.category].items.push(b);
    });

    // Générer le HTML par catégorie
    let html = '';
    Object.keys(byCategory).sort().forEach(catId => {
        const cat = byCategory[catId];
        html += `<div class="bascule-category" style="margin-bottom: var(--space-6);">
            <p class="form-hint" style="margin-bottom: var(--space-2); text-transform: uppercase; letter-spacing: 0.05em;">${cat.name}</p>`;
        cat.items.forEach(b => {
            html += `
            <label class="form-option">
                <input type="checkbox" name="D1" value="${b.id}" data-text="${b.text}">
                <span class="form-option-text">${b.text}</span>
            </label>`;
        });
        html += '</div>';
    });

    container.innerHTML = html;

    // Ajouter listeners pour max 3 sélections
    container.querySelectorAll('input[name="D1"]').forEach(input => {
        input.addEventListener('change', handleBasculeSelection);
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

    // D3 → D4 conditionnel
    const d3Input = document.getElementById('D3');
    const d4Group = document.getElementById('D4-group');

    if (d3Input && d4Group) {
        d3Input.addEventListener('input', () => {
            d4Group.style.display = d3Input.value.trim() ? 'block' : 'none';
            autoSave();
        });
    }

    // F1 → F2/F3 conditionnels
    setupSectionFListeners();

    // Auto-save sur tous les champs
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('change', autoSave);
        if (input.tagName === 'TEXTAREA' || input.type === 'text') {
            input.addEventListener('input', debounce(autoSave, 500));
        }
    });

    // Soumission
    form.addEventListener('submit', handleSubmit);
}

/**
 * Configure les listeners pour la section F (champs conditionnels)
 */
function setupSectionFListeners() {
    const f1Radios = document.querySelectorAll('input[name="F1"]');
    const f2Group = document.getElementById('F2-group');
    const f3Group = document.getElementById('F3-group');

    if (!f1Radios.length || !f2Group || !f3Group) return;

    f1Radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const value = document.querySelector('input[name="F1"]:checked')?.value;

            // Afficher F2 si "tiers" sélectionné
            f2Group.style.display = value === 'tiers' ? 'block' : 'none';

            // Afficher F3 si "autre" sélectionné
            f3Group.style.display = value === 'autre' ? 'block' : 'none';

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
            proposedBascule: form.querySelector('#D3')?.value || '',
            proposalConsent: form.querySelector('#D4')?.checked || false
        },
        E: {
            captureConsent: form.querySelector('input[name="E1"]:checked')?.value || null,
            citationConsent: form.querySelector('input[name="E2"]:checked')?.value || null
        },
        F: {
            fluxChoice: form.querySelector('input[name="F1"]:checked')?.value || null,
            tiersDesignation: form.querySelector('#F2')?.value || '',
            autreExplication: form.querySelector('#F3')?.value || ''
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

        if (savedData.D.proposedBascule) {
            form.querySelector('#D3').value = savedData.D.proposedBascule;
            document.getElementById('D4-group').style.display = 'block';
        }
        if (savedData.D.proposalConsent) {
            form.querySelector('#D4').checked = true;
        }
    }

    // Section E
    if (savedData.E) {
        if (savedData.E.captureConsent) {
            const radio = form.querySelector(`input[name="E1"][value="${savedData.E.captureConsent}"]`);
            if (radio) radio.checked = true;
        }
        if (savedData.E.citationConsent) {
            const radio = form.querySelector(`input[name="E2"][value="${savedData.E.citationConsent}"]`);
            if (radio) radio.checked = true;
        }
    }

    // Section F
    if (savedData.F) {
        if (savedData.F.fluxChoice) {
            const radio = form.querySelector(`input[name="F1"][value="${savedData.F.fluxChoice}"]`);
            if (radio) {
                radio.checked = true;
                // Afficher les champs conditionnels si nécessaire
                if (savedData.F.fluxChoice === 'tiers') {
                    document.getElementById('F2-group').style.display = 'block';
                } else if (savedData.F.fluxChoice === 'autre') {
                    document.getElementById('F3-group').style.display = 'block';
                }
            }
        }
        if (savedData.F.tiersDesignation) {
            const f2 = form.querySelector('#F2');
            if (f2) f2.value = savedData.F.tiersDesignation;
        }
        if (savedData.F.autreExplication) {
            const f3 = form.querySelector('#F3');
            if (f3) f3.value = savedData.F.autreExplication;
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

    // Validation D4 si D3 rempli
    const d3 = document.getElementById('D3');
    const d4 = document.getElementById('D4');
    if (d3?.value.trim() && !d4?.checked) {
        alert('Merci de cocher la case de consentement pour ta proposition de bascule.');
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

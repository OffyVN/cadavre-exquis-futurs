# Site — Cadavre Exquis des Futurs
## Spécifications complètes & contenus éditoriaux

---

## 0. Rôle du site

Le site a trois fonctions :
1. Présenter le dispositif sans le banaliser
2. Donner confiance aux invité·es très sollicité·es
3. Attirer le public sans transformer l’expérience en “événement promo”

Le site n’est pas un programme.
C’est un **dispositif narratif d’entrée dans l’œuvre**.

---

## 1. Arborescence

- /
  - Landing (accroche)
  - Concept
  - Le Jeu (règles)
  - Les Bascules (teaser)
  - Le rôle de l’IA
  - Assister à l’expérience
- /invite/{token}
  - Landing personnalisée
  - Formulaire
  - Merci / confirmation
- /admin (hors scope éditorial)

---

## 2. LANDING — Accroche

### Objectif
Créer intrigue + désir en moins de 10 secondes.

### Contenu (texte exact)

**Titre principal**
> 6 esprits.  
> 6 bascules.  
> 4 heures.  
>  
> Un futur qui se réécrit en direct.

**Sous-titre**
> Une expérience publique où l’on ne débat pas de l’avenir —  
> on le met en jeu.

**Texte court**
> Le *Cadavre Exquis des Futurs* est une œuvre conversationnelle vivante.  
> Des invité·es se relaient pour faire apparaître, transformer ou abandonner  
> des hypothèses radicales sur la société de demain.

**CTA**
- Comprendre le jeu
- Assister à l’expérience

---

## 3. PAGE — Le concept

### Titre
> Le principe

### Texte
> Un hôte reste assis.  
> Des invité·es se relaient.  
>  
> Toutes les 40 minutes, une nouvelle personne entre dans la conversation.  
> Chacune reste une heure.  
>  
> Il ne s’agit pas de débattre, mais de **faire circuler des hypothèses de rupture**  
> et d’observer ce qu’elles deviennent quand elles passent de main en main.

---

## 4. PAGE — Le jeu (règles)

### Titre
> Les règles du jeu

### Texte
> À tout moment, **six cartes de bascule** sont sur la table.  
> Pas plus. Pas moins.

### Règles listées
> Chaque invité·e :
> 1. hérite d’une carte défendue par la personne précédente  
> 2. met en crise une autre carte  
> 3. introduit une nouvelle hypothèse  
>  
> Les cartes peuvent être soutenues, transformées, abandonnées ou détruites.

### Phrase clé
> Personne ne maîtrise l’ensemble.  
> Le futur se fabrique par transmission imparfaite.

---

## 5. PAGE — Les bascules (teaser)

### Objectif
Donner un **avant-goût** sans révéler le réservoir complet.

### Titre
> De quoi parle-t-on ?

### Intro
> Ces hypothèses ne sont ni des prédictions, ni des promesses.  
> Ce sont des **points de bascule** mis volontairement sous tension.

### Exemples affichés (liste fixe, non exhaustive)
- Le salariat devient minoritaire  
- Le passeport cesse d’être central  
- Le droit de refuser l’IA devient fondamental  
- Les personnes morales actuelles deviennent obsolètes  
- La gouvernance multipartite devient obligatoire  

### Note
> Ces cartes évolueront pendant l’expérience.  
> Certaines disparaîtront. D’autres apparaîtront.

---

## 6. PAGE — Le rôle de l’IA

### Titre
> Le rôle de l’intelligence artificielle

### Texte principal
> L’IA n’est ni experte, ni arbitre.  
> Elle ne dit pas la vérité.

> Elle agit comme :
> – une mémoire  
> – un miroir  
> – un perturbateur narratif

### Fonctions possibles (selon configuration)
- synthèse déformante
- reformulation pour un enfant
- détection de tabous ou angles morts
- génération d’une une fictive du journal du 1er janvier 2036

### Disclaimer
> Les productions de l’IA ne sont jamais validées par les invité·es.

---

## 7. PAGE — Assister à l’expérience (public)

### Titre
> Assister à l’expérience

### Texte
> Vous pouvez entrer et sortir librement.  
> Écouter. Ressentir. Observer.

> Vous ne poserez pas de questions aux invité·es.  
> Mais vos mots, vos émotions et vos tensions nourriront le dispositif.

### CTA
- Je viens assister
- Être tenu·e informé·e

---

## 8. PAGE — Invitation personnalisée (/invite/{token})

### Accroche personnalisée
Exemples :

- VOUS :
> Cher·e {Prénom},

- TU :
> Salut {Prénom},

### Texte
> Je t’écris pour te proposer un format très particulier,  
> à la frontière entre conversation, œuvre collective et prospective.

> Avant d’aller plus loin, j’aimerais savoir si ce jeu pourrait t’intéresser  
> et si les contraintes logistiques sont compatibles de ton côté.

### Info clé
> Le formulaire suivant prend environ **5 minutes**.  
> Il ne vaut pas engagement définitif.

### CTA
- Répondre au formulaire

---

## 9. FORMULAIRE — Prompts exacts

### Section A — Intérêt & disponibilité

**A1**
> Le format t’intrigue-t-il ?

Options :
- Oui, partant·e
- Oui, curieux·se mais réservé·e
- Non, pas cette fois

**A2**
> Créneaux possibles (plusieurs choix, avec 2 options principales)

Options :
- Vendredi après-midi (plan A)
- Jeudi après-midi (Plan B)
- Les deux
- Jeudi matin
- Vendredi matin
- Samedi matin
- Samedi après-midi
- Je ne sais pas encore

**A3**
> Y a-t-il des contraintes importantes à connaître ?
(texte libre)

---

### Section B — Confort avec le cadre

**B1**
> Te sentirais-tu à l’aise avec les principes suivants ?

Checkbox :
- Défendre une hypothèse radicale
- Mettre en crise une hypothèse portée par quelqu’un d’autre (que tu ne connais pas)
- Laisser une idée m’échapper
- Être écouté par une IA

**B2**
> Ton ressenti global

Options :
- Oui, ça m’amuse
- Oui, avec un cadre clair
- Plutôt non

**B3**
> Point de vigilance éventuel
(texte libre)

---

### Section C — Affinités de chevauchement

**C1**
> Quand tu arriveras tu rejoindra un intervenant pendant 20 minutes, puis 20 minuts après son départ un autre intervenant va venir te rejoindre pour 20 minutes. Quels sont les croisements que tu aurais envie de vivre ?

Multi-select  
+ option “Aucune préférence”

**C2**
> Y a-t-il un croisement à éviter ?
(optionnel, admin only)

> NB : Nous envoyons ce formulaire en simultané à tout le monde, il nous est donc évidemment impossible de savoir qui sera vraiment là le jour J.

---

### Section D — Cartes / bascules

**D1**
> Parmi ces bascules, lesquelles te font le plus réagir ?
(max 3)

**D2**
> Pour chacune : est-ce souhaitable ou probable ?

Options :
- Probable
- Souhaitable
- Les deux
- Ni l’un ni l’autre

**D3**
> Si tu le souhaites, propose une bascule
(1 phrase maximum)

Placeholder :
> En 2036, …

**D4**
> J’accepte que cette proposition soit reformulée ou détruite sans attribution
(checkbox obligatoire si D3 rempli)

---

### Section E — Consentements

**E1**
> Autorises-tu la captation audio/vidéo ?
Options :
- Oui
- Oui, anonymisée
- Non

**E2**
> Autorises-tu l’utilisation de citations ?
Options :
- Oui, attribuées
- Oui, anonymes
- Non

---

## 10. PAGE — Merci / confirmation

### Texte
> Merci {Prénom}.

> Tes réponses ont bien été enregistrées.  
> Tu pourras les modifier via ce lien si nécessaire.

> Nous reviendrons vers toi une fois le montage confirmé.

---

## 11. Règles éditoriales globales

- Jamais de promesse de casting
- Jamais de classement
- Jamais de pression
- Toujours la possibilité de dire non
- Toujours un ton calme, précis, respectueux

Le site est la **première scène** de l’œuvre.
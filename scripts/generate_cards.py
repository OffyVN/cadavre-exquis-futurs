#!/usr/bin/env python3
"""
Génération des 24 cartes de bascule via DALL-E 3
Cadavre Exquis des Futurs

Usage:
    export OPENAI_API_KEY="sk-..."
    python3 generate_cards.py
"""

import os
import json
import time
import urllib.request
import urllib.error
from pathlib import Path

# Configuration
OUTPUT_DIR = Path(__file__).parent.parent / "assets" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Définition des 24 cartes avec textes complets
CARDS = [
    # ============================================
    # A) TRAVAIL & STATUTS — Bleu pétrole #1F3A3D
    # ============================================
    {
        "id": "A1-salariat",
        "category_label": "TRAVAIL & STATUTS",
        "title": "La Fin du Salariat Majoritaire",
        "text": "2036 : Le salariat devient minoritaire. Moins d'un actif sur deux dispose d'un contrat de travail classique.",
        "color": "Deep petrol blue (#1F3A3D)",
        "illustration": "An asymmetrical balance scale. On the high side, a small group of grey-suited office workers at desks. On the low side, a diverse crowd of freelancers connected by glowing digital lines, holding creative and technical tools."
    },
    {
        "id": "A2-cdi-critique",
        "category_label": "TRAVAIL & STATUTS",
        "title": "Le Sanctuaire du CDI",
        "text": "Le CDI devient un statut d'exception, réservé aux fonctions critiques : santé, énergie, sécurité.",
        "color": "Deep petrol blue (#1F3A3D)",
        "illustration": "A glowing energy shield protecting three icons beneath it: a medical cross, a lightning bolt, and a bridge. The area outside the shield is blurred and vulnerable."
    },
    {
        "id": "A3-metiers-dissous",
        "category_label": "TRAVAIL & STATUTS",
        "title": "L'Ère des Slashers",
        "text": "Les métiers se dissolvent. La norme est désormais le portefeuille de missions multi-collectifs.",
        "color": "Deep petrol blue (#1F3A3D) with orange accents",
        "illustration": "A central human figure whose shadow splits into four separate silhouettes performing different jobs: farming, coding, teaching, building. Dotted lines connect the shadows."
    },
    {
        "id": "A4-remuneration-scindee",
        "category_label": "TRAVAIL & STATUTS",
        "title": "Le Revenu Scindé",
        "text": "La rémunération se fragmente : un revenu de base local complété par le travail marchand.",
        "color": "Deep petrol blue (#1F3A3D) with gold accents",
        "illustration": "A digital wallet receiving two streams of light: one thick steady blue stream (base revenue) and one thinner fluctuating golden stream (missions)."
    },

    # ============================================
    # B) ENTREPRISE & PROPRIÉTÉ — Terracotta #C4725D
    # ============================================
    {
        "id": "B1-personne-morale",
        "category_label": "ENTREPRISE & PROPRIÉTÉ",
        "title": "La Personne Morale à Mission",
        "text": "L'activité bascule vers des structures à mission verrouillée : fondations et coopératives.",
        "color": "Terracotta rust (#C4725D) with muted green",
        "illustration": "A modern corporate building with massive organic tree roots as foundations spreading deep into the ground, forming a locked base."
    },
    {
        "id": "B2-gouvernance-multipartite",
        "category_label": "ENTREPRISE & PROPRIÉTÉ",
        "title": "La Gouvernance Partagée",
        "text": "Au-delà d'un seuil critique, la gestion devient obligatoirement multipartite.",
        "color": "Terracotta (#C4725D)",
        "illustration": "A circular conference table divided into three equal segments: employees, users, territory/trees. A central glowing gear connects all three."
    },
    {
        "id": "B3-droits-usage",
        "category_label": "ENTREPRISE & PROPRIÉTÉ",
        "title": "L'Économie de l'Usage",
        "text": "Recul de la propriété absolue. Le droit d'usage supplante la possession.",
        "color": "Terracotta (#C4725D)",
        "illustration": "A glowing skeleton key floating between a chain of hands passing it along, no hand gripping tightly. Dotted arrows show continuous sharing movement."
    },
    {
        "id": "B4-bilan-impact",
        "category_label": "ENTREPRISE & PROPRIÉTÉ",
        "title": "Le Bilan d'Impact Opposable",
        "text": "Les entreprises sont juridiquement responsables de leur écart systémique par rapport à leurs objectifs d'impact.",
        "color": "Terracotta rust (#C4725D) with green",
        "illustration": "A large old-fashioned legal stamp pressing onto a document with ecological graphs and leaf symbols. The stamp leaves a glowing mark of justice scales."
    },

    # ============================================
    # C) TERRITOIRES & PRODUCTION — Vert sauge #8FA39A
    # ============================================
    {
        "id": "C1-choc-filieres",
        "category_label": "TERRITOIRES & PRODUCTION",
        "title": "Le Choc Alimentaire",
        "text": "Mobilisation générale : 1 actif sur 10 travaille désormais dans la filière alimentaire.",
        "color": "Sage green (#8FA39A) with gold and earth tones",
        "illustration": "A human silhouette whose forearm morphs into wheat stalks, vegetables, and farming tools. Rich dark soil beneath."
    },
    {
        "id": "C2-quotas-carbone",
        "category_label": "TERRITOIRES & PRODUCTION",
        "title": "Le Quota Carbone Individuel",
        "text": "Mise en place de quotas carbone. Certaines consommations lointaines deviennent inaccessibles.",
        "color": "Sage green (#8FA39A) with grey",
        "illustration": "A futuristic credit card with a cloud icon and declining gauge bar showing carbon budget remaining instead of money."
    },
    {
        "id": "C3-transport-luxe",
        "category_label": "TERRITOIRES & PRODUCTION",
        "title": "La Règle des 1500 km",
        "text": "80% des biens du quotidien sont produits localement. Le transport longue distance est un luxe.",
        "color": "Sage green (#8FA39A)",
        "illustration": "An aerial map with a compass drawing a glowing green circle. Inside: factories, farms, houses connected. Outside: blurry and faded."
    },
    {
        "id": "C4-bioregions",
        "category_label": "TERRITOIRES & PRODUCTION",
        "title": "La Biorégion Souveraine",
        "text": "Les bassins de vie (eau, énergie) priment sur les découpages administratifs historiques.",
        "color": "Sage green (#8FA39A) with blue rivers",
        "illustration": "A map where borders follow glowing blue rivers, watersheds and mountains rather than straight political lines. Cities cluster around water."
    },

    # ============================================
    # D) IDENTITÉ & MOBILITÉ — Ocre #C9A66B
    # ============================================
    {
        "id": "D1-passeport",
        "category_label": "IDENTITÉ & MOBILITÉ",
        "title": "L'Identité Numérique de Confiance",
        "text": "Le passeport s'efface devant une identité numérique souveraine, pivot de l'accès aux droits.",
        "color": "Ochre mustard (#C9A66B) with faded blues",
        "illustration": "A large fingerprint where ridges are formed by glowing circuit board traces and microchips. A padlock integrated in the center."
    },
    {
        "id": "D2-citoyennete-multiple",
        "category_label": "IDENTITÉ & MOBILITÉ",
        "title": "La Citoyenneté Multi-Appartenance",
        "text": "La citoyenneté devient plurielle, avec des droits et devoirs différenciés selon vos appartenances.",
        "color": "Ochre (#C9A66B)",
        "illustration": "Three interlocking rings: one with cityscape icons, one with digital network nodes, one with rural landscape. They overlap forming a unified symbol."
    },
    {
        "id": "D3-frontieres-economiques",
        "category_label": "IDENTITÉ & MOBILITÉ",
        "title": "Le Mur Économique",
        "text": "Les frontières économiques explosent : taxe carbone et préférence régionale deviennent la norme.",
        "color": "Ochre (#C9A66B) with blue tones",
        "illustration": "A road blocked by a tall translucent shimmering energy wall. Floating on the wall: glowing symbols of percentages, coins, quota indicators."
    },
    {
        "id": "D4-mobilite-rare",
        "category_label": "IDENTITÉ & MOBILITÉ",
        "title": "La Fin du Tourisme de Masse",
        "text": "La mobilité internationale se raréfie. Le tourisme de masse est devenu socialement marginal.",
        "color": "Ochre (#C9A66B) with green",
        "illustration": "An abandoned airplane on an old runway, completely overgrown with climbing vines, tropical leaves and flowers. An ancient ruin reclaimed by nature."
    },

    # ============================================
    # E) DÉMOCRATIE & SOCIÉTÉ — Violet sourd #7D6B8A
    # ============================================
    {
        "id": "E1-populisme-securite",
        "category_label": "DÉMOCRATIE & SOCIÉTÉ",
        "title": "La Paix par la Sécurité Matérielle",
        "text": "Le populisme recule grâce à la garantie de sécurité matérielle pour tous.",
        "color": "Muted violet purple (#7D6B8A) with grey",
        "illustration": "A calm voting ballot box resting on a massive concrete foundation with carved icons: house, medical cross, wheat sheaf."
    },
    {
        "id": "E2-jurys-citoyens",
        "category_label": "DÉMOCRATIE & SOCIÉTÉ",
        "title": "La Délibération Continue",
        "text": "Le vote quinquennal est complété par des jurys citoyens permanents en délibération continue.",
        "color": "Muted violet (#7D6B8A)",
        "illustration": "An hourglass where the sand grains are tiny groups of people sitting in circles, debating. The flow is continuous and never-ending."
    },
    {
        "id": "E3-partis-coalitions",
        "category_label": "DÉMOCRATIE & SOCIÉTÉ",
        "title": "Les Coalitions Éphémères",
        "text": "Déclin des partis traditionnels au profit de coalitions thématiques temporaires.",
        "color": "Muted violet (#7D6B8A) with mixed colors",
        "illustration": "Colorful puzzle pieces flying together to form a temporary structure in the center, while others drift apart. Movement lines show assembly and dissolution."
    },
    {
        "id": "E4-polarisation-infrastructuree",
        "category_label": "DÉMOCRATIE & SOCIÉTÉ",
        "title": "Les Mondes Parallèles",
        "text": "Polarisation infrastructurée : nous vivons dans des économies culturelles et scolaires parallèles.",
        "color": "Muted violet (#7D6B8A)",
        "illustration": "Two cityscapes on parallel planes, overlapping but never touching, separated by a shimmering veil. One sleek and tech, one older and artisanal."
    },

    # ============================================
    # F) IA & COORDINATION — Gris acier #5A6570
    # ============================================
    {
        "id": "F1-agents-ia",
        "category_label": "IA & COORDINATION",
        "title": "L'Agent Personnel Délégué",
        "text": "Un tiers des tâches de coordination est délégué à des agents IA personnels.",
        "color": "Steel grey (#5A6570) with electric blue",
        "illustration": "A human hand signing a tablet. Next to it hovers a small friendly glowing orb with digital interface patterns, guiding the pen."
    },
    {
        "id": "F2-droit-refus-ia",
        "category_label": "IA & COORDINATION",
        "title": "Le Droit au Retrait Technologique",
        "text": "Droit de refuser l'IA : les services publics garantissent obligatoirement une voie humaine.",
        "color": "Steel grey (#5A6570)",
        "illustration": "A doorway with analog handle. Above it a sign showing a person icon and a crossed-out robot head, indicating human-only pathway."
    },
    {
        "id": "F3-tracabilite-contenu",
        "category_label": "IA & COORDINATION",
        "title": "La Traçabilité de l'Esprit",
        "text": "Label d'origine obligatoire pour tout contenu public : humain, IA ou mixte.",
        "color": "Steel grey (#5A6570) with blue and red accent",
        "illustration": "A stream of binary code flowing across a screen. A rustic old ink stamp pressed onto it showing certification marks for verified origin."
    },
    {
        "id": "F4-management-auditable",
        "category_label": "IA & COORDINATION",
        "title": "L'Algorithme Auditable",
        "text": "La gestion managériale devient un logiciel auditable. Chaque décision doit être explicable.",
        "color": "Steel grey (#5A6570) with transparent elements",
        "illustration": "A mechanical brain made of transparent gears, cogs and glass pipes. Light flows through pathways with indicators showing decision paths and audit trails."
    }
]


def generate_image(api_key: str, card: dict, index: int) -> str:
    """Génère une image pour une carte via DALL-E 3 (API directe)"""

    # Construire le prompt avec TOUS les textes explicites
    full_prompt = f"""Create a portrait A5 card design with ALL text elements visible and readable.

=== REQUIRED TEXT ON CARD (must appear exactly as written) ===
CATEGORY (small, top corner): "{card['category_label']}"
TITLE (large, bold, prominent): "{card['title']}"
DESCRIPTION (medium size, below illustration): "{card['text']}"

=== CARD LAYOUT ===
- Top left corner: Category label "{card['category_label']}" in small caps
- Top center: Large bold title "{card['title']}"
- Center: The illustration described below
- Bottom: Description text "{card['text']}"

=== ILLUSTRATION ===
{card['illustration']}

=== STYLE ===
- Retro-futuristic isometric illustration, clean lines, vintage infographic feel
- Dominant color palette: {card['color']}
- Background: Aged textured cream/off-white paper (#F5F5F2)
- Typography: Bold sans-serif for title, elegant serif for description
- The card should look like an official document from 2036
- All text must be in French and clearly legible
- Portrait orientation, A5 proportions
"""

    print(f"\n[{index+1}/24] Génération: {card['title']}")
    print(f"   ID: {card['id']}")
    print(f"   Couleur: {card['color']}")

    # Préparer la requête
    url = "https://api.openai.com/v1/images/generations"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    data = {
        "model": "dall-e-3",
        "prompt": full_prompt,
        "size": "1024x1792",
        "quality": "hd",
        "n": 1
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers=headers,
            method='POST'
        )

        with urllib.request.urlopen(req, timeout=180) as response:
            result = json.loads(response.read().decode('utf-8'))

        image_url = result['data'][0]['url']
        revised_prompt = result['data'][0].get('revised_prompt', '')

        # Télécharger l'image
        img_req = urllib.request.Request(image_url)
        with urllib.request.urlopen(img_req, timeout=60) as img_response:
            img_data = img_response.read()

        img_path = OUTPUT_DIR / f"{card['id']}.png"
        with open(img_path, 'wb') as f:
            f.write(img_data)

        print(f"   ✓ Sauvegardé: {img_path}")

        # Sauvegarder les métadonnées
        meta_path = OUTPUT_DIR / f"{card['id']}_meta.json"
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump({
                "id": card['id'],
                "category": card['category_label'],
                "title": card['title'],
                "text": card['text'],
                "color": card['color'],
                "original_prompt": full_prompt,
                "revised_prompt": revised_prompt,
                "image_path": str(img_path)
            }, f, ensure_ascii=False, indent=2)

        return str(img_path)

    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else str(e)
        print(f"   ✗ Erreur HTTP {e.code}: {error_body}")
        return None
    except Exception as e:
        print(f"   ✗ Erreur: {e}")
        return None


def main():
    # Vérifier la clé API
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Erreur: OPENAI_API_KEY non définie")
        print("Usage: export OPENAI_API_KEY='sk-...' && python3 generate_cards.py")
        return

    print("=" * 60)
    print("Génération des 24 cartes de bascule")
    print("Cadavre Exquis des Futurs — Horizon 2036")
    print("=" * 60)
    print(f"Dossier de sortie: {OUTPUT_DIR}")
    print("\nCouleurs par catégorie:")
    print("  A) Travail & statuts     → Bleu pétrole #1F3A3D")
    print("  B) Entreprise & propriété → Terracotta #C4725D")
    print("  C) Territoires & production → Vert sauge #8FA39A")
    print("  D) Identité & mobilité   → Ocre #C9A66B")
    print("  E) Démocratie & société  → Violet sourd #7D6B8A")
    print("  F) IA & coordination     → Gris acier #5A6570")

    results = []
    errors = []

    for i, card in enumerate(CARDS):
        result = generate_image(api_key, card, i)
        if result:
            results.append(card['id'])
        else:
            errors.append(card['id'])

        # Pause entre les requêtes pour éviter le rate limiting
        if i < len(CARDS) - 1:
            print("   Pause 3s...")
            time.sleep(3)

    # Résumé
    print("\n" + "=" * 60)
    print("RÉSUMÉ")
    print("=" * 60)
    print(f"Réussies: {len(results)}/24")
    if errors:
        print(f"Erreurs: {errors}")
    print(f"\nImages dans: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

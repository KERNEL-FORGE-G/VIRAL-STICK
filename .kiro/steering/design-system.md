---
inclusion: manual
---

# Viral Stick — Design System Reference
> Inspiré du style Duolingo — adapté avec le bleu comme couleur dominante

## Principe général
Design énergique, gamifié, fond blanc. Formes ultra-arrondies, boutons 3D pressables, compagnons comme illustrations centrales. Le **bleu ciel** (`#1cb0f6`) remplace le vert comme couleur d'action principale.

## Palette de couleurs

| Nom               | Valeur    | Rôle |
|-------------------|-----------|------|
| **Duo Blue**      | `#1cb0f6` | CTA principal, logos, headlines — signifier de l'action |
| **Duo Blue Dark** | `#1899d6` | Ombre des boutons primaires |
| **Duo Blue Light**| `#d0f0fd` | Fond teinté pour états actifs/survolés |
| Duo Green         | `#58cc02` | Succès, validation, badges positifs |
| Duo Green Dark    | `#3f8f01` | Ombre boutons success |
| Sunshine Yellow   | `#ffc700` | Illustrations, accents chaleureux |
| Grape Soda        | `#a570ff` | Illustrations, accents violets |
| Bubblegum Pink    | `#cc348d` | Illustrations, accents roses |
| Snow White        | `#ffffff` | Fond de page, surfaces cards |
| Cloud Gray        | `#e5e5e5` | Bordures, séparateurs |
| Silver            | `#afafaf` | Texte placeholder, états désactivés |
| Graphite          | `#777777` | Corps de texte secondaire |
| Charcoal          | `#4b4b4b` | Sous-titres, headlines secondaires |
| Almost Black      | `#3c3c3c` | Texte principal |

### Couleurs compagnons
| Compagnon | Couleur   |
|-----------|-----------|
| arch      | `#1cb0f6` (bleu) |
| art       | `#ffc700` (jaune) |
| bio       | `#a570ff` (violet) |
| data      | `#58cc02` (vert) |
| para      | `#ff9600` (orange) |
| secu      | `#cc348d` (rose) |
| ubu       | `#ce82ff` (lavande) |

## Typographie

### Titres — Fredoka One (substitut "feather")
- Poids : 700 / 900
- Tailles : 28px, 36px, 48px
- Line height : 1.2
- Letter spacing : -0.02em
- Rôle : Tous les titres d'écran et sections

### Corps — Nunito (substitut "din-round")
- Poids : 500 / 700 / 800
- Tailles : 12px, 13px, 14px, 15px, 16px
- Line height : 1.4–1.6
- Letter spacing : 0.3–0.5px
- Rôle : Tout le texte UI, boutons, corps

## Spacing (base 4px)
| Nom  | Valeur |
|------|--------|
| xs   | 8px    |
| sm   | 12px   |
| md   | 16px   |
| lg   | 24px   |
| xl   | 32px   |
| xxl  | 48px   |

## Border Radius
| Élément    | Valeur |
|------------|--------|
| Boutons    | 12px   |
| Inputs     | 12px   |
| Cards      | 16px   |
| Grandes sections | 20px |
| Pill/Badge | 9999px |

## Composants clés

### Bouton primaire (DuoButton)
- Background : `#1cb0f6` (Duo Blue)
- Ombre solide bas : `0 4px 0 #1899d6`
- Texte : blanc, fontWeight 800
- BorderRadius : 12px
- Padding : 14px 24px
- Au press : `translateY(4px)` + ombre = 0 (effet physique)

### Bouton secondaire/outline
- Background : transparent / blanc
- Border : 2px solid `#e5e5e5`
- Texte : `#1cb0f6`
- Même radius et padding

### Card
- Background : `#ffffff`
- Border : 2px solid `#e5e5e5`
- BorderRadius : 16px
- Box-shadow : `0 2px 0 #e5e5e5`
- Au hover : `translateY(-2px)` + `0 4px 0 #d0d0d0`

### Input
- Border : 2px solid `#e5e5e5`
- BorderRadius : 12px
- Au focus : border `#1cb0f6` + ring `rgba(28,176,246,0.15)`

### Badge/Tag
- Background : `#d0f0fd` (Duo Blue Light)
- Texte : `#1899d6`
- BorderRadius : 9999px
- FontWeight : 800
- Uppercase + letterSpacing

## Élévation
**Système intentionnellement plat.** La profondeur est créée UNIQUEMENT sur les boutons via une ombre solide en bas (effet bouton physique). Cards et containers restent plats sur le fond blanc.

## Compagnons
Les illustrations de compagnons sont **centrales** à chaque écran :
- Toujours présents comme ancre visuelle principale
- Fond circulaire coloré avec opacité 10-18%
- Taille minimum 80px dans les écrans, 48px dans les sélecteurs
- Animation `floatSoft` (translateY oscillant) quand `floating=true`
- Message bulle affiché en dessous

## Do's
- Utiliser `#1cb0f6` pour TOUS les CTA primaires
- BorderRadius 12px sur tous les éléments interactifs
- Fond `#ffffff` sur toute page/écran
- Toujours accompagner une section d'un compagnon
- Boutons pressables avec ombre solide bas

## Don'ts
- Pas de thème sombre
- Pas de MacBook ou conteneur simulant un appareil
- Pas de gradient de fond
- Pas de coin sharp (radius 0)
- Pas d'ombre floue traditionnelle sur les cards
- Pas de texte de lien en dehors du bleu `#1cb0f6`

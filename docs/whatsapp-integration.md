# Intégration WhatsApp — Viral Stick

## Conclusion produit claire

Viral Stick **ne peut pas être intégré comme un “plugin WhatsApp” générique** au sens d’un plugin embarqué libre dans l’application WhatsApp grand public.

En revanche, il existe des intégrations **officielles et réalistes** :

1. **partage vers WhatsApp** via deep links (`wa.me`) et partage système,
2. **partage vers WhatsApp Status** sur mobile via les mécanismes officiels de partage / intents,
3. **WhatsApp Business Platform** pour des échanges conversationnels business-to-user,
4. **deep links vers l’app Viral Stick** depuis des campagnes WhatsApp Business marketing, selon les capacités du produit final.

## Ce qui est officiellement possible

### 1. Lancer WhatsApp avec un message pré-rempli
Officiel via :

- `https://wa.me/?text=...`
- `https://wa.me/<numero>?text=...`

Cas d’usage Viral Stick :
- partager un mème texte,
- envoyer un lien vers une création,
- pousser une caption ou un prompt généré.

### 2. Utiliser le partage système mobile
WhatsApp prend en charge le partage de :
- texte,
- images,
- vidéos,
- audio,
- PDF,
- URL.

Cas d’usage Viral Stick :
- partager une image mème exportée,
- envoyer un sticker PNG si pipeline prêt,
- partager un post prêt à diffuser.

### 3. Share to WhatsApp Status
WhatsApp expose une intégration officielle pour partager vers **Status** depuis des apps tierces, notamment via intents Android / mécanismes de partage mobile.

Cas d’usage Viral Stick :
- publier directement un visuel de mème en status,
- publier un sticker/story vertical généré,
- envoyer une composition image + overlay texte vers le compositeur Status.

### 4. WhatsApp Business Platform
Permet :
- envoi/réception de messages business,
- onboarding business,
- templates,
- campagnes marketing,
- flux conversationnels.

Cas d’usage Viral Stick :
- assistant business pour commandes créatives,
- bot de génération assistée,
- support client / onboarding studio.

## Ce qui n’est pas réaliste comme promesse produit

Éviter de promettre :
- un “plugin WhatsApp” injecté dans l’UI native WhatsApp sans programme officiel adapté,
- une édition complète de mèmes *dans* WhatsApp sans passer par partage / liens / business flows,
- un pack stickers WhatsApp pleinement exportable sans pipeline image final + packaging conforme.

## Architecture recommandée pour Viral Stick

### Niveau 1 — immédiat
- bouton **Partager sur WhatsApp** dans le web,
- bouton **Partager sur WhatsApp** dans le mobile,
- pré-remplissage du message avec caption + lien,
- bouton **Partager au statut WhatsApp** côté mobile quand le rendu image est prêt.

### Niveau 2 — diffusion créative
- export image PNG / story 9:16,
- export sticker,
- raccourci “Envoyer à WhatsApp” depuis l’écran de rendu final,
- templates de message adaptés au partage social.

### Niveau 3 — conversation business
- intégration WhatsApp Business Platform,
- génération via conversation guidée,
- récupération des briefs utilisateur depuis WhatsApp,
- renvoi du résultat vers une landing / studio / dashboard.

## Recommandation produit actuelle

Pour le projet Viral Stick aujourd’hui, la meilleure voie est :

1. **web :** lien de partage `wa.me` + partage natif navigateur si disponible,
2. **mobile :** bouton de partage WhatsApp / Status dès qu’un rendu image exportable existe,
3. **plus tard :** couche WhatsApp Business Platform pour un canal conversationnel business.

## Prérequis techniques avant intégration forte

Il faut d’abord finaliser :
- l’export image réel,
- l’export sticker / PNG,
- les métadonnées de partage,
- les deep links de l’app,
- la génération d’URL publiques ou d’assets partageables.

## Décision recommandée

**Oui à une intégration WhatsApp de diffusion et d’échange.**

**Non à la promesse marketing “plugin WhatsApp” tant qu’on parle de l’app WhatsApp grand public sans programme officiel spécifique.**

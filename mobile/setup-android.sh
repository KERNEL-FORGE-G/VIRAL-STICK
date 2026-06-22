#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# Viral Stick — Android Native Setup Script
# KERNEL FORGE — 2026
#
# Usage: bash setup-android.sh <chemin_vers_android>
#   Exemple: bash setup-android.sh /tmp/rn-init/ViralStick/android
#
# Ce script:
#   1. Copie les icônes de lanceur dans les mipmaps Android
#   2. Crée l'écran de démarrage natif (splash screen XML)
#   3. Configure le thème splash dans styles.xml
#   4. Ajoute un drawable splash au projet
# ═══════════════════════════════════════════════════════════════════════

set -euo pipefail

ANDROID_DIR="${1:?Usage: $0 <chemin_vers_android>}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ICONS_DIR="$SCRIPT_DIR/android-icon-resources"

echo "📍 Cible Android : $ANDROID_DIR"
echo ""

# ─── 1. Copie des icônes dans les mipmaps ────────────────────────────
echo "📱 Copie des icônes de lanceur..."
for density in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  src="$ICONS_DIR/mipmap-$density"
  dst="$ANDROID_DIR/app/src/main/res/mipmap-$density"
  mkdir -p "$dst"
  cp "$src"/ic_launcher*.png "$dst/"
  echo "  ✓ mipmap-$density"
done

echo ""

# ─── 2. Création du drawable splash ──────────────────────────────────
echo "🎨 Création du drawable splash..."
SPLASH_DRAWABLE_DIR="$ANDROID_DIR/app/src/main/res/drawable"
mkdir -p "$SPLASH_DRAWABLE_DIR"

cat > "$SPLASH_DRAWABLE_DIR/splash_screen.xml" << 'XMLEOF'
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Fond sombre -->
    <item android:drawable="@color/splash_background" />
    <!-- Logo centré -->
    <item
        android:width="140dp"
        android:height="140dp"
        android:gravity="center">
        <bitmap
            android:src="@mipmap/ic_launcher"
            android:gravity="center" />
    </item>
</layer-list>
XMLEOF
echo "  ✓ drawable/splash_screen.xml"

# ─── 3. Création du fichier colors.xml pour le splash ────────────────
echo "🎨 Création des couleurs splash..."
VALUES_DIR="$ANDROID_DIR/app/src/main/res/values"
mkdir -p "$VALUES_DIR"

# Ajouter la couleur splash si pas déjà présente
if ! grep -q "splash_background" "$VALUES_DIR/colors.xml" 2>/dev/null; then
  cat >> "$VALUES_DIR/colors.xml" << 'XMLEOF'
    <color name="splash_background">#0A0A1A</color>
XMLEOF
  echo "  ✓ Couleur splash ajoutée à colors.xml"
else
  echo "  - splash_background déjà présent dans colors.xml"
fi

# ─── 4. Mise à jour du thème dans styles.xml ────────────────────────
echo "🎨 Configuration du thème splash..."
STYLES_FILE="$VALUES_DIR/styles.xml"

if [ -f "$STYLES_FILE" ]; then
  # Ajouter le thème splash avant la fermeture des resources
  if ! grep -q "Theme.Splash" "$STYLES_FILE" 2>/dev/null; then
    # Enlever la dernière ligne </resources>
    head -n -1 "$STYLES_FILE" > /tmp/styles_tmp.xml
    cat >> /tmp/styles_tmp.xml << 'XMLEOF'
    <style name="Theme.Splash" parent="Theme.AppCompat.NoActionBar">
        <item name="android:windowBackground">@drawable/splash_screen</item>
        <item name="android:statusBarColor">@color/splash_background</item>
        <item name="android:navigationBarColor">@color/splash_background</item>
    </style>
</resources>
XMLEOF
    mv /tmp/styles_tmp.xml "$STYLES_FILE"
    echo "  ✓ Theme.Splash ajouté à styles.xml"
  else
    echo "  - Theme.Splash déjà présent"
  fi
else
  echo "  ⚠️ styles.xml introuvable, création..."
  cat > "$STYLES_FILE" << 'XMLEOF'
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    </style>
    <style name="Theme.Splash" parent="Theme.AppCompat.NoActionBar">
        <item name="android:windowBackground">@drawable/splash_screen</item>
        <item name="android:statusBarColor">@color/splash_background</item>
        <item name="android:navigationBarColor">@color/splash_background</item>
    </style>
</resources>
XMLEOF
  echo "  ✓ styles.xml créé avec Theme.Splash"
fi

# ─── 5. Mise à jour du AndroidManifest.xml ──────────────────────────
echo "📝 Mise à jour du AndroidManifest.xml..."
MANIFEST="$ANDROID_DIR/app/src/main/AndroidManifest.xml"

if [ -f "$MANIFEST" ]; then
  # Ajouter android:theme à l'activity principale
  # Chercher l'activity principale et ajouter le thème splash
  sed -i 's|<activity android:name=".MainActivity"|<activity android:name=".MainActivity" android:theme="@style/Theme.Splash"|' "$MANIFEST"
  echo "  ✓ Theme.Splash ajouté à MainActivity dans AndroidManifest.xml"
else
  echo "  ⚠️ AndroidManifest.xml introuvable"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ Configuration Android terminée !"
echo "   Icônes de lanceur : OK"
echo "   Splash screen XML : OK"
echo "   Thème splash : OK"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Prochaines étapes :"
echo "  1. Ajoute dans android/app/build.gradle les signingConfigs"
echo "  2. Ajoute la dépendance dans l'Activity principale Java:"
echo ""
echo "  Dans android/app/src/main/java/.../MainActivity.java:"
echo "    import android.os.Bundle;"
echo ""
echo "    @Override"
echo "    protected void onCreate(Bundle savedInstanceState) {"
echo "      setTheme(R.style.Theme.Splash);"
echo "      super.onCreate(savedInstanceState);"
echo "    }"

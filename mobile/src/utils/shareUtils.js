import { Alert, Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

/**
 * Demande les permissions de stockage sur Android
 */
const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    // Android 13+ (API 33+) n'utilise plus WRITE_EXTERNAL_STORAGE pour les médias
    if (Platform.Version >= 33) return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Permission de stockage",
        message: "Viral Stick a besoin d'accéder au stockage pour sauvegarder vos mèmes.",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

/**
 * Prépare un fichier local pour le partage.
 * React Native Share préfère les chemins de fichiers locaux (file://) sur Android
 * plutôt que les URI Base64 bruts qui causent parfois des erreurs null pointer.
 */
const prepareFileForSharing = async (source) => {
  if (!source) throw new Error("Source image absente");

  const timestamp = Date.now();
  const fileName = `vs_share_${timestamp}.jpg`;
  const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  try {
    if (source.startsWith('data:image')) {
      const base64Data = source.replace(/^data:image\/\w+;base64,/, '');
      await RNFS.writeFile(destPath, base64Data, 'base64');
    } else if (source.startsWith('http')) {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: source,
        toFile: destPath,
      }).promise;
      if (downloadResult.statusCode !== 200) throw new Error('Échec du téléchargement');
    } else {
      // Déjà un chemin local ? On le copie dans le cache pour être sûr
      const cleanPath = source.replace('file://', '');
      await RNFS.copyFile(cleanPath, destPath);
    }

    return `file://${destPath}`;
  } catch (error) {
    console.error('[prepareFileForSharing] Erreur:', error);
    throw error;
  }
};

export const shareToWhatsApp = async (imageUrl, text = '') => {
  try {
    console.log('[shareToWhatsApp] Traitement de:', imageUrl.substring(0, 50));

    // On transforme l'image en fichier temporaire local
    const localFileUri = await prepareFileForSharing(imageUrl);

    const shareOptions = {
      title: 'Viral Stick',
      message: text,
      url: localFileUri,
      type: 'image/jpeg',
      social: Share.Social.WHATSAPP,
    };

    try {
      // Tentative de partage direct WhatsApp
      await Share.shareSingle(shareOptions);
    } catch (e) {
      // Fallback vers le menu de partage global si WhatsApp direct échoue
      console.log('[shareToWhatsApp] Direct share failed, using open()');
      await Share.open(shareOptions);
    }

    // Nettoyage optionnel du cache après un délai
    setTimeout(() => RNFS.unlink(localFileUri.replace('file://', '')).catch(() => {}), 10000);

  } catch (error) {
    console.error('[shareToWhatsApp] Erreur fatale:', error);
    if (!error.message.includes('User did not share')) {
       Alert.alert('Partage', 'Impossible de lancer WhatsApp. Vérifiez vos permissions.');
    }
  }
};

export const downloadImageToGallery = async (imageUrl) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert("Permission", "Accès refusé au stockage.");
      return;
    }

    const timestamp = Date.now();
    const fileName = `ViralStick_${timestamp}.jpg`;

    // Dossier standard Pictures pour Android
    const picturesDir = Platform.OS === 'android'
      ? `${RNFS.ExternalStorageDirectoryPath}/Pictures/ViralStick`
      : `${RNFS.DocumentDirectoryPath}/ViralStick`;

    if (!(await RNFS.exists(picturesDir))) {
      await RNFS.mkdir(picturesDir);
    }

    const destPath = `${picturesDir}/${fileName}`;

    if (imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      await RNFS.writeFile(destPath, base64Data, 'base64');
    } else if (imageUrl.startsWith('http')) {
      await RNFS.downloadFile({ fromUrl: imageUrl, toFile: destPath }).promise;
    } else {
      const sourcePath = imageUrl.replace('file://', '');
      await RNFS.copyFile(sourcePath, destPath);
    }

    if (Platform.OS === 'android') {
      await RNFS.scanFile(destPath);
    }

    Alert.alert("Succès", "Mème enregistré dans votre galerie !");
    return destPath;
  } catch (error) {
    console.error('[downloadImageToGallery] Erreur:', error);
    Alert.alert("Erreur", "Impossible de sauvegarder l'image.");
    throw error;
  }
};

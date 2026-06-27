import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

/**
 * Prépare un fichier local pour le partage à partir d'une source (URL, Base64 ou File)
 * @param {string} source - L'URL, le base64 ou le chemin du fichier
 * @returns {Promise<string>} - Le chemin local du fichier (format file://...)
 */
const prepareFileForSharing = async (source) => {
  const timestamp = Date.now();
  const fileName = `viral_stick_${timestamp}.jpg`;
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

      if (downloadResult.statusCode !== 200) {
        throw new Error('Échec du téléchargement');
      }
    } else if (source.startsWith('file://')) {
      const cleanPath = source.replace('file://', '');
      await RNFS.copyFile(cleanPath, destPath);
    } else if (source.startsWith('/')) {
      await RNFS.copyFile(source, destPath);
    } else {
      throw new Error('Format de source inconnu');
    }

    return `file://${destPath}`;
  } catch (error) {
    console.error('[prepareFileForSharing] Erreur:', error);
    throw error;
  }
};

/**
 * Partage une image sur WhatsApp
 */
export const shareToWhatsApp = async (imageUrl, text = '') => {
  try {
    console.log('[shareToWhatsApp] Source:', imageUrl);
    const localUri = await prepareFileForSharing(imageUrl);
    
    const shareOptions = {
      title: 'Partager via',
      message: text,
      url: localUri,
      type: 'image/jpeg',
      social: Share.Social.WHATSAPP,
      failOnCancel: false,
    };

    // Sur Android, on utilise shareSingle pour forcer WhatsApp
    // Sur iOS, Share.open est souvent préférable car shareSingle peut être capricieux
    if (Platform.OS === 'android') {
      await Share.shareSingle(shareOptions);
    } else {
      await Share.open(shareOptions);
    }
  } catch (error) {
    console.error('[shareToWhatsApp] Erreur:', error);
    // Fallback: partage générique si WhatsApp spécifique échoue
    try {
      const localUri = await prepareFileForSharing(imageUrl);
      await Share.open({
        url: localUri,
        title: 'Partager le mème',
        message: text,
      });
    } catch (fallbackError) {
      Alert.alert('Erreur', 'Impossible de partager l\'image.');
    }
  }
};

/**
 * Sauvegarde une image dans la galerie
 */
export const downloadImageToGallery = async (imageUrl) => {
  try {
    const timestamp = Date.now();
    const fileName = `viral_stick_${timestamp}.jpg`;
    
    // Pour Android, on essaie de mettre dans Pictures pour que ce soit visible
    // Pour iOS, on télécharge d'abord en cache puis on pourrait utiliser une lib comme CameraRoll
    // Mais ici on reste simple avec RNFS
    
    let destPath;
    if (Platform.OS === 'android') {
      const picturesDir = `${RNFS.ExternalStorageDirectoryPath}/Pictures/ViralStick`;
      const exists = await RNFS.exists(picturesDir);
      if (!exists) await RNFS.mkdir(picturesDir);
      destPath = `${picturesDir}/${fileName}`;
    } else {
      destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }

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

    return destPath;
  } catch (error) {
    console.error('[downloadImageToGallery] Erreur:', error);
    throw error;
  }
};

/**
 * Partage générique
 */
export const shareImage = async (imageUrl, text = '') => {
  try {
    const localUri = await prepareFileForSharing(imageUrl);
    await Share.open({
      url: localUri,
      title: 'Partager',
      message: text,
    });
  } catch (error) {
    console.error('[shareImage] Erreur:', error);
    Alert.alert('Erreur', 'Impossible de partager.');
  }
};

import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

/**
 * Télécharge et prépare une image pour être utilisée comme sticker
 * Gère les URLs HTTP, les fichiers locaux (file://) et les base64
 * @param {string} imageUrl - URL de l'image (http, file://, ou base64)
 * @returns {Promise<string>} - Chemin local du fichier préparé au format WebP
 */
export const downloadAndPrepareSticker = async (imageUrl) => {
  try {
    console.log('[downloadAndPrepareSticker] Source:', imageUrl);
    
    let sourcePath = null;
    let isTemporary = false;
    
    // Cas 1: Image locale (file://)
    if (imageUrl.startsWith('file://')) {
      sourcePath = imageUrl.replace('file://', '');
      console.log('[downloadAndPrepareSticker] Image locale:', sourcePath);
    }
    // Cas 2: Base64
    else if (imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const tempFileName = `viral_stick_temp_${Date.now()}.png`;
      sourcePath = `${RNFS.TemporaryDirectoryPath}/${tempFileName}`;
      
      await RNFS.writeFile(sourcePath, base64Data, 'base64');
      console.log('[downloadAndPrepareSticker] Base64 sauvegardé:', sourcePath);
      isTemporary = true;
    }
    // Cas 3: URL HTTP
    else {
      const tempFileName = `viral_stick_download_${Date.now()}.jpg`;
      sourcePath = `${RNFS.TemporaryDirectoryPath}/${tempFileName}`;
      
      console.log('[downloadAndPrepareSticker] Téléchargement depuis URL...');
      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: sourcePath,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`[downloadAndPrepareSticker] Téléchargement: ${progress.toFixed(2)}%`);
        },
      }).promise;

      if (downloadResult.statusCode !== 200) {
        throw new Error(`Échec du téléchargement: status ${downloadResult.statusCode}`);
      }
      
      console.log('[downloadAndPrepareSticker] Téléchargement réussi');
      isTemporary = true;
    }

    // Vérifier que le fichier source existe
    const sourceExists = await RNFS.exists(sourcePath);
    if (!sourceExists) {
      throw new Error('Fichier source introuvable');
    }

    // Préparer le chemin de destination pour le sticker
    const stickerFileName = `viral_stick_${Date.now()}.webp`;
    let stickerPath;
    
    if (Platform.OS === 'android') {
      // Sur Android, utiliser le répertoire Pictures accessible par WhatsApp
      const externalDir = RNFS.ExternalStorageDirectoryPath;
      const picturesDir = `${externalDir}/Pictures`;
      
      // Créer le répertoire Pictures s'il n'existe pas
      const dirExists = await RNFS.exists(picturesDir);
      if (!dirExists) {
        await RNFS.mkdir(picturesDir);
      }
      
      stickerPath = `${picturesDir}/${stickerFileName}`;
    } else {
      // Sur iOS, utiliser le répertoire temporaire
      stickerPath = `${RNFS.TemporaryDirectoryPath}/${stickerFileName}`;
    }

    // Copier/renommer le fichier vers le chemin du sticker
    // Note: Pour une vraie conversion WebP, il faudrait utiliser une librairie comme react-native-image-resizer
    // Pour l'instant, on copie simplement le fichier avec l'extension .webp
    await RNFS.copyFile(sourcePath, stickerPath);
    console.log('[downloadAndPrepareSticker] Sticker préparé:', stickerPath);

    // Nettoyer le fichier temporaire si nécessaire
    if (isTemporary && sourcePath !== stickerPath) {
      RNFS.unlink(sourcePath).catch(err => console.log('[downloadAndPrepareSticker] Erreur suppression temp:', err));
    }

    return stickerPath;
  } catch (error) {
    console.error('[downloadAndPrepareSticker] Erreur:', error);
    throw error;
  }
};

/**
 * Télécharge une image depuis une URL et la partage sur WhatsApp comme sticker
 * @param {string} imageUrl - URL de l'image à partager
 * @param {string} text - Texte optionnel à accompagner l'image
 */
export const shareToWhatsApp = async (imageUrl, text = '') => {
  try {
    console.log('shareToWhatsApp - imageUrl:', imageUrl);
    
    // Préparer le sticker
    const stickerPath = await downloadAndPrepareSticker(imageUrl);
    
    // Partager comme sticker WhatsApp
    await shareAsWhatsAppSticker(stickerPath, text);
    
    // Nettoyer le fichier après partage (sauf sur Android où il est dans Pictures)
    if (Platform.OS === 'ios') {
      RNFS.unlink(stickerPath).catch(err => console.log('Erreur suppression fichier temp:', err));
    }
  } catch (error) {
    console.error('Erreur partage WhatsApp sticker:', error);
    Alert.alert('Erreur', 'Impossible de partager sur WhatsApp. Vérifiez que l\'application est installée.');
  }
};

/**
 * Partage une image locale comme sticker WhatsApp
 * @param {string} filePath - Chemin local du fichier image
 * @param {string} text - Texte optionnel
 */
const shareAsWhatsAppSticker = async (filePath, text = '') => {
  console.log('shareAsWhatsAppSticker - filePath:', filePath);
  
  try {
    let sharePath = filePath;
    
    // Sur Android, copier le fichier vers un répertoire accessible par WhatsApp
    if (Platform.OS === 'android') {
      const externalDir = RNFS.ExternalStorageDirectoryPath;
      const fileName = `viral_stick_${Date.now()}.webp`;
      const externalPath = `${externalDir}/Pictures/${fileName}`;
      
      // Créer le répertoire Pictures s'il n'existe pas
      const picturesDir = `${externalDir}/Pictures`;
      const dirExists = await RNFS.exists(picturesDir);
      if (!dirExists) {
        await RNFS.mkdir(picturesDir);
      }
      
      // Copier le fichier vers le répertoire externe
      await RNFS.copyFile(filePath, externalPath);
      console.log('Fichier copié vers:', externalPath);
      sharePath = externalPath;
    }
    
    // Vérifier que le fichier existe avant de partager
    const fileExists = await RNFS.exists(sharePath);
    if (!fileExists) {
      throw new Error('Fichier à partager introuvable');
    }

    // Utiliser Share.open() pour partager le fichier
    const shareOptions = {
      title: 'Partager sur WhatsApp',
      message: text,
      url: Platform.OS === 'android' ? sharePath : `file://${sharePath}`,
      type: 'image/webp',
      filename: 'viral_stick_sticker.webp',
      social: Share.Social.WHATSAPP,
    };

    console.log('Tentative de partage avec Share.open(), url:', shareOptions.url);
    await Share.open(shareOptions);
    console.log('Partage réussi');
    
    // Nettoyer le fichier externe sur Android après partage
    if (Platform.OS === 'android' && sharePath !== filePath) {
      RNFS.unlink(sharePath).catch(err => console.log('Erreur suppression fichier externe:', err));
    }
  } catch (error) {
    console.error('Erreur partage:', error);
    
    // Fallback: essayer sans spécifier WhatsApp et avec URI correcte
    try {
      const normalOptions = {
        title: 'Partager le mème',
        message: text,
        url: Platform.OS === 'android' ? filePath : `file://${filePath}`,
        type: 'image/webp',
      };
      console.log('Fallback: partage sans WhatsApp spécifié, url:', normalOptions.url);
      await Share.open(normalOptions);
    } catch (fallbackError) {
      console.error('Erreur fallback:', fallbackError);
      Alert.alert('Erreur', 'Impossible de partager l\'image.');
    }
  }
};

/**
 * Télécharge une image depuis une URL et la partage via le système natif
 * @param {string} imageUrl - URL de l'image à partager
 * @param {string} text - Texte optionnel à accompagner l'image
 */
export const shareImage = async (imageUrl, text = '') => {
  try {
    // Vérifier si l'image est déjà en base64
    if (imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const fileName = `viral_stick_share_${Date.now()}.png`;
      const filePath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
      
      await RNFS.writeFile(filePath, base64Data, 'base64');
      
      const shareOptions = {
        title: 'Partager le mème',
        message: text,
        url: `file://${filePath}`,
        filename: fileName,
      };

      await Share.open(shareOptions);
      
      RNFS.unlink(filePath).catch(err => console.log('Erreur suppression fichier temp:', err));
      return;
    }

    const downloadDest = `${RNFS.TemporaryDirectoryPath}/viral_stick_share_${Date.now()}.jpg`;
    
    const downloadResult = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadDest,
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Téléchargement: ${progress.toFixed(2)}%`);
      },
    }).promise;

    if (downloadResult.statusCode === 200) {
      const fileExists = await RNFS.exists(downloadDest);
      if (!fileExists) {
        throw new Error('Fichier téléchargé introuvable');
      }

      const shareOptions = {
        title: 'Partager le mème',
        message: text,
        url: `file://${downloadDest}`,
        filename: 'viral_stick_meme.jpg',
      };

      await Share.open(shareOptions);
      
      RNFS.unlink(downloadDest).catch(err => console.log('Erreur suppression fichier temp:', err));
    } else {
      throw new Error(`Échec du téléchargement: status ${downloadResult.statusCode}`);
    }
  } catch (error) {
    console.error('Erreur partage image:', error);
    Alert.alert('Erreur', 'Impossible de partager l\'image.');
  }
};

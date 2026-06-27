import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

/**
 * Télécharge une image depuis une URL et la partage sur WhatsApp comme sticker
 * @param {string} imageUrl - URL de l'image à partager
 * @param {string} text - Texte optionnel à accompagner l'image
 */
export const shareToWhatsApp = async (imageUrl, text = '') => {
  try {
    console.log('shareToWhatsApp - imageUrl:', imageUrl);
    
    // Vérifier si l'image est déjà en base64
    if (imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const fileName = `viral_stick_sticker_${Date.now()}.webp`;
      const filePath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
      
      // Sauvegarder le base64 en fichier
      await RNFS.writeFile(filePath, base64Data, 'base64');
      console.log('Base64 sauvegardé:', filePath);
      
      // Envoyer comme sticker WhatsApp
      await shareAsWhatsAppSticker(filePath, text);
      
      // Nettoyer le fichier temporaire
      RNFS.unlink(filePath).catch(err => console.log('Erreur suppression fichier temp:', err));
      return;
    }

    // Télécharger l'image depuis une URL HTTP
    const downloadDest = `${RNFS.TemporaryDirectoryPath}/viral_stick_sticker_${Date.now()}.webp`;
    console.log('Téléchargement vers:', downloadDest);
    
    const downloadResult = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadDest,
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Téléchargement: ${progress.toFixed(2)}%`);
      },
    }).promise;

    console.log('Download result:', downloadResult);

    if (downloadResult.statusCode === 200) {
      // Vérifier que le fichier existe
      const fileExists = await RNFS.exists(downloadDest);
      if (!fileExists) {
        throw new Error('Fichier téléchargé introuvable');
      }

      console.log('Fichier téléchargé avec succès');
      
      // Envoyer comme sticker WhatsApp
      await shareAsWhatsAppSticker(downloadDest, text);
      
      // Nettoyer le fichier temporaire après partage
      RNFS.unlink(downloadDest).catch(err => console.log('Erreur suppression fichier temp:', err));
    } else {
      throw new Error(`Échec du téléchargement: status ${downloadResult.statusCode}`);
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
    
    // Utiliser Share.open() pour partager le fichier
    const shareOptions = {
      title: 'Partager sur WhatsApp',
      message: text,
      url: `file://${sharePath}`,
      type: 'image/webp',
      filename: 'viral_stick_sticker.webp',
      social: Share.Social.WHATSAPP,
    };

    console.log('Tentative de partage avec Share.open()');
    await Share.open(shareOptions);
    console.log('Partage réussi');
    
    // Nettoyer le fichier externe sur Android après partage
    if (Platform.OS === 'android' && sharePath !== filePath) {
      RNFS.unlink(sharePath).catch(err => console.log('Erreur suppression fichier externe:', err));
    }
  } catch (error) {
    console.error('Erreur partage:', error);
    
    // Fallback: essayer sans spécifier WhatsApp
    try {
      const normalOptions = {
        title: 'Partager le mème',
        message: text,
        url: `file://${filePath}`,
        type: 'image/webp',
      };
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

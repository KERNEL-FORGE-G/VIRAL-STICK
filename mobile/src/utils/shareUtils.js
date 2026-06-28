import { Alert, Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    if (Platform.Version >= 33) return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Permission de stockage",
        message: "Accès au stockage requis pour enregistrer et partager vos mèmes.",
        buttonNeutral: "Plus tard",
        buttonNegative: "Annuler",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

const prepareFileForSharing = async (source) => {
  if (!source) throw new Error("Source de l'image manquante");

  const timestamp = Date.now();
  const fileName = `vs_share_${timestamp}.jpg`;
  const dir = Platform.OS === 'android' ? RNFS.ExternalCachesDirectoryPath : RNFS.TemporaryDirectoryPath;
  const destPath = `${dir}/${fileName}`;

  try {
    if (source.startsWith('data:image')) {
      const base64Data = source.replace(/^data:image\/\w+;base64,/, '');
      await RNFS.writeFile(destPath, base64Data, 'base64');
    } else if (source.startsWith('http')) {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: source,
        toFile: destPath,
      }).promise;
      if (downloadResult.statusCode !== 200) throw new Error('Download failed');
    } else {
      const cleanPath = source.replace('file://', '');
      if (cleanPath !== destPath) {
        await RNFS.copyFile(cleanPath, destPath);
      }
    }
    return Platform.OS === 'android' ? `file://${destPath}` : destPath;
  } catch (error) {
    console.error('[prepareFileForSharing] Erreur:', error);
    throw error;
  }
};

export const shareToWhatsApp = async (imageUrl, text = '') => {
  try {
    console.log('[shareToWhatsApp] Source:', imageUrl);
    const localUri = await prepareFileForSharing(imageUrl);
    if (!localUri) throw new Error("URI de partage nulle");

    const shareOptions = {
      title: 'Partager le mème',
      message: text,
      url: localUri,
      type: 'image/jpeg',
      social: Share.Social.WHATSAPP,
      failOnCancel: false,
    };

    await Share.open(shareOptions);
  } catch (error) {
    console.error('[shareToWhatsApp] Erreur:', error);
    if (error.message && !error.message.includes('User did not share')) {
       Alert.alert('Erreur', 'Impossible de partager sur WhatsApp.');
    }
  }
};

export const downloadImageToGallery = async (imageUrl) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    const timestamp = Date.now();
    const fileName = `viral_stick_${timestamp}.jpg`;

    let destPath;
    if (Platform.OS === 'android') {
      const picturesDir = `${RNFS.ExternalStorageDirectoryPath}/Pictures/ViralStick`;
      if (!(await RNFS.exists(picturesDir))) {
        await RNFS.mkdir(picturesDir).catch(() => {});
      }
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

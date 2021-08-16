import RNFS from 'react-native-fs';
import { downloadFolderPath } from './consts';

export function listDownloads() {
  return RNFS.readDir(downloadFolderPath);
}

export function deleteDownload(filePath) {
  RNFS.exists(filePath)
    .then((result) => {
      if (result) {
        return RNFS.unlink(filePath)
          .then(() => {
            console.log('la photo a été supprimée');
          })
          .catch((err) => {
            console.log("erreur suppression de la photo " + err.message);
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
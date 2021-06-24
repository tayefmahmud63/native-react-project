import RNFS from 'react-native-fs';
import { downloadFolderPath } from './consts';

export function listDownloads() {
    return RNFS.readDir(downloadFolderPath);
}

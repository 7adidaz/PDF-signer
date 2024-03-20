import {Platform} from 'react-native';
import RNPermission, {PERMISSIONS} from 'react-native-permissions';

// check if filesystem permession is granted.

export default async function GrantPermissions() {
  if (Platform.OS === 'android') {
    await RNPermission.requestMultiple([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);
  } else {
    await RNPermission.request(PERkISSIONS.IOS.MEDIA_LIBRARY);
  }
}

// async function CheckAndroidPermission() {
//   const read = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//   const write = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
//   if (read === RESULTS.GRANTED && write === RESULTS.GRANTED) {
//     return true;
//   } else {
//     return false;
//   }
// }

// async function CheckIOSPermission() {
//   const write = await check(PERMISSIONS.IOS.MEDIA_LIBRARY);
//   if (write === RESULTS.GRANTED) {
//     return true;
//   } else {
//     return false;
//   }
// }

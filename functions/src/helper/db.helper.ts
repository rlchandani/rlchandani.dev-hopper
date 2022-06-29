import * as admin from "firebase-admin";

/**
 * Inializing Firebase
 */
admin.initializeApp();
const firebaseCommandsRef = admin.database().ref("/commands/");

export { firebaseCommandsRef };

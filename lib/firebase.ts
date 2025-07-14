import admin, { ServiceAccount } from "firebase-admin"

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
}

const databaseURL = process.env.FIREBASE_DATABASE_URL

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL,
    })
  }

  return admin
}

const firebaseAdmin = getFirebaseAdmin()

const db = firebaseAdmin.firestore()

export { firebaseAdmin, db }

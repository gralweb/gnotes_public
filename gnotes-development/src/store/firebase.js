import {
	initializeApp
} from 'firebase/app'
import {
	getFirestore
} from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
	apiKey: "",
	authDomain: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: ""
}

// Initialize Firebase
export const firebaseApp = initializeApp( firebaseConfig )

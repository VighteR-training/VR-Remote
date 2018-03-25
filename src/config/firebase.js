import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCwbU3OmEuNR8ksWR5OZ1kGWiA6CXJPbbc",
  authDomain: "vighter-197e8.firebaseapp.com",
  databaseURL: "https://vighter-197e8.firebaseio.com",
  projectId: "vighter-197e8",
  storageBucket: "vighter-197e8.appspot.com",
  messagingSenderId: "852612792813"
};

const fb = firebase.initializeApp(config);
export default fb.database();
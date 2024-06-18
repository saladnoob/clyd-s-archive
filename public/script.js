// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCCkZBgvfkdvZTs2I7qptAHPiLOMNuXjU",
  authDomain: "clyd-s-archive.firebaseapp.com",
  projectId: "clyd-s-archive",
  storageBucket: "clyd-s-archive.appspot.com",
  messagingSenderId: "868079246429",
  appId: "1:868079246429:web:d68a2e87d10a6f740d01b4",
  measurementId: "G-X7J0BSBCP7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// DOM Elements
const fileGrid = document.getElementById('file-grid');
const noFilesMessage = document.getElementById('no-files-message');
const uploadButton = document.getElementById('upload-button');
const signinButton = document.getElementById('signin-button');

// Check if user is signed in
let currentUser = null;

const checkUserStatus = () => {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (currentUser) {
      // User is signed in
      console.log('User signed in:', currentUser.email);
      signinButton.style.display = 'none';
      uploadButton.style.display = 'block';

      // Show uploaded files
      listAll(ref(storage, currentUser.uid))
        .then((res) => {
          if (res.items.length > 0) {
            res.items.forEach((itemRef) => {
              // Display each file in the grid
              itemRef.getDownloadURL().then((url) => {
                const fileCard = document.createElement('div');
                fileCard.classList.add('file-card');

                const filePreview = document.createElement('img');
                filePreview.src = url;
                filePreview.alt = 'File Preview';
                filePreview.classList.add('file-preview');

                const fileName = document.createElement('p');
                fileName.textContent = itemRef.name;
                fileName.classList.add('file-details');

                fileCard.appendChild(filePreview);
                fileCard.appendChild(fileName);
                fileGrid.appendChild(fileCard);
              });
            });
          } else {
            // No files found
            noFilesMessage.style.display = 'block';
          }
        })
        .catch((error) => {
          console.error('Error listing files:', error);
        });
    } else {
      // User is signed out
      console.log('User signed out');
      signinButton.style.display = 'block';
      uploadButton.style.display = 'none';
      fileGrid.innerHTML = ''; // Clear file grid
      noFilesMessage.style.display = 'none';
    }
  });
};

// Sign in with Google
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // Signed in
      const user = result.user;
      console.log('User signed in with Google:', user.email);
    })
    .catch((error) => {
      console.error('Error signing in with Google:', error);
    });
};

// Sign out
const signOutUser = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful
      console.log('User signed out');
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
};

// Event listeners
signinButton.addEventListener('click', signInWithGoogle);
uploadButton.addEventListener('click', () => {
  // Implement file upload functionality
  // Use storage.ref().child('path/to/file').put(file);
});

// Check user status on page load
document.addEventListener('DOMContentLoaded', checkUserStatus);
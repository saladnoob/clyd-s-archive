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
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Check if user is signed in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const email = user.email;
    if (email === "salad.at.discord@gmail.com") {
      // Display upload button or functionality for authorized user
      // Example: Show upload form or button
      document.getElementById("uploadForm").style.display = "block";
    }
  } else {
    // User is signed out
    // Example: Hide upload form or button
    document.getElementById("uploadForm").style.display = "none";
  }
});

// Upload Form Submission
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, 'files/' + file.name);
    const snapshot = await uploadBytes(storageRef, file);

    // Add file details to Firestore
    const docRef = await addDoc(collection(db, 'files'), {
      name: file.name,
      url: await getDownloadURL(snapshot.ref),
      createdAt: new Date()
    });

    console.log('File uploaded successfully:', docRef.id);
    // Reset form or show success message
    uploadForm.reset();
  } catch (error) {
    console.error('Error uploading file:', error);
    // Show error message to user
    alert('Error uploading file. Please try again later.');
  }
});

// Retrieve Files from Firestore
const fileGrid = document.getElementById('fileGrid');
async function loadFiles() {
  try {
    const querySnapshot = await getDocs(collection(db, 'files'));
    fileGrid.innerHTML = ''; // Clear previous content

    if (querySnapshot.empty) {
      // Display message when no files are found
      fileGrid.innerHTML = '<p>Nothing here yet.</p>';
    } else {
      // Display files in grid
      querySnapshot.forEach((doc) => {
        const file = doc.data();
        const fileCard = `
          <div class="file-card">
            <div class="file-preview">
              <img src="${file.url}" alt="${file.name}">
            </div>
            <div class="file-name">${file.name}</div>
          </div>
        `;
        fileGrid.innerHTML += fileCard;
      });
    }
  } catch (error) {
    console.error('Error loading files:', error);
    // Show error message to user
    fileGrid.innerHTML = '<p>Error loading files. Please try again later.</p>';
  }
}

// Load files on page load
document.addEventListener('DOMContentLoaded', () => {
  loadFiles();
});
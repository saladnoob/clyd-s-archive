// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('upload-status');
const downloadForm = document.getElementById('downloadForm');
const downloadStatus = document.getElementById('download-status');
const fileInput = document.getElementById('fileInput');
const filenameInput = document.getElementById('filename');

// Upload Form Submission
uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const file = fileInput.files[0];
  const storageRef = storage.ref();
  const fileRef = storageRef.child(file.name);

  try {
    const snapshot = await fileRef.put(file);
    console.log('File uploaded successfully:', snapshot);

    uploadStatus.textContent = 'File uploaded successfully!';
    downloadForm.style.display = 'block';
    filenameInput.value = file.name;
  } catch (error) {
    console.error('Error uploading file:', error);
    uploadStatus.textContent = 'Error uploading file. Check console for details.';
  }
});

// Download Form Submission
downloadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const filename = filenameInput.value;
  const storageRef = storage.ref(filename);

  try {
    const url = await storageRef.getDownloadURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    downloadStatus.textContent = 'File downloaded successfully!';
  } catch (error) {
    console.error('Error downloading file:', error);
    downloadStatus.textContent = 'Error downloading file. Check console for details.';
  }
});

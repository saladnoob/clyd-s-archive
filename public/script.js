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
// DOM elements
document.addEventListener('DOMContentLoaded', function() {
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const uploadStatus = document.getElementById('upload-status');
  const downloadForm = document.getElementById('downloadForm');
  const downloadStatus = document.getElementById('download-status');
  const mainHeading = document.getElementById('main-heading');

  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      uploadStatus.textContent = 'Please select a file to upload.';
      return;
    }

    const storageRef = ref(storage, 'uploads/' + file.name);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      uploadStatus.textContent = 'File uploaded successfully!';

      // Update the UI for download
      mainHeading.textContent = 'Download File';
      downloadForm.style.display = 'block';
      document.getElementById('filename').value = file.name;
    } catch (error) {
      console.error('Error uploading file:', error);
      uploadStatus.textContent = 'Error uploading file. Check the console for details.';
    }
  });

  downloadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const filename = document.getElementById('filename').value;
    if (!filename) {
      downloadStatus.textContent = 'Filename is required';
      return;
    }

    try {
      const storageRef = ref(storage, 'uploads/' + filename);
      const downloadURL = await getDownloadURL(storageRef);

      const a = document.createElement('a');
      a.href = downloadURL;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      downloadStatus.textContent = 'File downloaded successfully!';
    } catch (error) {
      console.error('Error downloading file:', error);
      downloadStatus.textContent = 'Error downloading file. Check the console for details.';
    }
  });
});

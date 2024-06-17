<<<<<<< HEAD
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('upload-status');
const downloadForm = document.getElementById('downloadForm');
const downloadStatus = document.getElementById('download-status');
const mainHeading = document.getElementById('main-heading');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(uploadForm);

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: ${value.name}, ${value.size} bytes, ${value.type}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  try {
    const response = await fetch('/.netlify/functions/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Fetch response:', response);
    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      throw new Error(`Error uploading file: ${response.statusText} (Status Code: ${response.status})`);
    }

    const data = await response.json();
    console.log('Upload response data:', data);

    uploadStatus.textContent = data.message;
    if (data.message === 'File uploaded successfully!') {
      mainHeading.textContent = 'Download File';
      downloadForm.style.display = 'block';
      document.getElementById('filename').value = formData.get('file').name.replace(/[^\w.-]+/g, '_');
    }
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
    const response = await fetch(`/.netlify/functions/download?filename=${filename}`);

    console.log('Fetch response:', response);
    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      throw new Error(`Error downloading file: ${response.statusText} (Status Code: ${response.status})`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    downloadStatus.textContent = 'File downloaded successfully!';
  } catch (error) {
    console.error('Error downloading file:', error);
    downloadStatus.textContent = 'Error downloading file. Check the console for details.';
  }
=======
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
>>>>>>> 75a27e6dd6121dc69ec0a62cbba3bdfc12ae8d17
});

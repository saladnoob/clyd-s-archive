const { getStorage, ref, uploadBytes } = require('firebase/storage');
const { v4: uuidv4 } = require('uuid');

const firebaseConfig = {
  apiKey: "AIzaSyBCCkZBgvfkdvZTs2I7qptAHPiLOMNuXjU",
  authDomain: "clyd-s-archive.firebaseapp.com",
  projectId: "clyd-s-archive",
  storageBucket: "clyd-s-archive.appspot.com",
  messagingSenderId: "868079246429",
  appId: "1:868079246429:web:d68a2e87d10a6f740d01b4",
  measurementId: "G-X7J0BSBCP7"
};

const storage = getStorage(firebaseConfig);

exports.handler = async function(event, context) {
  try {
    // Validate request method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      };
    }

    // Parse request body
    const requestBody = JSON.parse(event.body);

    // Check if file exists in request body
    if (!requestBody.file) {
      return {
        statusCode: 400,
        body: 'No file provided',
      };
    }

    const file = requestBody.file;
    const fileName = file.name;
    const fileData = file.data;

    // Generate a unique ID for the file
    const fileId = uuidv4();

    // Upload file to Firebase Storage
    const storageRef = ref(storage, `${context.clientContext.user.uid}/${fileId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, fileData);

    // Return success response with download URL
    return {
      statusCode: 200,
      body: JSON.stringify({
        downloadUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(context.clientContext.user.uid)}/${fileId}%2F${encodeURIComponent(fileName)}?alt=media`,
        fileName: fileName,
      }),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to upload file' }),
    };
  }
};

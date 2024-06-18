const { getStorage, ref, getDownloadURL } = require('firebase/storage');

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
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      };
    }

    const fileId = event.queryStringParameters.fileId;

    // Get download URL from Firebase Storage
    const storageRef = ref(storage, `${context.clientContext.user.uid}/${fileId}`);
    const downloadUrl = await getDownloadURL(storageRef);

    // Return success response with download URL
    return {
      statusCode: 200,
      body: JSON.stringify({
        downloadUrl: downloadUrl,
      }),
    };
  } catch (error) {
    console.error('Error fetching download URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch download URL' }),
    };
  }
};

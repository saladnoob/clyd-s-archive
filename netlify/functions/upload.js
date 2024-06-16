exports.handler = async function(event, context) {
  const formData = parseFormData(event.body);
  const file = formData.file;

  if (!file) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No file uploaded' })
    };
  }

  try {
    // Save the file to a directory on the server
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const filePath = path.join(uploadsDir, file.name);

    fs.writeFileSync(filePath, Buffer.from(file.data, 'base64'));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully' })
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading file' })
    };
  }
};

function parseFormData(body) {
  const pairs = body.split('&');
  const formData = {};
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    formData[key] = decodeURIComponent(value.replace(/\+/g, ' '));
  });
  return formData;
}

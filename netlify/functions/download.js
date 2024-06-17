exports.handler = async function(event, context) {
  const { filename } = event.queryStringParameters;

  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'File not found' })
      };
    }

    const fileData = fs.readFileSync(filePath);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: fileData.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error downloading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error downloading file' })
    };
  }
};

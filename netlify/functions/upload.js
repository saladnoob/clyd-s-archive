const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = 'your-s3-bucket-name';

exports.handler = async (event) => {
    const file = JSON.parse(event.body);

    const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: Buffer.from(file.content, 'base64'),
        ContentType: file.type
    };

    try {
        await s3.upload(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to upload file' })
        };
    }
};

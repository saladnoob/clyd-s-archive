const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = 'your-s3-bucket-name';

exports.handler = async () => {
    const params = {
        Bucket: bucketName
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const files = data.Contents.map(file => ({
            name: file.Key,
            url: `https://${bucketName}.s3.amazonaws.com/${file.Key}`
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(files)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to list files' })
        };
    }
};

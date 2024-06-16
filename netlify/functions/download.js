const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = 'your-s3-bucket-name';

exports.handler = async (event) => {
    const fileName = event.queryStringParameters.fileName;

    const params = {
        Bucket: bucketName,
        Key: fileName
    };

    try {
        const data = await s3.getObject(params).promise();
        return {
            statusCode: 200,
            headers: {
                'Content-Type': data.ContentType,
                'Content-Disposition': `attachment; filename=${fileName}`
            },
            body: data.Body.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to download file' })
        };
    }
};

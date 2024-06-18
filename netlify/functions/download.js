// netlify/functions/download.js

const admin = require("firebase-admin");
const path = require("path");
const os = require("os");
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "https://console.firebase.google.com/project/clyd-s-archive/storage/clyd-s-archive.appspot.com/files",
});

const bucket = admin.storage().bucket();

exports.handler = async (event, context) => {
  const { filename } = event.queryStringParameters;

  if (!filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Filename parameter is required" }),
    };
  }

  try {
    const [file] = await bucket.file(`uploads/${filename}`).download();

    return {
      statusCode: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/octet-stream",
      },
      body: file.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "File not found", error }),
    };
  }
};

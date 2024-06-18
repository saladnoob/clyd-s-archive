// netlify/functions/upload.js

const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const Busboy = require("busboy");
const os = require("os");
const path = require("path");
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "https://console.firebase.google.com/project/clyd-s-archive/storage/clyd-s-archive.appspot.com/files",
});

const bucket = admin.storage().bucket();

exports.handler = async (event, context) => {
  const contentType = event.headers["content-type"];
  if (!contentType.includes("multipart/form-data")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Unsupported media type" }),
    };
  }

  const busboy = new Busboy({ headers: event.headers });
  const tmpdir = os.tmpdir();

  const fileWrites = [];

  busboy.on("file", (fieldname, file, filename) => {
    const filepath = path.join(tmpdir, filename);
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    const promise = new Promise((resolve, reject) => {
      file.on("end", () => writeStream.end());
      writeStream.on("finish", () => {
        bucket
          .upload(filepath, {
            destination: `uploads/${filename}`,
            metadata: {
              contentType: file.mimetype,
            },
          })
          .then(() => {
            fs.unlinkSync(filepath);
            resolve();
          })
          .catch((error) => reject(error));
      });
    });
    fileWrites.push(promise);
  });

  busboy.on("finish", () => {
    Promise.all(fileWrites)
      .then(() => {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Files uploaded successfully" }),
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error uploading files", error }),
        };
      });
  });

  busboy.end(event.body);
};

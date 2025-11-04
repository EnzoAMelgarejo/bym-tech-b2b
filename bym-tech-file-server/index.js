const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config({ path: '.env' })
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const port = process.env.FS_PORT || 3002; // Default to port 3000 if FS_PORT is not set
const destinationPath = process.env.FS_DIRECTORY_PATH || 'C://default'; // Default to 'uploads' if FS_DIRECTORY_PATH is not set
const baseUrl = process.env.FS_URL_PATH || '127.0.0.1:' + port + '/'; // Default to '127.0.0.1:3002/' if FS_URL_PATH is not set
const defaultFile = process.env.FS_FILE_DEFAULT || 'image-not-found.png';
app.use(cors())
const storage = multer.diskStorage({
    destination: destinationPath,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/upload.html');
});

app.get("/:file", async (req, res) => {
    try {
        const file = req.params.file;
        const filePath = path.join(destinationPath, file);
      
        fs.exists(filePath, (exists) => {
            if (exists) {
                return res.sendFile(filePath);
            } else {
                return res.status(404).sendFile(destinationPath + defaultFile);
            }
        });
    } catch (e) {
        console.error(e)
    }
})

app.post('/upload', upload.array('file'), (req, res) => {
    let response=[]
    req.files.forEach(elem=>{
        response.push({
            message: 'Upload success',
            url: baseUrl + elem.filename,
            size: elem.size,
            mimetype: elem.mimetype
        })
    })
    return res.json(response);
});

app.listen(port, () => {
    console.log('Server listen on port ' + port);
});
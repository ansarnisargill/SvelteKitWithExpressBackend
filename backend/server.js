const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const port = 8000;
const data = require('./data');

const app = express();
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(fileUpload());

//Routes
app.get('/', (req, res) => {
  res.send('Test Server!');
});

app.get('/getData', (req, res) => {
  res.send(data);
});

app.post('/postData', (req, res) => {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ status: false, error: 'No files were uploaded.' });
  }
  sampleFile = req.files.image;
  uploadPath = __dirname + '/pics/' + sampleFile.name;
  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ status: true, msg: 'File was uploaded.',id:uuidv4(),fileLocation:uploadPath});
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import './ImageCategorizationApp.css';

const { ApiMarketClient } = require('@apimarket/apimarket')

const configApi = require("./apimarket_config.json");
const configCloudinary = require("./cloudinary_config.json");

class ImageCategorizationApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFileCloudinaryUrl: '',
      hadronResults: ''
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    // we're only uploading 1 file at a time, so will always be the first
    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(configCloudinary["cloudinary_upload_url"])
                        .field('upload_preset', configCloudinary["cloudinary_upload_preset"])
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });

    const sendImageToHadron = async () => {
        try {
            //Config to apimarketClient and connect to ORE blockchain
            let apimarketClient = new ApiMarketClient(configApi);
            await apimarketClient.connect()

            //specify the api to call using it's unique name registered on the ORE blockchain
            const apiName = "cloud.hadron.imageRecognize"

            //call api - passing in the data it needs
            const imageUrl = this.state.uploadedFileCloudinaryUrl;
            const params = { "imageurl": imageUrl }
            const response = await apimarketClient.fetch(apiName, params)
            this.setState({
              hadronResults: JSON.stringify(response.results, null, 2)
            });
        }
        catch(error) {
            console.error(error)
        }
    }

    sendImageToHadron();
  }

  render() {
    const showFileUpload = !this.state.uploadedFileCloudinaryUrl;
    const showWaitingMessage = this.state.uploadedFileCloudinaryUrl && !this.state.hadronResults;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Image Categorization via HADRON</h1>
        </header>

        { showFileUpload &&
          <Dropzone
            className="file-upload"
            multiple={false}
            accept="image/*"
            onDrop={this.onImageDrop.bind(this)}>
            <p>Drop an image or click to select a file to upload.</p>
          </Dropzone>
        }

        { this.state.uploadedFileCloudinaryUrl === '' ? null :
          <div>
            <img src={ this.state.uploadedFileCloudinaryUrl } />
          </div>
        }

        { showWaitingMessage &&
          <p>{`Pinging HADRON. Hang tight.`}</p>
        }

        { this.state.hadronResults === '' ? null :
          <div>
            <p>{`Image Categorization Results from HADRON`}</p>
            { this.state.hadronResults }
          </div>
        }
      </div>
    );
  }
}

export default ImageCategorizationApp;

import React, { Component } from 'react';
import InputLabel from "@mui/material/InputLabel";
import { ImageList } from '@mui/material';
class UploadImageWidget extends Component {
  uploadWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: 'dionckchd',
        upload_preset: '<xmkbucid>',
        tags: ['miniflix'],
        sources: ['local', 'url', 'facebook', 'image_search']
      },
      function (error, result) {
        console.log("This is the result of the last upload", result);
      });
  }
  render() {
    return (
      <div>
        <InputLabel>Sube las fotos de tu alojamiento.</InputLabel>
        <hr />
        <div className="col-sm-12">
          <div className="jumbotron text-center">
            {this.uploadWidget}
          </div>
        </div>
      </div>
    );
  }
}

export default UploadImageWidget;
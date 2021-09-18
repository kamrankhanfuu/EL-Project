import React, { Component } from 'react';
import classnames from 'classnames';
import defaultImage from 'Assets/img/image_placeholder.jpg';
import defaultAvatar from 'Assets/img/generic-user-icon.jpg';
import defaultPDFImage from 'Assets/img/pdf_placeholder.png';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: this.props.defaultValue
        ? this.props.defaultValue
        : this.props.avatar
        ? defaultAvatar
        : defaultImage,
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleImageChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    if (!file) return;

    getBase64(file, (imageUrl) => {
      this.setState({
        file,
        imagePreviewUrl:
          file.type === 'application/pdf' ? defaultPDFImage : imageUrl,
      });
      let fileUrl = imageUrl.split(',');
      this.props.onChange({
        fileUrl: fileUrl[fileUrl.length - 1],
        fileName: file.name,
        documentType: this.props.documentType,
      });
    });
  }

  handleClick() {
    this.refs.fileInput.click();
  }

  handleRemove() {
    this.setState({
      imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage,
    });
    this.refs.fileInput.value = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        imagePreviewUrl: this.props.defaultValue,
      });
    }
  }

  render() {
    const { avatar, accept, normal } = this.props;
    const { imagePreviewUrl, file } = this.state;

    return (
      <div
        className={classnames('fileinput', {
          'custom-input': !normal,
        })}
      >
        <input
          type='file'
          onChange={this.handleImageChange}
          ref='fileInput'
          accept={accept}
        />
        {!normal && (
          <div
            className={classnames('thumbnail', {
              'img-circle': avatar,
            })}
          >
            <img src={imagePreviewUrl} alt='...' />
            <div className='fileinput-overlay'>
              <a
                href='#/'
                className='change-icon'
                title='Change Profile'
                onClick={() => this.handleClick()}
              >
                <i className='tim-icons icon-pencil'></i>
              </a>
            </div>
            {file !== null && (
              <div className='fileinput-trash'>
                <a
                  href='#/'
                  alt='change'
                  className='trash-icon'
                  title='Delete Profile'
                  onClick={() => this.handleRemove()}
                >
                  <i className='fa fa-times'></i>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ImageUpload;

import React from 'react';
import request from 'superagent';
import _ from 'lodash';

import api from '../../../config';
import ImageGrid from './form/form-elements/ImageGrid';
import FilePicker from './form/form-elements/FilePicker';

export default class GlossaryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      fileToRecaption: {},
    }

    this.deleteItem = this.deleteItem.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleDefinitionChange = this.handleDefinitionChange.bind(this);
    this.selectFileToRecaption = this.selectFileToRecaption.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.updateField = this.updateField.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.replaceField = this.replaceField.bind(this);
  }

  handleTermChange(e) {
    this.props.handleTextChange(e, 'term', this.props.index);
  }

  handleDefinitionChange(e) {
    this.props.handleTextChange(e, 'definition', this.props.index);
  }

  deleteItem() {
    this.props.deleteItem(this.props.index);
  }

  selectFileToRecaption(fileIndex) {
    if (fileIndex !== null) {
      const fileToRecaption = this.state.item.images[fileIndex];
      fileToRecaption.index = fileIndex;
      this.setState({ fileToRecaption });
    } else {
      // allow callers to specify null to remove the file to recaption
      this.setState({ fileToRecaption: null });
    }
  }

  handleImage(e) {
    const self = this;
    e.preventDefault();

    let files = [];
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    _.keys(files).map(k => {
      const req = request.post(`
        ${api.endpoint}upload?buildingId=${"glossary"}&resize=true`);
      const filename = files[k].name.split(' ').join('-');
      req.attach('attachment', files[k], filename);

      req.end((err, res) => {
        if (err) console.warn(err);

        const doc = {
          filename: res.body.file.name,
          caption: '',
        };

        this.updateField(doc);
      });
    });
  }

  updateField(value) {
    // use Object.assign to avoid object mutations
    var item = Object.assign([], this.state.item)

    // remove/add the selected value when users un/select values
    if (Array.isArray(item["images"])) {
      _.includes(item["images"], value)
        ? _.pull(item["images"], value)
        : item["images"].push(value);
    } else {
      item["images"] = []
      item["images"].push(value);
    }

    this.setState({ item: item })
    this.props.handleImageUpload(this.props.index, item["images"]);
  }

  handleCaptionChange(e) {
    const relabelCaptionIndex = this.state.fileToRecaption.index;

    if (relabelCaptionIndex !== 'null' || relabelCaptionIndex !== undefined) {
      const newCaption = e.target.value;
      const { images } = this.state.item;

      // mutate a copy of the extant archive documents
      const newImages = Object.assign([], images);
      newImages[relabelCaptionIndex].caption = newCaption;

      // use the replaceField method to quash the old images
      this.replaceField('images', newImages);
      this.props.handleImageUpload(this.props.index, newImages);
    }
  }

  replaceField(field, value) {
    const item = Object.assign({}, this.state.item);
    item[field] = value;
    this.setState({
      item,
    });
  }

  render() {
    const rows = 5;

    return (
      <div>
       <ImageGrid
          // {...this.props}
          images={this.state.item.images ? this.state.item.images : [] }
          label="Image Gallery"
          selectFileToRecaption={this.selectFileToRecaption}
        />
      <FilePicker
          {...this.props}
          topLabel="Select Image"
          bottomLabel="Caption/Attribution"
          handleFile={this.handleImage}
          file={this.state.fileToRecaption}
          textField="caption"
          handleTextChange={this.handleCaptionChange}
        />
        <div className="glossary-item">
          <textarea
            className="custom-textarea edit-glossary-term"
            onChange={this.handleTermChange}
            rows={rows}
            placeholder="Term name"
            value={this.props.item.term}
          />
          <textarea
            className="custom-textarea edit-glossary-definition"
            onChange={this.handleDefinitionChange}
            rows={rows}
            placeholder="Term definition"
            value={this.props.item.definition}
          />
          <img
            className="delete-icon"
            src="/assets/images/delete-icon.png"
            onClick={this.deleteItem}
          />
          <div className="border"></div>
        </div>
      </div>
    );
  }
}

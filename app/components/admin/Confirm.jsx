import React from 'react';

import '../../styles/confirm.css';

export default class Confirm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
    };

    // open or close confirm modal
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /**
   * Open or close confirm modal
   **/

  openModal() {
    if (!this.state.isVisible) this.setState({ isVisible: true });
  }

  closeModal() {
    this.setState({ isVisible: false });
  }

  render() {
    var modal = (
      <div className="confirm dark-modal-backdrop">
        <div className="modal">
          <div className="header">
            <div className="brand modal-header-text">
              New Haven Building Archive
            </div>
            <div
              className="close-text modal-header-text"
              onClick={this.closeModal}
            >
              <div className="close-icon">&times;</div>
              Close
            </div>
          </div>
          <div className="body">
            <h1>{this.props.title}</h1>
            <div className="text">{this.props.bodyText}</div>
            <div className="modal-button-container">
              <div className="modal-button" onClick={this.props.onConfirm}>
                {this.props.confirmText}
              </div>
              <div className="gray-button" onClick={this.closeModal}>
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    var btn = React.Children.only(this.props.children);
    var content = React.cloneElement(
      btn,
      {
        onClick: this.openModal,
      },
      btn.props.children,
      this.state.isVisible ? modal : null
    );

    return content;
  }
}

import React from 'react';

export default class Tab extends React.Component {
  constructor(props) {
    super(props);

    this.getClass = this.getClass.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  getClass() {
    const tab = this.props.tab;
    let tabClass = `form-tab ${tab.position}`;
    if (tab.key == this.props.activeTab) {
      tabClass += ' active';
    }
    return tabClass;
  }

  changeTab() {
    this.props.changeTab(this.props.tab.key);
  }

  render() {
    return (
      <div onClick={this.changeTab} className={this.getClass()}>
        {this.props.tab.label}
      </div>
    );
  }
}

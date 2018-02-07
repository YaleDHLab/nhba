import React from "react";
import Tab from "./Tab";

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(tab) {
    this.props.changeTab(tab);
  }

  render() {
    return (
      <div className="tabs-container">
        <div className="tabs">
          <Tab
            tab={{ label: "Users", value: "users" }}
            changeTab={this.changeTab}
            activeTab={this.props.tab}
          />

          <div className="spacer">&nbsp;</div>

          <Tab
            tab={{ label: "Pages", value: "pages" }}
            changeTab={this.changeTab}
            activeTab={this.props.tab}
          />
        </div>
      </div>
    );
  }
}

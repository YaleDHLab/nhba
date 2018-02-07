import React from "react";
import getNewlineMarkup from "../lib/getNewlineMarkup";

export default class BuildingResources extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const archiveDocuments =
      this.props.building && this.props.building.archive_documents ? (
        this.props.building.archive_documents.map((doc, i) => {
          return (
            <div className="archive-document" key={i}>
              <img src="/assets/images/link-icon.png" />
              <a href={"/assets/uploads/files/" + doc.filename}>{doc.label}</a>
            </div>
          );
        })
      ) : (
        <span />
      );

    const sources =
      this.props.building && this.props.building.sources ? (
        <div
          className="footnotes"
          dangerouslySetInnerHTML={getNewlineMarkup(
            this.props.building.sources
          )}
        />
      ) : (
        <span />
      );

    return (
      <div className="building-resources">
        <h3>Documents</h3>
        {archiveDocuments}
        <h3>References</h3>
        {sources}
      </div>
    );
  }
}

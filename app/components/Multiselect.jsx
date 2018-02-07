import React from 'react';
import _ from 'lodash';

export default class Multiselect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      newOption: '',
    };

    // hide/show the dropdown options
    this.handlePageClick = this.handlePageClick.bind(this);
    this.toggleView = this.toggleView.bind(this);

    // click listeners to determine if user is trying to hide/show the dropdown
    this.selectClicked = this.selectClicked.bind(this);
    this.inputClicked = this.inputClicked.bind(this);
    this.addNewOptionClicked = this.addNewOptionClicked.bind(this);

    // dynamic styling
    this.getSelectClass = this.getSelectClass.bind(this);
    this.getDecoyClass = this.getDecoyClass.bind(this);

    // event listeners
    this.handleCheckbox = this.handleCheckbox.bind(this);

    // handle new options
    this.updateNewOption = this.updateNewOption.bind(this);
    this.submitNewOption = this.submitNewOption.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handlePageClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handlePageClick, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return _.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state)
      ? false
      : true;
  }

  /**
   * Show/Hide select based on clicks
   **/

  handlePageClick(e) {
    if (
      !this.selectClicked(e) &&
      !this.inputClicked(e) &&
      !this.addNewOptionClicked(e)
    ) {
      this.setState({ active: false });
    }
  }

  selectClicked(e) {
    return e.target.className === this.getDecoyClass() ? true : false;
  }

  inputClicked(e) {
    const tagName = e.target.tagName;
    return tagName === 'INPUT' || tagName === 'LABEL' ? true : false;
  }

  addNewOptionClicked(e) {
    return e.target.tagName === 'IMG';
  }

  toggleView(e) {
    if (this.selectClicked(e)) {
      const active = this.state.active ? false : true;
      this.setState({ active: active });
    }
  }

  /**
   * Styling
   **/

  getSelectClass() {
    const defaultClass = this.props.className
      ? 'multiselect ' + this.props.className
      : 'multiselect';
    return this.state.active ? defaultClass + ' active' : defaultClass;
  }

  getDecoyClass() {
    return 'select-decoy ' + this.props.field;
  }

  /**
   * Handle check/uncheck of each checkbox
   **/

  handleCheckbox(e) {
    const option = e.target.id;
    this.props.handleChange(this.props.field, option);
  }

  /**
   * Allow users to create new options in multiselects
   **/

  updateNewOption(e) {
    this.setState({ newOption: e.target.value });
  }

  submitNewOption(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onNewOption(this.props.field, this.state.newOption);
  }

  render() {
    const options = this.props.options
      ? this.props.options.map((option, i) => {
        const value = _.includes(this.props.values, option) ? true : false;
        return (
          <label key={i}>
            <input
              type="checkbox"
              id={option}
              checked={value}
              onChange={this.handleCheckbox}
            />
            {option}
          </label>
        );
      })
      : null;

    const newOption = this.props.allowNewOptions ? (
      <div className="add-new-option">
        <img
          src="/assets/images/plus-icon.png"
          style={{ opacity: this.state.newOption.length ? 1 : 0.5 }}
          onClick={this.submitNewOption}
        />
        <input
          className="add-new-option"
          value={this.state.newOption}
          onChange={this.updateNewOption}
          placeholder="Add selection"
        />
      </div>
    ) : null;

    return (
      <div className={this.getSelectClass()} onClick={this.toggleView}>
        <div className="select-box" onClick={this.showOptions}>
          <select className="custom-select">
            <option>{this.props.label}</option>
          </select>
          <div className={this.getDecoyClass()} />
        </div>
        <div className="select-checkboxes">
          {options}
          {newOption}
        </div>
      </div>
    );
  }
}

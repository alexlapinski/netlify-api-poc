import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import styles from './SettingsIcon.css' // eslint-disable-line

class SettingsIcon extends React.Component {
  constructor(props) { 
    super(props); 
  }
  
  render() {
    const className = R.defaultTo('', R.prop('className', this.props));
    return (
      <span onClick={this.props.onClick} className={`setting-toggle-wrapper ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" className="settings-toggle">
          <use xlinkHref="#settings" className="settings-gear"></use>
        </svg>
      </span>
    );
  }
}

SettingsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default SettingsIcon;

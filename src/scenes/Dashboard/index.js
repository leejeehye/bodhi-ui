/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import TopActions from './components/TopActions/index';
import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import { EventStatus } from '../../constants';
import styles from './styles';


@withStyles(styles, { withTheme: true })
@connect((state) => ({
  sortBy: state.Dashboard.get('sortBy'),
}))
export default class Dashboard extends Component {
  static propTypes = {
    sortBy: PropTypes.object,
  }

  static defaultProps = {
    sortBy: {},
  }

  render() {
    const { sortBy } = this.props;

    return (
      <div>
        <TopActions eventStatusIndex={EventStatus.Bet} />
        <EventCardsGridContainer
          eventStatusIndex={EventStatus.Bet}
          sortBy={sortBy}
        />
      </div>
    );
  }
}

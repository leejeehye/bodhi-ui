import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Grid from 'material-ui/Grid';
import { FormControl } from 'material-ui/Form';
import Card from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';

import dashboardActions from '../../redux/Dashboard/actions';
import styles from './styles';
import { EventStatus } from '../../constants';
import BetSortPicker from './components/BetSortPicker';
import VoteSortPicker from './components/VoteSortPicker';
import ResultSetSortPicker from './components/ResultSetSortPicker';

@withStyles(styles, { withTheme: true })
@injectIntl
@connect(null, (dispatch) => ({
  sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
}))
export default class SortingPicker extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    eventStatusIndex: PropTypes.number.isRequired,
  };

  getSortPicker(eventStatusIndex) {
    switch (eventStatusIndex) {
      case EventStatus.Bet: {
        return <BetSortPicker />;
      }
      case EventStatus.Set: {
        return <ResultSetSortPicker />;
      }
      case EventStatus.Vote: {
        return <VoteSortPicker />;
      }
      default: {
        throw new Error(`Invalid tab index: ${eventStatusIndex}`);
      }
    }
  }


  render() {
    const { classes, eventStatusIndex } = this.props;

    return (
      <Grid item xs={4} className={classes.dashboardActionsRight}>
        <span className={classes.dashboardActionsSortLabel}>
          <FormattedMessage id="sort.label" defaultMessage="Sort By" />
        </span>
        <Card className={classes.dashboardActionsSort}>
          <FormControl>
            {this.getSortPicker(eventStatusIndex)}
          </FormControl>
        </Card>
      </Grid>
    );
  }
}

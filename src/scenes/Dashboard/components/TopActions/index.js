import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import AddIcon from 'material-ui-icons/Add';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Card from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';

import appActions from '../../../../redux/App/actions';
import dashboardActions from '../../../../redux/Dashboard/actions';
import topicActions from '../../../../redux/Topic/actions';
import { SortOption, SortBy, SortMethod } from '../../../../constants';
import Tracking from '../../../../helpers/mixpanelUtil';
import styles from './styles';


@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  lastUsedAddress: state.App.get('lastUsedAddress'),
}), (dispatch) => ({
  toggleCreateEventDialog: (isVisible) => dispatch(appActions.toggleCreateEventDialog(isVisible)),
  sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
  getEventEscrowAmount: (senderAddress) => dispatch(topicActions.getEventEscrowAmount(senderAddress)),
}))
export default class TopActions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    sortOrderChanged: PropTypes.func,
    lastUsedAddress: PropTypes.string.isRequired,
    toggleCreateEventDialog: PropTypes.func.isRequired,
    getEventEscrowAmount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sortOrderChanged: undefined,
  };

  state = {
    sortMethod: 'Ending Soon',
  }

  onSortOptionSelected = (event) => {
    let sortOption;
    let sortOrder;

    switch (event.target.value) {
      case SortMethod.LatestCreated: {
        this.setState({ sortMethod: 'Latest Created' });
        sortOption = SortOption.CreationTime;
        sortOrder = SortBy.Descending;
        break;
      }
      case SortMethod.EndingSoon: {
        this.setState({ sortMethod: 'Ending Soon' });
        sortOption = SortOption.EndingTime;
        sortOrder = SortBy.Ascending;
        break;
      }
      default: {
        break;
      }
    }
    const sortBy = { sortOption, sortOrder };
    console.log('​TopActions -> onSortOptionSelected -> sortOption', sortOption);
    console.log('​TopActions -> onSortOptionSelected -> sortBy', sortBy);
    this.props.sortOrderChanged(sortBy);
  };

  onCreateDialogOpen = () => {
    const {
      toggleCreateEventDialog,
      lastUsedAddress,
      getEventEscrowAmount,
    } = this.props;

    toggleCreateEventDialog(true);
    getEventEscrowAmount(lastUsedAddress);

    Tracking.track('dashboard-createEventClick');
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.dashboardActionsWrapper}>
        <Grid item xs={8}>
          <Button
            variant="raised"
            size="medium"
            color="primary"
            className={classes.createEventButton}
            onClick={this.onCreateDialogOpen}
          >
            <AddIcon fontSize />
            <FormattedMessage id="create.dialogTitle" defaultMessage="Create an event" />
          </Button>
        </Grid>
        <Grid item xs={4} className={classes.dashboardActionsRight}>
          <span className={classes.dashboardActionsSortLabel}>
            <FormattedMessage id="sort.label" defaultMessage="Sort By" />
          </span>
          <Card className={classes.dashboardActionsSort}>
            <FormControl>
              <Select disableUnderline value={this.state.sortMethod} onChange={this.onSortOptionSelected}>
                <MenuItem value="Ending Soon"><FormattedMessage id="sort.endingSoon" defaultMessage="Ending Soon" /></MenuItem>
                <MenuItem value="Latest Created"><FormattedMessage id="sort.latestCreated" defaultMessage="Latest Created" /></MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

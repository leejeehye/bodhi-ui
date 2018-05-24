import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import AddIcon from 'material-ui-icons/Add';
import { withStyles } from 'material-ui/styles';

import appActions from '../../../../redux/App/actions';
import dashboardActions from '../../../../redux/Dashboard/actions';
import topicActions from '../../../../redux/Topic/actions';
import Tracking from '../../../../helpers/mixpanelUtil';
import styles from './styles';
import SortingPicker from '../../../../components/SortingPicker';

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
    eventStatusIndex: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    lastUsedAddress: PropTypes.string.isRequired,
    toggleCreateEventDialog: PropTypes.func.isRequired,
    getEventEscrowAmount: PropTypes.func.isRequired,
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
    const { classes, eventStatusIndex } = this.props;
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
        <SortingPicker eventStatusIndex={eventStatusIndex} />
      </Grid>
    );
  }
}

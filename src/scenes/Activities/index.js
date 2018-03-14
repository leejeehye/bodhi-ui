import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { invert } from 'lodash';
import { connect } from 'react-redux';
import { Tab, Tabs, withStyles } from 'material-ui';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { Route, Redirect } from 'react-router-dom';
import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import EventHistory from './scenes/EventHistory/index';
import { EventStatus } from '../../constants';
import styles from './styles';

const messages = defineMessages({
  set: {
    id: 'activitiesTab.Set',
    defaultMessage: 'Result Setting',
  },
  finalize: {
    id: 'str.finalize',
    defaultMessage: 'Finalize',
  },
  withdraw: {
    id: 'str.withdraw',
    defaultMessage: 'Withdraw',
  },
  history: {
    id: 'activitiesTab.History',
    defaultMessage: 'Activities History',
  },
});

class Activities extends Component {
  static propTypes = {
    actionableItemCount: PropTypes.object,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    match: PropTypes.object.isRequired,
  }

  static defaultProps = {
    actionableItemCount: undefined,
  }

  get tabIdx() {
    // key: url path, value: tab index
    const { path } = this.props.match;
    return {
      [`${path}/result-setting`]: 0,
      [`${path}/finalize`]: 1,
      [`${path}/withdraw`]: 2,
      [`${path}/activities-history`]: 3,
    };
  }

  handleTabChange = (event, tabIdx) => {
    const { history, match: { path } } = this.props;
    const map = invert(this.tabIdx);
    history.push(map[tabIdx]);
  }

  getTabLabel(eventStatusIndex) {
    const { actionableItemCount, intl } = this.props;

    let countLabel = '';
    if (actionableItemCount && actionableItemCount.countByStatus[eventStatusIndex]) {
      countLabel = ` (${actionableItemCount.countByStatus[eventStatusIndex]})`;
    }

    switch (eventStatusIndex) {
      case EventStatus.Set:
        return `${intl.formatMessage(messages.set)}${countLabel}`;
      case EventStatus.Finalize:
        return `${intl.formatMessage(messages.finalize)}${countLabel}`;
      case EventStatus.Withdraw:
        return `${intl.formatMessage(messages.withdraw)}${countLabel}`;
      default:
        return null;
    }
  }

  render() {
    const { classes, history, match: { path } } = this.props;

    return (
      <div>
        <Tabs indicatorColor="primary" value={this.tabIdx[history.location.pathname] || 0} onChange={this.handleTabChange} className={classes.activitiesTabWrapper}>
          <Tab label={this.getTabLabel(EventStatus.Set)} />
          <Tab label={this.getTabLabel(EventStatus.Finalize)} />
          <Tab label={this.getTabLabel(EventStatus.Withdraw)} />
          <Tab label={this.props.intl.formatMessage(messages.history)} />
        </Tabs>
        <div className={classes.activitiesTabContainer}>
          <Route exact path={`${path}/result-setting`} render={() => <EventCardsGridContainer eventStatusIndex={EventStatus.Set} />} />
          <Route exact path={`${path}/finalize`} render={() => <EventCardsGridContainer eventStatusIndex={EventStatus.Finalize} />} />
          <Route exact path={`${path}/withdraw`} render={() => <EventCardsGridContainer eventStatusIndex={EventStatus.Withdraw} />} />
          <Route exact path={`${path}/activities-history`} component={() => <EventHistory history={history} />} />

          {/* <Redirect from={path} to={`${path}/result-setting`} /> */}
        </div>
      </div>
    );
  }
}

// const TabLink = ({ to, label, ...props }) => (
//   <Route exact path={to}>
//     {({ match }) => <Tab label={label} {...props} />}
//   </Route>
// )

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(Activities)));

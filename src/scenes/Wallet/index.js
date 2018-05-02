import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import MyBalances from './components/Balances/index';
import WalletHistory from './components/History/index';
import appActions from '../../redux/App/actions';
import { AppLocation } from '../../constants';
import ImportantNote from '../../components/ImportantNote/index';
import styles from './styles';

const messages = defineMessages({
  balanceInfo: {
    id: 'balance.info',
    defaultMessage: 'If you would like to encrypt, backup, or restore your wallet, please do this from the Qtum Wallet. In the application menu, there is a "Launch Qtum Wallet" option.',
  },
});


@injectIntl
@withStyles(styles, { withTheme: true })
@connect(null, (dispatch) => ({
  setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
}))
export default class MyWallet extends Component {
  static propTypes = {
    setAppLocation: PropTypes.func.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { setAppLocation } = this.props;

    setAppLocation(AppLocation.wallet);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.infoPaper}>
          <ImportantNote
            heading={this.props.intl.formatMessage(messages.balanceInfo)}
          />
        </Paper>
        <MyBalances />
        <WalletHistory />
      </div>
    );
  }
}
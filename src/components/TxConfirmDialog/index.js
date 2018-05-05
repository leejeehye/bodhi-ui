import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Typography, withStyles } from 'material-ui';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import appActions from '../../redux/App/actions';
import { getTxTypeString } from '../../helpers/stringUtil';

const messages = defineMessages({
  confirmMessage: {
    id: 'txConfirm.message',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken}. Please click OK to continue.',
  },
});

@injectIntl
@connect((state) => ({
  txConfirmInfoAndCallback: state.App.get('txConfirmInfoAndCallback'),
}), (dispatch) => ({
  clearTxConfirm: () => dispatch(appActions.clearTxConfirm()),
}))
export default class TxConfirmDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    txConfirmInfoAndCallback: PropTypes.object.isRequired,
    clearTxConfirm: PropTypes.func.isRequired,
  }

  render() {
    const { intl: { formatMessage }, txConfirmInfoAndCallback } = this.props;
    const { txDesc, txAmount, txToken, confirmCallback } = txConfirmInfoAndCallback;
    const isOpen = !!(txDesc && txAmount && txToken && _.isFunction(confirmCallback));

    return (
      <Dialog open={isOpen}>
        <DialogTitle>
          <FormattedMessage id="txConfirm.title" defaultMessage="Please Confirm Your Transaction" />
        </DialogTitle>
        <DialogContent>
          {formatMessage(messages.confirmMessage, { txDesc, txAmount, txToken })}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onClose}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.onOkClicked}>
            <FormattedMessage id="str.confirm" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  onClose = () => {
    this.props.clearTxConfirm();
  }

  onOkClicked = () => {
    const callback = this.props.txConfirmInfoAndCallback.confirmCallback;
    if (callback) {
      callback();
    }
    this.props.clearTxConfirm();
  }
}

const TransactionCost = injectIntl(withStyles(styles, { withTheme: true })(({ classes, intl, txCosts }) => {
  const { locale, messages: localeMessages } = intl;

  return (
    <div>
      <FormattedMessage id="txConfirm.confirmTransactions" defaultMessage="Confirm Transactions:" />
      <ol>
        {txCosts.map((item) => {
          return (
            <li>
              <Typography variant="body1">
                {`${getTxTypeString(item.txType, locale, localeMessages)} ${amount} ${token}`}
              </Typography>
              <Typography variant="body1">
                <FormattedMessage
                  id="txConfirm.gasLimitXGasCostY"
                  defaultMessage="Gas Limit: {gasLimit}, Gas Cost: {gasCost}"
                  values={{ gasLimit: item.gasLimit, gasCost: item.gasCost }}
                />
              </Typography>
            </li>
          );
        })}
      </ol>
    </div>
  );
}));

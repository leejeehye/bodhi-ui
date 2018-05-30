import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { AppBar, Toolbar, Badge, Button, withStyles } from 'material-ui';
import cx from 'classnames';

import { Link } from './components/Link/index';
import { NavLink } from './components/NavLink/index';
import { RouterPath, AppLocation, EventStatus } from '../../constants';
import { faqUrls } from '../../config/app';
import styles from './styles';
import Tracking from '../../helpers/mixpanelUtil';

const messages = defineMessages({
  help: {
    id: 'help',
    defaultMessage: 'Help',
  },
  allEvents: {
    id: 'All Events',
    defaultMessage: 'All Events',
  },
});

@withStyles(styles, { withTheme: true })
@injectIntl
@connect((state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
}))
export default class NavBar extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    classes: PropTypes.object.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    actionableItemCount: PropTypes.object,
    langHandler: PropTypes.func,
    appLocation: PropTypes.string.isRequired,
  }

  static defaultProps = {
    actionableItemCount: undefined,
    langHandler: undefined,
  }

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar className={classes.navBarWrapper}>
          <NavSection>
            <BodhiLogo {...this.props} />
            <QTUMPrediction {...this.props} />
            <BOTCourt {...this.props} />
          </NavSection>
          <NavSection>
            <Wallet {...this.props} />
            <MyActivities {...this.props} />
            <HelpButton {...this.props} />
            <LanguageToggle {...this.props} />
            <AllEvents {...this.props} />
          </NavSection>
        </Toolbar>
      </AppBar>
    );
  }
}

const AllEvents = ({ classes }) => ( // eslint-disable-line
  <NavLink to="/all-events">
    <Button className={classes.navBarWalletButton}>
      <FormattedMessage id="All Events" defaultMessage="All Events" />
    </Button>
  </NavLink>
);

const BOTCourt = ({ classes, appLocation }) => ( // eslint-disable-line
  <NavLink to={RouterPath.botCourt}>
    <Button
      data-index={EventStatus.Vote}
      className={cx(
        classes.navEventsButton,
        appLocation === AppLocation.botCourt || appLocation === AppLocation.vote ? 'selected' : '',
      )}
    >
      <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
    </Button>
  </NavLink>
);

const QTUMPrediction = ({ classes, appLocation }) => ( // eslint-disable-line
  <NavLink to={RouterPath.qtumPrediction}>
    <Button
      data-index={EventStatus.Bet}
      className={cx(
        classes.navEventsButton,
        appLocation === AppLocation.qtumPrediction || appLocation === AppLocation.bet ? 'selected' : '',
      )}
    >
      <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
    </Button>
  </NavLink>
);

const Wallet = ({ classes, walletAddresses }) => { // eslint-disable-line
  const totalQTUM = _.sumBy(walletAddresses, ({ qtum }) => qtum).toFixed(2) || 0;
  const totalBOT = _.sumBy(walletAddresses, ({ bot }) => bot).toFixed(2) || 0;
  return (
    <NavLink to="/my-wallet">
      <Button className={classes.navBarWalletButton}>
        <i className={cx('icon', 'iconfont', 'icon-ic_wallet', classes.navBarWalletIcon)}></i>
        {`${totalQTUM} QTUM / ${totalBOT} BOT`}
      </Button>
    </NavLink>
  );
};

const LanguageToggle = ({ classes, langHandler }) => ( // eslint-disable-line
  <Button onClick={langHandler} className={cx(classes.dark, classes.sides)}>
    <FormattedMessage id="language.select" defaultMessage="中文" />
  </Button>
);

const MyActivities = ({ classes, actionableItemCount }) => { // eslint-disable-line
  let children = (
    <Button className={cx(classes.navEventsButton, classes.dark)}>
      <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
    </Button>
  );
  if (actionableItemCount.totalCount > 0) {
    children = <Badge badgeContent={actionableItemCount.totalCount} color="secondary">{children}</Badge>;
  }
  return <NavLink to={RouterPath.set}>{children}</NavLink>;
};

const BodhiLogo = ({ classes }) => ( // eslint-disable-line
  <Link to={RouterPath.qtumPrediction}>
    <img
      src="http://res.cloudinary.com/dd1ixvdxn/image/upload/c_scale,h_38/v1514426750/logo_en_oa4ewt.svg"
      alt="bodhi-logo"
      className={classes.navBarLogo}
    />
  </Link>
);

const HelpButton = ({ classes, intl }) => ( // eslint-disable-line
  <Button
    className={cx(classes.faq, classes.navEventsButton, classes.dark)}
    onClick={() => {
      window.open(faqUrls[intl.locale], '_blank');
      Tracking.track('navBar-helpClick');
    }}
  >
    <i className={cx('icon iconfont icon-ic_question', classes.questionIcon)} /> {intl.formatMessage(messages.help)}
  </Button>
);

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);


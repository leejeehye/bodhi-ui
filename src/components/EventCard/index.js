import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, Divider, Chip, Typography, withStyles } from 'material-ui';
import classNames from 'classnames';

import styles from './styles';
import { getLocalDateTimeString, getEndTimeCountDownString } from '../../helpers/utility';

const cardMessages = defineMessages({
  raise: {
    id: 'str.raised',
    defaultMessage: 'Raised',
  },
  ends: {
    id: 'str.ends',
    defaultMessage: 'Ends',
  },
});

class EventCard extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    amountLabel: PropTypes.string.isRequired,
    endTime: PropTypes.string,
    buttonText: PropTypes.string.isRequired,
    unconfirmed: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-typos
    intl: intlShape.isRequired,
  };

  static defaultProps = {
    endTime: undefined,
  };

  render() {
    const {
      classes,
      url,
      name,
      amountLabel,
      endTime,
      buttonText,
      unconfirmed,
    } = this.props;
    const { locale, messages: localeMessages } = this.props.intl;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={url}>
          <Card>
            <div className={classNames(classes.eventCardSection, 'top')}>
              <Typography variant="headline" className={classes.eventCardName}>
                {name}
              </Typography>
              <div className={classes.dashboardTime}>
                {endTime !== undefined ? `${this.props.intl.formatMessage(cardMessages.ends)}: ${getLocalDateTimeString(endTime)}` : null}
              </div>
              {unconfirmed && (
                <Typography variant="body1">
                  <Chip
                    label={<FormattedMessage id="str.unconfirmed" defaultMessage="Unconfirmed" />}
                    className={classes.unconfirmedChip}
                  />
                </Typography>
              )}
              <div className={classes.eventCardInfo}>
                <div>
                  <i className={classNames(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-ic_token')}></i>
                  <FormattedMessage id="str.raised" defaultMessage="Raised" />
                  {` ${amountLabel}`}
                </div>
                <div>
                  <i className={classNames(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-ic_timer')}></i>
                  {endTime !== undefined ? `${getEndTimeCountDownString(endTime, locale, localeMessages)}` : <FormattedMessage id="str.end" defaultMessage="Ended" />}
                </div>
              </div>
            </div>
            <div>
              <i className={classNames(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-ic_timer')}></i>
              {endTime !== undefined ? `${getEndTimeCountDownString(endTime)}` : 'Ended'}
            </div>
            <Divider />
            <div className={classNames(classes.eventCardSection, 'button')}>
              {buttonText}
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(injectIntl(EventCard));

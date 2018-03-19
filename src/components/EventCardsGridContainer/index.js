/* eslint react/no-array-index-key: 0, no-nested-ternary: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier
/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroller';
import graphqlActions from '../../redux/Graphql/actions';
import { Token, OracleStatus, SortBy, EventStatus } from '../../constants';
import EventCard from '../EventCard/index';
import EventsEmptyBg from '../EventsEmptyBg/index';
import styles from './styles';

const messages = defineMessages({
  placeBet: {
    id: 'bottomButtonText.placeBet',
    defaultMessage: 'Place Bet',
  },
  setResult: {
    id: 'str.setResult',
    defaultMessage: 'Set Result',
  },
  vote: {
    id: 'bottomButtonText.vote',
    defaultMessage: 'Place Vote',
  },
  finalizeResult: {
    id: 'bottomButtonText.final',
    defaultMessage: 'Finalize Result',
  },
  withdraw: {
    id: 'str.withdraw',
    defaultMessage: 'Withdraw',
  },
});

class EventCardsGrid extends Component {
  state = {
    skip: 0,
    // hasMoreItems: true,
  }
  componentWillMount() {
    const {
      eventStatusIndex,
      sortBy,
    } = this.props;

    this.executeGraphRequest(eventStatusIndex, sortBy, 2, 0);
  }

  componentWillReceiveProps(nextProps) {
    const {
      eventStatusIndex,
      sortBy,
      syncBlockNum,
    } = nextProps;

    if (eventStatusIndex !== this.props.eventStatusIndex
      || sortBy !== this.props.sortBy
      || syncBlockNum !== this.props.syncBlockNum) {
      console.log(eventStatusIndex);

      this.executeGraphRequest(eventStatusIndex, sortBy, 2, 0);
    }
  }

  delayLoadingMore() {
    // this.setState({ canLoadMore: false });
    setTimeout(() => {
      // this.setState({ canLoadMore: true });
    }, 700);
  }

  loadMoreOracles = () => {
    let { skip } = this.state;
    const {
      eventStatusIndex,
      sortBy,
      getMoreOracles,
      getOraclesReturn,
      getTopics,
    } = this.props;
    skip += 2;

    this.setState({ skip });
    console.log(skip);
    const sortDirection = this.props.sortBy || SortBy.Ascending;
    // this.props.getMoreOracles(
    //   [
    //     { token: Token.Qtum, status: OracleStatus.Voting },
    //     { token: Token.Qtum, status: OracleStatus.Created },
    //   ],
    //   { field: 'endTime', direction: sortDirection },
    //   2,
    //   skip,
    // );

    switch (eventStatusIndex) {
      case EventStatus.Bet: {
        getMoreOracles(
          [
            { token: Token.Qtum, status: OracleStatus.Voting },
            { token: Token.Qtum, status: OracleStatus.Created },
          ],
          { field: 'endTime', direction: sortDirection },
          2,
          skip,
        );
        break;
      }
      case EventStatus.Set: {
        getMoreOracles(
          [
            { token: Token.Qtum, status: OracleStatus.WaitResult },
            { token: Token.Qtum, status: OracleStatus.OpenResultSet },
          ],
          { field: 'resultSetEndTime', direction: sortDirection },
          2,
          skip,
        );
        break;
      }
      case EventStatus.Vote: {
        getMoreOracles(
          [
            { token: Token.Bot, status: OracleStatus.Voting },
          ],
          { field: 'endTime', direction: sortDirection },
          2,
          skip,
        );
        break;
      }
      case EventStatus.Finalize: {
        getMoreOracles(
          [
            { token: Token.Bot, status: OracleStatus.WaitResult },
          ],
          { field: 'endTime', direction: sortDirection },
          2,
          skip,
        );
        break;
      }
      case EventStatus.Withdraw: {
        getTopics(
          [
            { status: OracleStatus.Withdraw },
          ],
          { field: 'blockNum', direction: sortDirection },
        );
        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
      }
    }
    console.log('______________');
    console.log(getOraclesReturn);
      
  }

  executeGraphRequest(eventStatusIndex, sortBy, limit, skip) {
    const {
      getTopics,
      getOracles,
    } = this.props;
    const sortDirection = sortBy || SortBy.Ascending;
    switch (eventStatusIndex) {
      case EventStatus.Bet: {
        getOracles(
          [
            { token: Token.Qtum, status: OracleStatus.Voting },
            { token: Token.Qtum, status: OracleStatus.Created },
          ],
          { field: 'endTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Set: {
        getOracles(
          [
            { token: Token.Qtum, status: OracleStatus.WaitResult },
            { token: Token.Qtum, status: OracleStatus.OpenResultSet },
          ],
          { field: 'resultSetEndTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Vote: {
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.Voting },
          ],
          { field: 'endTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Finalize: {
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.WaitResult },
          ],
          { field: 'endTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Withdraw: {
        getTopics(
          [
            { status: OracleStatus.Withdraw },
          ],
          { field: 'blockNum', direction: sortDirection },
        );
        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
      }
    }
  }

  renderOracles(oracles, eventStatusIndex) {
    const rowItems = [];
    _.each(oracles, (oracle) => {
      let buttonText;
      switch (eventStatusIndex) {
        case EventStatus.Bet: {
          buttonText = this.props.intl.formatMessage(messages.placeBet);
          break;
        }
        case EventStatus.Set: {
          buttonText = this.props.intl.formatMessage(messages.setResult);
          break;
        }
        case EventStatus.Vote: {
          buttonText = this.props.intl.formatMessage(messages.vote);
          break;
        }
        case EventStatus.Finalize: {
          buttonText = this.props.intl.formatMessage(messages.finalizeResult);
          break;
        }
        default: {
          throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
        }
      }

      const amount = parseFloat(_.sum(oracle.amounts).toFixed(2));

      // Constructing Card element on the right
      const oracleEle = (
        <EventCard
          key={oracle.txid}
          name={oracle.name}
          url={`/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`}
          endTime={eventStatusIndex === EventStatus.Set ? oracle.resultSetEndTime : oracle.endTime}
          amountLabel={`${amount} ${oracle.token}`}
          buttonText={buttonText}
          unconfirmed={!oracle.topicAddress && !oracle.address}
        />
      );

      rowItems.push(oracleEle);
    });

    return rowItems;
  }

  renderTopics(topicEvents) {
    const rowItems = [];

    _.each(topicEvents, (topic) => {
      const totalQTUM = parseFloat(_.sum(topic.qtumAmount).toFixed(2));
      const totalBOT = parseFloat(_.sum(topic.botAmount).toFixed(2));
      const unconfirmed = false;

      const amountLabel = `${totalQTUM} QTUM, ${totalBOT} BOT`;

      // Constructing Card element on the right
      const topicEle = (
        <EventCard
          key={topic.txid}
          name={topic.name}
          url={`/topic/${topic.address}`}
          amountLabel={amountLabel}
          buttonText={this.props.intl.formatMessage(messages.withdraw)}
          unconfirmed={unconfirmed}
        />
      );

      rowItems.push(topicEle);
    });

    return rowItems;
  }

  render() {
    const {
      theme,
      eventStatusIndex,
      getTopicsReturn,
      getOraclesReturn,
    } = this.props;
    const topics = getTopicsReturn;
    const oracles = getOraclesReturn;
    let rowItems;
    
    switch (eventStatusIndex) {
      case EventStatus.Bet:
      case EventStatus.Set:
      case EventStatus.Vote:
      case EventStatus.Finalize: {
        if (oracles.length) {
          rowItems = this.renderOracles(oracles, eventStatusIndex);
          console.log(eventStatusIndex, rowItems);
          console.log(this.state.skip);
        } else {
          rowItems = <EventsEmptyBg />;
        }

        break;
      }
      case EventStatus.Withdraw: {
        if (topics.length) {
          rowItems = this.renderTopics(topics);
        } else {
          rowItems = <EventsEmptyBg />;
        }

        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
      }
    }
    return (
      <Grid container spacing={theme.padding.sm.value}>
        {/* <ScrollListener loadMore={this.loadMoreOracles} className={this.props.classes.scroll}> */}
        {/* {rowItems} */}
        {/* <button onClick={this.loadMoreOracles} > Click </button> */}
        {/* </ScrollListener> */}
        <InfiniteData className={this.props.classes.scroll} data={rowItems} loadMore={this.loadMoreOracles} hasMore = {rowItems.length >= this.state.skip + 2} />
      </Grid>
    );
  }
}

EventCardsGrid.propTypes = {
  theme: PropTypes.object.isRequired,
  getTopics: PropTypes.func,
  getTopicsReturn: PropTypes.array,
  getOracles: PropTypes.func,
  getOraclesReturn: PropTypes.array,
  eventStatusIndex: PropTypes.number.isRequired,
  sortBy: PropTypes.string,
  syncBlockNum: PropTypes.number,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
  getMoreOracles: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

EventCardsGrid.defaultProps = {
  getTopics: undefined,
  getTopicsReturn: [],
  getOracles: undefined,
  getOraclesReturn: [],
  sortBy: SortBy.Ascending,
  syncBlockNum: undefined,
};

const mapStateToProps = (state) => ({
  getTopicsReturn: state.Graphql.get('getTopicsReturn'),
  getOraclesReturn: state.Graphql.get('getOraclesReturn'),
  sortBy: state.Dashboard.get('sortBy'),
  syncBlockNum: state.App.get('syncBlockNum'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTopics: (filters, orderBy) => dispatch(graphqlActions.getTopics(filters, orderBy)),
    getOracles: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getOracles(filters, orderBy, limit, skip)),
    getMoreOracles: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getMoreOracles(filters, orderBy, limit, skip)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(EventCardsGrid)));

class ScrollListener extends Component {
  componentDidMount() {
    console.log(this.container);
    // if (this.container) {
      this.container.addEventListener('scroll', this.onScroll);
    // }
  }

  componentWillUnmount() {
    // if (this.container) {
      this.container.removeEventListener('scroll', this.onScroll);
    // }
  }

  onScroll = () => {
    console.log('CONTAINER: ', this.container);
    if (!this.container) return;
    const bottomBuffer = 0;
    const offset = this.container.scrollHeight - this.container.offsetHeight;
    const adjustedHeight = offset - bottomBuffer;

    if (this.container.scrollTop > adjustedHeight) {
      this.props.loadMore();
    }
  }

  render() {
    const { loadMore, ...props } = this.props
    return <div {...props} ref={(r) => { this.container = findDOMNode(r); }} />
  };
}


var InfiniteData = React.createClass({

  componentDidMount: function() {
    window.addEventListener('scroll', this.handleOnScroll);

  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleOnScroll);
  },



  handleOnScroll: function() {
    // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    console.log(this.props.hasMore);
    if (scrolledToBottom && this.props.hasMore) {
      this.props.loadMore();
    }
  },

  render: function() {
    return (
      <div className={this.props.className} >
        {this.props.data}
      </div>
        // if (this.state.requestSent) {
        //   return(
        //     <div className="data-loading">
        //       <i className="fa fa-refresh fa-spin"></i>
        //     </div>
        //   );
        // } else {
        //   return(
        //     <div className="data-loading"></div>
        //   );
        // }
    );
  }
});
import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb, Radio } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import CardInfo from '../components/bodhi-dls/cardInfo';
import CardVoting from '../components/bodhi-dls/cardVoting';
import ProgressBar from '../components/bodhi-dls/progressBar';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import dashboardActions from '../redux/dashboard/actions';
import topicActions from '../redux/topic/actions';

const RadioGroup = Radio.Group;
const DEFAULT_RADIO_VALUE = 0;
class TopicPage extends React.Component {
  constructor(props) {
    super(props);

    // Make sure address is defined; otherwise TopicPage don't know what to find

    this.state = {
      address: this.props.match.params.address,
      oracle: undefined, // Topic object for this page
      radioValue: DEFAULT_RADIO_VALUE, // Selected index of optionsIdx[]
    };

    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    // const { getTopicsSuccess, onGetTopics } = this.props;

    // // Retrive topic data if state doesn't already have it
    // if (_.isUndefined(getTopicsSuccess)) {
    //   console.log('calling onGetTopics');
    //   onGetTopics();
    // } else {
    //   const topic = _.find(getTopicsSuccess, { address: this.state.address });
    //   this.setState({ topic });
    // }

    this.props.onGetOracles();
  }

  componentWillReceiveProps(nextProps) {
    const { getOraclesSuccess } = nextProps;

    if (!_.isEmpty(getOraclesSuccess)) {
      const oracle = _.find(getOraclesSuccess, { address: this.state.address });

      this.setState({ oracle });
      // let oracle = undefined;

      // // Determine current phase of this topic
      // if(topic.oracles.length === 1)
      // {
      //   // Centralised oracle
      //   oracle = topic.oracles[0];
      // }
      // else if(topic.oracles.length >1)
      // {
      //   // Decentralised oracle
      //   oracle = _.last(topic.oracles);
      // }
      // else if( topic.resultIdx !== -1){
      //   // Finished oracles
      //  oracle = _.last();
      // }
      // else{

      //   // default phase - oracles empty
      //   // Display something on page
      //   console.log(`Oracle is empty.`);
      // }

      // const lastOracle = _.last(topic.oracles);

      // if (lastOracle) {
      //   console.log('Found oracle', lastOracle);

      //   this.setState({
      //     oracle: lastOracle,
      //   });
      // } else {
      //   console.log('topic not load yet');
      // }
    } else {
      console.log('getOraclesSuccess is empty');
    }
  }

  onRadioGroupChange(evt) {
    console.log(`Radio value change ${evt.target.value}`);

    this.setState({
      radioValue: evt.target.value,
    });
  }

  /** Confirm button on click handler passed down to CardVoting */
  onSubmit(obj) {
    const { oracle, radioValue } = this.state;

    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const { amount } = obj;

    // const result = _.assign({}, obj, {
    //   optionIdxsIndex: radioValue,
    //   optionSelected: oracle && !_.isEmpty(oracle.options) && !_.isEmpty(oracle.optionIdxs) ?
    //     oracle.options[selectedIndex] :
    //     undefined,
    // });

    console.log(`selectedIndex is ${selectedIndex}, amount is ${amount}`);
    const senderAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';

    this.props.onBet(selectedIndex, amount, senderAddress);
  }

  render() {
    const { editingToggled } = this.props;
    const { oracle } = this.state;

    if (!oracle) {
      // TODO: render no result page
      return <div></div>;
    }

    const timeline = [{
      label: 'Prediction start block',
      value: oracle.blockNum,
    }, {
      label: 'Prediction end block',
      value: oracle.endBlock,
    }];

    const totalBalance = _.sum(oracle.amounts);
    const { token } = oracle;
    const betBalance = _.map(oracle.optionIdxs, (optIndex, index) => ({
      name: oracle.options[optIndex],
      value: `${oracle.amounts[index]} ${oracle.token}`,
      percent: _.floor((oracle.amounts[index] / totalBalance) * 100),
    }));

    const oracleElement = (<Row
      gutter={28}
      justify="center"
    >

      <Col xl={12} lg={12}>
        <IsoWidgetsWrapper padding="32px" >

          <CardInfo
            title={oracle.name}
            timeline={timeline}
          >

          </CardInfo>
        </IsoWidgetsWrapper>

      </Col>
      <Col xl={12} lg={12}>
        <IsoWidgetsWrapper padding="32px">
          {this.props.betResult}
          <CardVoting amount={totalBalance} token={token} voteBalance={betBalance} onSubmit={this.onSubmit}>
            {editingToggled
              ?
              (
                <RadioGroup onChange={this.onRadioGroupChange} value={this.state.radioValue} size="large" defaultValue={DEFAULT_RADIO_VALUE}>
                  {betBalance.map((entry, index) => (
                    <Radio value={index + 1} key={entry.name}>
                      <ProgressBar
                        label={entry.name}
                        value={entry.value}
                        percent={entry.percent}
                        barHeight={12}
                        info
                      />
                    </Radio>))
                  }
                </RadioGroup>
              )
              :
              betBalance.map((entry) => (
                <ProgressBar
                  key={entry.name}
                  label={entry.name}
                  value={entry.value}
                  percent={entry.percent}
                  barHeight={12}
                  info
                  marginBottom={18}
                />))
            }
          </CardVoting>
        </IsoWidgetsWrapper>
      </Col>

    </Row>);

    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh' }}>
        <Row style={{ width: '100%', height: '48px' }}>
          <Breadcrumb style={{ fontSize: '16px' }}>
            <Breadcrumb.Item><Link to="/">Event</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Ongoing</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row style={{ width: '100%' }}>
          {oracleElement}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

TopicPage.propTypes = {
  // getTopicsSuccess: PropTypes.oneOfType([
  //   PropTypes.array, // Result array
  //   PropTypes.string, // error message
  //   PropTypes.bool, // No result
  // ]),
  editingToggled: PropTypes.bool,
  match: PropTypes.object,
  // onGetTopics: PropTypes.func,
  onBet: PropTypes.func,
  betResult: PropTypes.object,
  getOraclesSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  // getOraclesError: PropTypes.string,
  onGetOracles: PropTypes.func,
};

TopicPage.defaultProps = {
  // getTopicsSuccess: undefined,
  editingToggled: false,
  match: {},
  // onGetTopics: undefined,
  onBet: undefined,
  betResult: undefined,
  getOraclesSuccess: [],
  // getOraclesError: '',
  onGetOracles: undefined,
};

const mapStateToProps = (state) => ({
  // getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  editingToggled: state.Topic.get('toggled'),
  betResult: state.Topic.get('bet_result'),
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  // getOraclesError: !state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
});

function mapDispatchToProps(dispatch) {
  return {
    // onGetTopics: () => dispatch(dashboardActions.getTopics()),
    onGetOracles: () => dispatch(dashboardActions.getOracles()),
    onBet: (index, amount, senderAddress) => dispatch(topicActions.onBet(index, amount, senderAddress)),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);

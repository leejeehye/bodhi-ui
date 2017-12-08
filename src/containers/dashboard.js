import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import BottomButtonWidget from './Widgets/bottom-button';
import SingleProgressWidget from './Widgets/progress/progress-single';
import ReportsWidget from './Widgets/report/report-widget';
import TabBtnGroup from '../components/bodhi-dls/tabBtnGroup';
import dashboardActions from '../redux/dashboard/actions';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {
    this.props.onGetTopics();
    this.props.onGetOracles();
  }

  render() {
    const numShowInOptions = 3;

    // Specify how many col in each row
    const colPerRow = {
      xs: 1,
      sm: 3,
      xl: 4,
    };

    const rowGutter = {
      xs: 0,
      sm: 16, // Set gutter to 16 + 8 * n, with n being a natural number
      md: 24,
      lg: 24,
      xl: 32,
      xxl: 32,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};
    Object.keys(colPerRow).forEach((key) => {
      colWidth[key] = 24 / colPerRow[key];
    });

    const topicArray = [];
    if (this.props.getTopicsSuccess && this.props.getTopicsSuccess.length > 0) {
      _.each(this.props.getTopicsSuccess, (entry) => {
        let qtumTotal = 0;
        for (let i = 0; i < entry.qtumAmount.length; i++) {
          qtumTotal += entry.qtumAmount[i];
        }
        const raisedString = 'Raised: '.concat(qtumTotal).concat(' QTUM');

        const entryEle =
          (<Col xs={colWidth.xs} sm={colWidth.sm} xl={colWidth.xl} key={entry.address} style={{ marginBottom: '24px' }}>
            <IsoWidgetsWrapper>
              {/* Report Widget */}
              <ReportsWidget
                label={entry.name}
                details={[raisedString, 'Ends: 12/21/2017']}
              >
                {entry.options.slice(0, numShowInOptions).map((result) => (<SingleProgressWidget
                  key={result}
                  label={result}
                  percent={_.random(100)}
                  barHeight={12}
                  status="active"
                  fontColor="#4A4A4A"
                  info
                />))}
              </ReportsWidget>

              <BottomButtonWidget />
            </IsoWidgetsWrapper>
          </Col>);

        topicArray.push(entryEle);
      });
    }

    const oraclesArray = [];
    if (this.props.getOraclesSuccess && this.props.getOraclesSuccess.length > 0) {
      _.each(this.props.getOraclesSuccess, (entry) => {
        console.log(entry);
        // const entryEle =
        //   (<Col xs={colWidth.xs} sm={colWidth.sm} xl={colWidth.xl} key={entry.address} style={{ marginBottom: '24px' }}>
        //     <IsoWidgetsWrapper>
        //       {/* Report Widget */}
        //       <ReportsWidget
        //         label={entry.name}
        //         details={['Raised: 398,841,00 QTUM', 'Ends: 12/21/2017']}
        //       >
        //         {entry.options.slice(0, numShowInOptions).map((result) => (<SingleProgressWidget
        //           key={result}
        //           label={result}
        //           percent={_.random(100)}
        //           barHeight={12}
        //           status="active"
        //           fontColor="#4A4A4A"
        //           info
        //         />))}
        //       </ReportsWidget>

        //       <BottomButtonWidget />
        //     </IsoWidgetsWrapper>
        //   </Col>);

        // topicArray.push(entryEle);
      });
    }

    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
        <TabBtnGroup
          buttons={[{
            text: 'OnGoing',
          }, {
            text: 'Voting',
          }, {
            text: 'Completed',
          }]}
        />
        <Row
          // style={rowStyle}
          gutter={28}
          justify="center"
        >
          {topicArray}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

Dashboard.propTypes = {
  getTopicsSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  onGetTopics: PropTypes.func,
  getOraclesSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  onGetOracles: PropTypes.func,
};

Dashboard.defaultProps = {
  getTopicsSuccess: [],
  onGetTopics: undefined,
  getOraclesSuccess: [],
  onGetOracles: undefined,
};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  getTopicsError: !state.Dashboard.get('success') && state.Dashboard.get('value'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTopics: () => dispatch(dashboardActions.getTopics()),
    onGetOracles: () => dispatch(dashboardActions.getOracles()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

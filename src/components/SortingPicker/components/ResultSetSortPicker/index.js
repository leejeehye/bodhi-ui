import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import dashboardActions from '../../../../redux/Dashboard/actions';
import { SortOption, SortBy, SortMethod } from '../../../../constants';

@injectIntl
@connect(null, (dispatch) => ({
  sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
}))
export default class ResultSetSortPicker extends Component {
  static propTypes = {
    sortOrderChanged: PropTypes.func,
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
      case SortMethod.EndingSoon: {
        this.setState({ sortMethod: 'Ending Soon' });
        sortOption = SortOption.ResultSetEndTime;
        sortOrder = SortBy.Ascending;
        break;
      }
      case SortMethod.Upcoming: {
        this.setState({ sortMethod: 'Upcoming' });
        sortOption = SortOption.ResultSetStartTime;
        sortOrder = SortBy.Descending;
        break;
      }
      default: {
        break;
      }
    }
    const sortBy = { sortOption, sortOrder };
    this.props.sortOrderChanged(sortBy);
  };


  render() {
    return (
      <Select disableUnderline value={this.state.sortMethod} onChange={this.onSortOptionSelected}>
        <MenuItem value="Ending Soon"><FormattedMessage id="sort.endingSoon" defaultMessage="Ending Soon" /></MenuItem>
        <MenuItem value="Upcoming"><FormattedMessage id="sort.upcoming" defaultMessage="Upcoming" /></MenuItem>
      </Select>
    );
  }
}

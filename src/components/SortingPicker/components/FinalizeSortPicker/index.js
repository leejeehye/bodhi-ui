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
export default class BetSortPicker extends Component {
  static propTypes = {
    sortOrderChanged: PropTypes.func,
  };

  static defaultProps = {
    sortOrderChanged: undefined,
  };

  state = {
    sortMethod: 'Upcoming',
  }

  onSortOptionSelected = (event) => {
    let sortOption;
    let sortOrder;

    switch (event.target.value) {
      case SortMethod.Upcoming: {
        this.setState({ sortMethod: 'Upcoming' });
        sortOption = SortOption.StartTime;
        sortOrder = SortBy.Descending;
        break;
      }
      case SortMethod.EndingSoon: {
        this.setState({ sortMethod: 'Ending Soon' });
        sortOption = SortOption.EndTime;
        sortOrder = SortBy.Ascending;
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
        <MenuItem value="Upcoming"><FormattedMessage id="sort.upcoming" defaultMessage="Upcoming" /></MenuItem>
        <MenuItem value="Ending Soon"><FormattedMessage id="sort.endingSoon" defaultMessage="Ending Soon" /></MenuItem>
      </Select>
    );
  }
}

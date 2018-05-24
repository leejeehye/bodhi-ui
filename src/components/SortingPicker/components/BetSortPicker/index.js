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
    sortMethod: 'Ending Soon',
  }

  onSortOptionSelected = (event) => {
    let sortOption;
    let sortOrder;

    switch (event.target.value) {
      case SortMethod.LatestCreated: {
        this.setState({ sortMethod: 'Latest Created' });
        sortOption = SortOption.CreationTime;
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
        <MenuItem value="Ending Soon"><FormattedMessage id="sort.endingSoon" defaultMessage="Ending Soon" /></MenuItem>
        <MenuItem value="Latest Created"><FormattedMessage id="sort.latestCreated" defaultMessage="Latest Created" /></MenuItem>
      </Select>
    );
  }
}

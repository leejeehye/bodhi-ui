import _ from 'lodash';
import gql from 'graphql-tag';

import client from './graphClient';
import GraphParser from './graphParser';
import { TYPE, isValidEnum, getTypeDef } from './graphSchema';

class GraphQuery {
  constructor(queryName, type) {
    this.queryName = queryName;
    this.type = type;
    this.filters = undefined;
    this.orderBy = undefined;
    this.limit = undefined;
    this.skip = undefined;
  }

  setFilters(filters) {
    this.filters = filters;
  }

  setOrderBy(orderBy) {
    this.orderBy = orderBy;
  }

  setLimit(limit) {
    this.limit = limit;
  }

  setSkip(skip) {
    this.skip = skip;
  }

  formatObject(obj) {
    const str = Object
      .keys(obj)
      .map((key) => {
        const value = obj[key];
        if (isValidEnum(key, value) || !_.isString(value)) {
          // Enums require values without quotes
          return `${key}: ${value}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(', ');
    return `{ ${str} }`;
  }

  getFilterString() {
    let filterStr = '';
    if (this.filters) {
      // Create entire string for OR: [] as objects
      _.forEach(this.filters, (obj) => {
        if (!_.isEmpty(filterStr)) {
          filterStr = filterStr.concat(', ');
        }
        filterStr = filterStr.concat(this.formatObject(obj));
      });

      filterStr = `
        filter: { 
          OR: [ 
            ${filterStr} 
          ]
        }
      `;
    }
    return filterStr;
  }

  getOrderByString() {
    let orderByStr = '';
    if (this.orderBy) {
      orderByStr = this.formatObject(this.orderBy);
    }
    return _.isEmpty(orderByStr) ? '' : `orderBy: ${orderByStr}`;
  }

  getLimitString() {
    let limitStr = '';
    if (this.limit) {
      limitStr = this.limit;
    }
    return limitStr === '' ? '' : `limit: ${limitStr}`;
  }

  getSkipString() {
    let skipStr = '';
    if (this.skip) {
      skipStr = this.skip;
    }
    return skipStr === '' ? '' : `skip: ${skipStr}`;
  }

  build() {
    const filterStr = this.getFilterString();
    const orderByStr = this.getOrderByString();
    const limitStr = this.getLimitString();
    const skipStr = this.getSkipString();
    const funcParamOpen = !_.isEmpty(filterStr) || !_.isEmpty(orderByStr) || !_.isEmpty(limitStr) || !_.isEmpty(skipStr) ? '(' : '';
    const funcParamClose = !_.isEmpty(filterStr) || !_.isEmpty(orderByStr) || !_.isEmpty(limitStr) || !_.isEmpty(skipStr) ? ')' : '';

    const query = `
      query {
        ${this.queryName}${funcParamOpen}
          ${filterStr}
          ${orderByStr}
          ${limitStr}
          ${skipStr}
        ${funcParamClose} {
          ${getTypeDef(this.type)}
        }
      }
    `;
    return query;
  }

  async execute() {
    const query = this.build();
    const res = await client.query({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
    });
    // console.log(query);
    return GraphParser.getParser(this.type)(res.data[this.queryName]);
  }
}

/*
* Queries allTopics from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'ASC' }
*/
export function queryAllTopics(filters, orderBy) {
  const request = new GraphQuery('allTopics', TYPE.topic);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  return request.execute();
}

/*
* Queries allOracles from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export function queryAllOracles(filters, orderBy, limit, skip) {
  const request = new GraphQuery('allOracles', TYPE.oracle);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (_.isInteger(limit)) {
    request.setLimit(limit);
  }
  if (_.isInteger(skip)) {
    request.setSkip(skip);
  }
  return request.execute();
}

/*
* Queries allTransactions from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export function queryAllTransactions(filters, orderBy) {
  const request = new GraphQuery('allTransactions', TYPE.transaction);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  return request.execute();
}

/*
* Queries syncInfo from GraphQL.
*/
export function querySyncInfo() {
  return new GraphQuery('syncInfo', TYPE.syncInfo).execute();
}

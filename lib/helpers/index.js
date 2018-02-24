'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapOwnPropsFunc = wrapOwnPropsFunc;
exports.wrapStatesFunc = wrapStatesFunc;
exports.wrapActionsFunc = wrapActionsFunc;
/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */

function wrapOwnPropsFunc() {
  var ownProps = {};
  var data = this.$data || {};
  var props = this.props || {};
  Object.keys(props).forEach(function (key) {
    ownProps[key] = data[key];
  });
  return ownProps;
}

function wrapStatesFunc(states) {
  var wrapStates = {};
  Object.keys(states).forEach(function (key) {
    wrapStates[key] = function mappedState() {
      return states[key];
    };
  });
  return wrapStates;
}

function wrapActionsFunc(actions) {
  var wrapActions = {};
  Object.keys(actions).forEach(function (key) {
    wrapActions[key] = function mappedAction(payload) {
      if (payload.name === 'system' && payload.target && payload.target.dataset) {
        return actions[key](payload.target.dataset);
      } else {
        return actions[key](payload);
      }
    };
  });
  return wrapActions;
}
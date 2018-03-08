'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.wrapOwnPropsFunc = wrapOwnPropsFunc;
exports.wrapStatesFunc = wrapStatesFunc;
exports.wrapActionsFunc = wrapActionsFunc;
exports.injectGlobalProps = injectGlobalProps;
exports.injectGlobalPayload = injectGlobalPayload;
/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */

var globalProps = {};
var globalPayload = {};

function wrapOwnPropsFunc() {
  var ownProps = _extends({}, globalProps);
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
      if (payload && payload.name === 'system' && payload.target && payload.target.dataset) {
        return actions[key](Object.assign({}, globalPayload, payload.target.dataset));
      } else {
        return actions[key](Object.assign({}, globalPayload, payload));
      }
    };
  });
  return wrapActions;
}

function injectGlobalProps(props) {
  Object.keys(props).forEach(function (key) {
    globalProps[key] = props[key];
  });
}

function injectGlobalPayload(payload) {
  Object.keys(payload).forEach(function (key) {
    globalPayload[key] = payload[key];
  });
}
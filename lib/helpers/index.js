'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapownProps = wrapownProps;
/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */

function wrapownProps() {
  var ownProps = {};
  var data = this.$data || {};
  var props = this.props || {};
  Object.keys(props).forEach(function (key) {
    ownProps[key] = data[key];
  });
  ownProps.platform = 'web';
  return ownProps;
}
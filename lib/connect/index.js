'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = connect;

var _store = require('../store');

var _helpers = require('../helpers');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Empty JS File be created by WebStorm
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Author: suming
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Date: 2018/2/22
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Time: 上午11:42
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

function connect(mapStateToProps, mapDispatchToProps, cleanData) {
  var injectedProps = {};
  return function connectComponent(Component) {
    var unSubscribe = null;
    // 绑定
    var onLoadCopy = Component.prototype.onLoad;
    var onUnloadCopy = Component.prototype.onUnload;

    var onStateChange = function onStateChange() {
      var _this = this;

      var store = (0, _store.getStore)();
      var hasChanged = false;
      var ownProps = Object.assign(_helpers.wrapOwnPropsFunc.call(this), injectedProps);
      var states = mapStateToProps(store.getState(), ownProps);
      var data = this.$data || {};
      Object.keys(states).forEach(function (key) {
        if (_this.computed) {
          _this.computed[key] = function mappedState() {
            return states[key];
          };
        }
        if (!data.hasOwnProperty(key)) _this.$data[key] = undefined;
      });
      Object.keys(states).forEach(function (k) {
        var newV = states[k];
        if (_this[k] !== newV) {
          // 不相等
          _this[k] = newV;
          hasChanged = true;
        }
      });
      hasChanged && this.$apply();
    };
    return function (_Component) {
      _inherits(_class, _Component);

      function _class() {
        _classCallCheck(this, _class);

        var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        var store = (0, _store.getStore)();
        var ownProps = Object.assign(_helpers.wrapOwnPropsFunc.call(_this2), injectedProps);
        var states = mapStateToProps(store.getState(), ownProps);
        var wrapStates = (0, _helpers.wrapStatesFunc)(states);
        _this2.computed = Object.assign({}, wrapStates, _this2.computed || {});
        var wrapActions = (0, _helpers.wrapActionsFunc)(mapDispatchToProps(store.dispatch, ownProps));
        _this2.methods = Object.assign(_this2.methods || {}, wrapActions, {
          injectProps: function injectProps(props) {
            Object.assign(injectedProps, props);
            var newProps = Object.assign(_helpers.wrapOwnPropsFunc.call(_this2), injectedProps);
            var newActions = (0, _helpers.wrapActionsFunc)(mapDispatchToProps(store.dispatch, newProps));
            _this2.methods = Object.assign(_this2.methods || {}, newActions);
          }
        });
        return _this2;
      }

      _createClass(_class, [{
        key: 'onLoad',
        value: function onLoad() {
          var store = (0, _store.getStore)();
          unSubscribe = store.subscribe(onStateChange.bind(this));
          onStateChange.call(this);
          onLoadCopy && onLoadCopy.apply(this, arguments);
        }
      }, {
        key: 'onUnload',
        value: function onUnload() {
          var _this3 = this;

          unSubscribe && unSubscribe();
          unSubscribe = null;
          onUnloadCopy && onUnloadCopy.apply(this, arguments);
          // 清理缓存
          if (cleanData && Array.isArray(cleanData)) {
            cleanData.forEach(function (key) {
              _this3.computed[key] = function mappedState() {};
              _this3[key] = null;
            });
          }
        }
      }]);

      return _class;
    }(Component);
  };
};
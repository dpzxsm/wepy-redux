'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = connect;

var _store = require('../store');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Tencent is pleased to support the open source community by making WePY available.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * http://opensource.org/licenses/MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

function connect(mapStateToProps, mapActionToProps) {
  return function connectComponent(Component) {
    var unSubscribe = null;
    // 绑定
    var _onLoad = Component.prototype.onLoad;
    var _onUnload = Component.prototype.onUnload;

    var wrapActions = {};
    var wrapStates = {};

    var onStateChange = function onStateChange() {
      var _this = this;

      var store = (0, _store.getStore)();
      var hasChanged = false;
      // 这里判断是否需要更新组件
      var ownProps = {};
      var data = this.$data || {};
      var props = this.props || {};
      Object.keys(props).forEach(function (key) {
        ownProps[key] = data[key];
      });
      ownProps.platform = 'web';
      var states = mapStateToProps(store.getState(), ownProps);
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
        var ownProps = {};
        var data = _this2.$data || {};
        var props = _this2.props || {};
        Object.keys(props).forEach(function (key) {
          ownProps[key] = data[key];
        });
        ownProps.platform = 'web';
        var states = mapStateToProps(store.getState(), ownProps);
        Object.keys(states).forEach(function (key) {
          wrapStates[key] = function () {
            return states[key];
          };
        });
        _this2.computed = Object.assign(_this2.computed || {}, wrapStates);
        var actions = mapActionToProps(store.dispatch, ownProps);
        Object.keys(actions).forEach(function (key) {
          wrapActions[key] = function (payload) {
            if (payload.name === 'system' && payload.target && payload.target.dataset) {
              return actions[key](payload.target.dataset);
            } else {
              return actions[key](payload);
            }
          };
        });
        _this2.methods = Object.assign(_this2.methods || {}, wrapActions);
        return _this2;
      }

      _createClass(_class, [{
        key: 'onLoad',
        value: function onLoad() {
          var store = (0, _store.getStore)();
          unSubscribe = store.subscribe(onStateChange.bind(this));
          onStateChange.call(this);
          _onLoad && _onLoad.apply(this, arguments);
        }
      }, {
        key: 'onUnload',
        value: function onUnload() {
          unSubscribe && unSubscribe();
          unSubscribe = null;
          _onUnload && _onUnload.apply(this, arguments);
        }
      }]);

      return _class;
    }(Component);
  };
};
/**
 * Tencent is pleased to support the open source community by making WePY available.
 * Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import { getStore } from '../store'

export default function connect (mapStateToProps, mapActionToProps) {
  return function connectComponent (Component) {
    let unSubscribe = null
    // 绑定
    const onLoad = Component.prototype.onLoad
    const onUnload = Component.prototype.onUnload

    let wrapActions = {}
    let wrapStates = {}

    const onStateChange = function () {
      const store = getStore()
      let hasChanged = false
      // 这里判断是否需要更新组件
      let ownProps = {}
      let data = this.$data || {}
      let props = this.props || {}
      Object.keys(props).forEach((key) => {
        ownProps[key] = data[key]
      })
      ownProps.platform = 'web'
      let states = mapStateToProps(store.getState(), ownProps)
      Object.keys(states).forEach((k) => {
        const newV = states[k];
        if (this[k] !== newV) {
          // 不相等
          this[k] = newV;
          hasChanged = true;
        }
      });
      hasChanged && this.$apply()
    }
    return class extends Component {
      constructor () {
        super()
        const store = getStore()
        let ownProps = {}
        let data = this.$data || {}
        let props = this.props || {}
        Object.keys(props).forEach((key) => {
          ownProps[key] = data[key]
        })
        ownProps.platform = 'web'
        let states = mapStateToProps(store.getState(), ownProps)
        Object.keys(states).forEach((key) => {
          wrapStates[key] = function mappedState() {
            return states[key]
          }
        })
        this.computed = Object.assign(this.computed || {}, wrapStates)
        let actions = mapActionToProps(store.dispatch, ownProps)
        Object.keys(actions).forEach((key) => {
          wrapActions[key] = function (payload) {
            if (payload.name === 'system' && payload.target && payload.target.dataset) {
              return actions[key](payload.target.dataset)
            } else {
              return actions[key](payload)
            }
          }
        })
        this.methods = Object.assign(this.methods || {}, wrapActions)
      }

      onLoad () {
        const store = getStore()
        unSubscribe = store.subscribe(onStateChange.bind(this))
        onStateChange.call(this)
        onLoad && onLoad.apply(this, arguments)
      }

      onUnload () {
        unSubscribe && unSubscribe()
        unSubscribe = null
        onUnload && onUnload.apply(this, arguments)
      }
    }
  }
};
/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */

import { getStore } from '../store'
import { wrapOwnPropsFunc, wrapStatesFunc,  wrapActionsFunc } from '../helpers'

export default function connect (mapStateToProps, mapActionToProps) {
  return function connectComponent (Component) {
    let unSubscribe = null
    // 绑定
    const onLoadCopy = Component.prototype.onLoad
    const onUnloadCopy = Component.prototype.onUnload

    const onStateChange = function () {
      const store = getStore()
      let hasChanged = false
      let states = mapStateToProps(store.getState(), wrapOwnPropsFunc.call(this))
      Object.keys(states).forEach((key) => {
        if(this.computed){
          this.computed[key] = function mappedState() {
            return states[key]
          }
        }
      })
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
        let ownProps =  wrapOwnPropsFunc.call(this)
        let states = mapStateToProps(store.getState(), ownProps)
        let wrapStates = wrapStatesFunc(states)
        this.computed = Object.assign(this.computed || {}, wrapStates, {
          $state: function mappedState() {
            return store.getState()
          }
        })
        let wrapActions = wrapActionsFunc(mapActionToProps(store.dispatch, ownProps))
        this.methods = Object.assign(this.methods || {}, wrapActions)
      }

      onLoad () {
        const store = getStore()
        unSubscribe = store.subscribe(onStateChange.bind(this))
        onStateChange.call(this)
        onLoadCopy && onLoadCopy.apply(this, arguments)
      }

      onUnload () {
        unSubscribe && unSubscribe()
        unSubscribe = null
        onUnloadCopy && onUnloadCopy.apply(this, arguments)
      }
    }
  }
};

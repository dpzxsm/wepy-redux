/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */

import { getStore } from '../store'
import { wrapOwnPropsFunc, wrapStatesFunc,  wrapActionsFunc } from '../helpers'

export default function connect (mapStateToProps, mapDispatchToProps, isClean) {
  const injectedProps = {}
  return function connectComponent (Component) {
    let unSubscribe = null
    // 绑定
    const onLoadCopy = Component.prototype.onLoad
    const onUnloadCopy = Component.prototype.onUnload

    const onStateChange = function () {
      const store = getStore()
      let hasChanged = false
      let ownProps =  Object.assign(wrapOwnPropsFunc.call(this), injectedProps)
      let states = mapStateToProps(store.getState(), ownProps)
      let data = this.$data || {}
      Object.keys(states).forEach((key) => {
        if(this.computed){
          this.computed[key] = function mappedState() {
            return states[key]
          }
        }
        if(!data.hasOwnProperty(key)) this.$data[key] = undefined
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
        let ownProps =  Object.assign(wrapOwnPropsFunc.call(this), injectedProps)
        let states = mapStateToProps(store.getState(), ownProps)
        let wrapStates = wrapStatesFunc(states)
        this.computed = Object.assign(this.computed || {}, wrapStates)
        let wrapActions = wrapActionsFunc(mapDispatchToProps(store.dispatch, ownProps))
        this.methods = Object.assign(this.methods || {}, wrapActions, {
          injectProps: function (props) {
            Object.assign(injectedProps, props)
          }
        })
      }

      onLoad () {
        const store = getStore()
        if(isClean){
          let ownProps =  Object.assign(wrapOwnPropsFunc.call(this), injectedProps)
          let states = mapStateToProps(store.getState(), ownProps)
          Object.keys(states).forEach((key) => {
            states[key] = null
          })
          this.setData(states)
        }
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

/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */

import { getStore } from '../store'
import { wrapOwnPropsFunc, wrapStatesFunc,  wrapActionsFunc } from '../helpers'

export default function connect (mapStateToProps, mapDispatchToProps, cleanData) {
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
        this.computed = Object.assign({},  wrapStates, this.computed || {})
        let wrapActions = wrapActionsFunc(mapDispatchToProps(store.dispatch, ownProps))
        this.methods = Object.assign(this.methods || {}, wrapActions, {
          injectProps: (props) => {
            Object.assign(injectedProps, props)
            let newProps =  Object.assign(wrapOwnPropsFunc.call(this), injectedProps)
            let newActions = wrapActionsFunc(mapDispatchToProps(store.dispatch, newProps))
            this.methods = Object.assign(this.methods || {}, newActions)
          }
        })
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
        // 清理缓存
        if(cleanData && Array.isArray(cleanData)){
          cleanData.forEach((key) => {
            this.computed[key] = function mappedState() {}
            this[key] = null
          })}
      }
    }
  }
};

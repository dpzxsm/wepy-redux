/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */

const globalProps = {}
const globalPayload = {}

export function wrapOwnPropsFunc() {
  let ownProps = { ...globalProps }
  let data = this.$data || {}
  let props = this.props || {}
  Object.keys(props).forEach((key) => {
    ownProps[key] = data[key]
  })
  return ownProps
}


export function wrapStatesFunc (states) {
  let wrapStates = {}
  Object.keys(states).forEach((key) => {
    wrapStates[key] = function mappedState() {
      return states[key]
    }
  })
  return wrapStates
}

export function wrapActionsFunc (actions) {
  let wrapActions = {}
  Object.keys(actions).forEach((key) => {
    wrapActions[key] = function mappedAction(payload) {
      if (payload && payload.name === 'system' && payload.target && payload.target.dataset) {
        return actions[key](Object.assign({}, globalPayload, payload.target.dataset))
      } else {
        return actions[key](Object.assign({}, globalPayload, payload))
      }
    }
  })
  return wrapActions
}


export function injectGlobalProps (props) {
  Object.keys(props).forEach((key) => {
    globalProps[key] = props[key]
  })
}

export function injectGlobalPayload (payload) {
  Object.keys(payload).forEach((key) => {
    globalPayload[key] = payload[key]
  })
}

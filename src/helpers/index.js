/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */

export function wrapOwnPropsFunc() {
  let ownProps = {}
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
      if (payload.name === 'system' && payload.target && payload.target.dataset) {
        return actions[key](payload.target.dataset)
      } else {
        return actions[key](payload)
      }
    }
  })
  return wrapActions
}

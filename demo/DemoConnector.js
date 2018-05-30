/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/5/30
 * Time: 上午10:08
 *
 */
import { connect } from 'wepy-redux'
import { bindActionCreators } from 'redux'

const actions = {
  changeName: (dispatch, getState) => {

  },
  changeAge: (dispatch, getState) => {

  }
}

export default connect((state, ownProp) => {
  // 这里可以取到Demo组件的props值，从而可以做相应处理
  let title = ownProp.title
  let content = ownProp.content
  return {
    name: state.name ,
    age: state.age
  }
}, (dispatch, ownProps) => {
  // 这里可以取到Demo组件的props值，从而可以做相应处理
  let title = ownProp.title
  let content = ownProp.content
  return bindActionCreators({
    ...actions
  }, dispatch)
})
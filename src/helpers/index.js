/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2018/2/22
 * Time: 上午11:42
 *
 */
 
export function wrapownProps() {
  let ownProps = {}
  let data = this.$data || {}
  let props = this.props || {}
  Object.keys(props).forEach((key) => {
    ownProps[key] = data[key]
  })
  ownProps.platform = 'web'
  return ownProps
}
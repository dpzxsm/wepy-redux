# wepy-redux
如果你的小程序项目使用了wepy框架，那么你可以选择这个库作为redux的链接库或者迁移react-redux项目到小程序上

### 安装
npm install git+https:\/\/github.com/dpzxsm/wepy-redux.git --save

### 介绍
此框架参考wepy提供的wepy-redux[传送门](https://github.com/Tencent/wepy/blob/2.0.x/packages/wepy-redux/README.md)，不同的是，采用类似于react-redux的写法，完全兼容react-redux的mapStateToProps和mapDispatchToProps参数，适合熟悉react-redux的开发人员的编写习惯和使用了react的redux项目迁移

### 用法
部分可以参考rect-redux, [链接](https://github.com/reactjs/react-redux)

由于wepy框架的组件并不是和react组件具有一样的属性，所以mapStateToProps函数和mapDispatchToProps函数的中ownProps参数只能模拟实现，实现方式有点复杂，不多做解释。
ownProps的属性主要是被连接的组件的props属性，值则是从组件data中获取。当然很多情况，不需要去使用wepy中的props，这种情况下，默认给组件的method中提供了一个injectProps函数用于直接给ownProps添加属性

详细示例可以参考项目中的demo文件夹

### API

| 可以被import的属性 | 类型 | 参数 | 描述 |
|-------------|----------|--------------|----------------------------------------------------------------|
| `connect` | `Function` | (func, func, array) | redux链接函数 |
| `setStore`   | `Function` | (obj) | 设置store的实例 |
| `getStore`     | `Function` | () | 获取store的实例 |
| `injectGlobalProps`     | `Function` | (obj) | 全局对ownProps参数注入属性 |
| `injectGlobalPayload`     | `Function` | (obj) | 全局对action参数注入属性 |

#### connect

前两个参数同react-redux, 为函数类型，其中第一个参数可以将state中的属性注入到组件的data中，第二个参数则是将action注入到组件的methods中。第三个参数则是数组类型，可以在页面销毁后清空你想要清空的data属性，主要用于解决小程序的页面缓存bug

示例：
```javascript
export default connect((state, ownProp) => {
  return {
    name: state.name,
    age: state.age
  }
}, (dispatch, ownProps) => {
  return bindActionCreators({
    ...actions
  }, dispatch)
})
```

#### setStore
相当于初始化，必须在项目初始化的时候去设置，可以在app.wpy中调用

示例：
```javascript
const store = createStore(reducer, applyMiddleware(thunk, logger))
setStore(store)
```

### getStore
某些情况想直接使用store对象，可以来获取实例，通常不建议使用

示例：
```javascript
const store = getStore()
let state = store.getState()
let dispatch = store.dispatch
```

### injectGlobalProps
顾名思义，就是给所有的ownProps添加静态属性, 大部分情况下用不着，谨慎使用

示例：
```javascript
injectGlobalProps({ version: '1.0.0' })
```

### injectGlobalProps
顾名思义，就是给所有的action添加静态参数, 大部分情况下用不着，谨慎使用

示例：
```javascript
injectGlobalPayload({ version: '1.0.0' })
```

### 最后
感谢wepy以及它的作者
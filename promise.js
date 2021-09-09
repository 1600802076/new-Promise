// 模拟Promise实现
/**
 * Promise的三种状态，状态一旦被转化就不可再更改
 * Pending 就绪态，新建时默认该状态
 * Fulfilled 成功态，只能由Pending -> Fulfilled
 * Rejected 失败态，只能由Pending -> Rejected
 */

class MyPromise {
  // 以下使用静态属性，只允许原型访问
  static value = null // 成功的返回值

  static reason = null // 失败的原因

  static status = 'pending' // 初始状态

  // 处理多then调用，将回调存入队列遍历执行

  static onFulfilledCallbackQueue = []

  static onRejectedCallbackQueue = []


  static resolve = (val) => { // 实现resolve
    if (MyPromise.status === 'pending') {
      MyPromise.status = 'fulfilled'
      MyPromise.value = val
      while (this.onFulfilledCallbackQueue.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbackQueue.shift()(val)
      }
    }
  }

  static reject = (reason) => {
    if (MyPromise.status === 'pending') {
      MyPromise.status = 'rejected'
      MyPromise.reason = reason
      // 遍历所有已收集的回调，依次执行
      while (this.onRejectedCallbackQueue.length) {
        this.onRejectedCallbackQueue.shift()(reason)
      }
    }
  }

  // Promise必须传入一个函数，且立即执行
  constructor(executor) {
    // 抛出实例内部的resolve和reject
    executor(MyPromise.resolve, MyPromise.reject)
  }

  // Promise实例能调用的属性有：catch,then,finally

  // onFulfilled, onRejected就是后面要执行的回调逻辑
  then (onFulfilled, onRejected) {
    if (MyPromise.status === 'fulfilled') {
      onFulfilled(MyPromise.value)
    } else if (MyPromise.status === 'rejected') {
      onRejected(MyPromise.reason)
    } else { // status还是pending的情况

      // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递

      MyPromise.onFulfilledCallbackQueue.push(onFulfilled)
      MyPromise.onRejectedCallbackQueue.push(onRejected)
    }
  }

  catch (onRejected) {
    if (MyPromise.status === 'rejected') {
      onRejected(MyPromise.reason)
    }
  }
}

window.MyPromise = MyPromise
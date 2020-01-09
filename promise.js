(function () {
  /**
   * @description 检测一个值是否是一个数组
   * @param data {*}
   * @return {Boolean}
   * */
  function testArray(data) {
    return ({}).toString.call(data) === '[object Array]';
  }

  /**
   * @description 检测一个值是否属于PromiseES5实例
   * @param data {*}
   * @return {Boolean}
   * */
  function testInstanceofPromise(data) {
    return data instanceof PromiseES5;
  }

  function PromiseES5(callback) {
    // 当前实例状态
    this._status = 'pending';
    // then 回调队列
    this._fulfilledCallback = [];
    // catch 回调
    this._rejectedCallback = null;
    // finally 回调
    this._completedCallback = null;

    this._registerCallback = function () {
      if (this._status === 'pending') return;
      var _this = this;
      setTimeout(function () {
        if (_this._status === 'fulfilled') {
          fulfilled();
        } else if (_this._status === 'rejected') {
          rejected();
        }
      }, 0);
    };
    var _this = this,
      result,
      fulfilledIndex = 0,
      isCompleted,
      fulfilled = function (data) {
        result = data || result;
        if (_this._fulfilledCallback[fulfilledIndex] !== undefined) {
          try {

            result = _this._fulfilledCallback[fulfilledIndex++](result);
            _this._fulfilledCallback[fulfilledIndex] !== undefined
              ? fulfilled(result)
              : completed();
          } catch (err) {
            rejected(err);
          }
        } else {
          completed();
        }
      },
      rejected = function (err) {
        result = err || result;
        _this._rejectedCallback && _this._rejectedCallback(result);
        completed();
      },
      completed = function () {
        if (isCompleted) return;
        _this._completedCallback && (_this._completedCallback() || (isCompleted = true));
      };
    setTimeout(function () {
      try {
        callback(
          // resolve 只接受一个参数
          function (data) {
            _this._status = 'fulfilled';
            // initResult = data;
            fulfilled(data);
          },
          function (err) {
            _this._status = 'rejected';
            rejected(err);
          }
        );
      } catch (err) {
        rejected(err);
      }

    }, 0);


  }

  /**
   * @description promise 三个原型方法
   * then
   * catch
   * finally
   * */

  PromiseES5.prototype.then = function (fulfilledCallback, rejectedCallback) {
    typeof fulfilledCallback === 'function'
    && (this._fulfilledCallback.push(fulfilledCallback));

    typeof rejectedCallback === 'function'
    && (this._rejectedCallback = rejectedCallback);

    this._registerCallback();
    return this;
  };

  PromiseES5.prototype.catch = function (rejectedCallback) {
    typeof rejectedCallback === 'function'
    && (this._rejectedCallback = rejectedCallback);
    this._registerCallback();

    return this;
  };
  // es2018 新增
  PromiseES5.prototype.finally = function (completedCallback) {
    typeof completedCallback === 'function'
    && (this._completedCallback = completedCallback);
    this._registerCallback();

    return this;
  };


  /**
   * @description promise 四个静态方法
   * all
   * race
   * resolve
   * reject
   * */

  /**
   * @description 将多个promise包装成一个promise实例
   * @param promises {Array} promise集合
   * @return {PromiseES5}
   * */
  PromiseES5.all = function (promises) {
    // 参数必须是一个数组
    if (!testArray(promises)) {
      throw new TypeError('Promise.all The parameter must be an array');
    }

    // 检查每一项是否是promise实例
    promises.forEach(function (item) {
      if (!testInstanceofPromise(item)) {
        throw new TypeError('Promise.all Each item of the parameter must be a promise instance');
      }
    });
    return new PromiseES5(function (resolve, reject) {
      var length = promises.length,
        fulfilledCount = 0,
        fulfilledData = [],
        isRejected = false,
        i = 0;

      for (; i < length; i++) {
        (function (i) {
          promises[i]
            .then(function (res) {
              try {
                fulfilledCount++;
                fulfilledData[i] = res;
                if (fulfilledCount === length) {
                  resolve(fulfilledData);
                }
              } catch (err) {
                !isRejected && (reject(err) || (isRejected = true));
              }
            })
            .catch(function (err) {
              !isRejected && (reject(err) || (isRejected = true));

            });
        }(i));
      }

    });
  };
  /**
   * @description 将多个promise包装成一个promise实例
   * @param promises {Array} promise集合
   * @return {PromiseES5}
   * */
  PromiseES5.race = function (promises) {
    // 参数必须是一个数组
    if (!testArray(promises)) {
      throw new TypeError('Promise.all The parameter must be an array');
    }
    // 检查每一项是否是promise实例
    promises.forEach(function (item) {
      if (!testInstanceofPromise(item)) {
        throw new TypeError('Promise.all Each item of the parameter must be a promise instance');
      }
    });
    return new PromiseES5(function (resolve, reject) {
      var length = promises.length,
        isCompleted = false,
        i = 0;

      for (; i < length; i++) {
        (function (i) {
          promises[i]
            .then(function (res) {
              try {
                !isCompleted && (resolve(res) || (isCompleted = true));
              } catch (err) {
                !isCompleted && (reject(err) || (isCompleted = true));
              }
            })
            .catch(function (err) {
              !isCompleted && (reject(err) || (isCompleted = true));
            });
        }(i));
      }

    });


  };
  /**
   * @description 生成一个状态为fulfilled的promise实例
   * @param data {*} 回调信息
   * @return {PromiseES5}
   * */
  PromiseES5.resolve = function (data) {
    return new PromiseES5(function (resolve, reject) {
      try {
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };
  /**
   * @description 生成一个状态为rejected的promise实例
   * @param err {*} 错误信息
   * @return {PromiseES5}
   * */
  PromiseES5.reject = function (err) {
    return new PromiseES5(function (resolve, reject) {
      reject(err);
    });
  };

  window.PromiseES5 = PromiseES5;

  if (typeof Promise === 'undefined') {
    window.Promise = window.PromiseES5;
  }

}());

# Promise-polyfill

#### 项目介绍

- Promise-polyfill

#### 测试

```javascript

  // IE下
  function getData(status) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var num = Math.random();
        if (num > 0.5 || status) {
          resolve({
            status: 1,
            num: num
          });
        } else {
          reject({
            status: 2,
            num: num
          });
        }
      }, 500);
    });
  }

  // *** 001
  getData()
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.error(err);
    })
    .finally(function () {
      console.log('finally');
    });


  // *** 002
  var promiseAll = Promise.all([
    getData(true),
    getData(true),
    (function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(1);
        }, 2000);
      });
    }())
  ]);

  promiseAll
    .then(function (res) {
      console.log(res); // 2秒后 [{…}, {…}, 1]
    })
    .catch(function (err) {
      console.error(err);
    });


  // *** 003
  var promiseRace = Promise.race([
    getData(true),
    getData(true),
    (function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(2);
        }, 200);
      });
    }())
  ]);
  promiseRace
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.error(err); // 200毫秒后
    });


  // *** 004

  Promise.resolve([1, 2])
    .then(function (res) {
      console.log(res); // [1, 2]
    });


  // *** 005

  Promise.resolve([1, 2])
    .then(function (res) {
      console.log(abc); // abc is not defined
    })
    .catch(function (err) {
      console.log(err); // err msg
    });


  // *** 006

  Promise.reject('reject status msg')
    .catch(function (err) {
      console.log(err);   // 'reject status msg'
    });


  // *** 007
  // 仅不支持原生Promise下，例：IE

  console.log(Promise === PromiseES5); // true




```


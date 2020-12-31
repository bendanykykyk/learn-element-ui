/**
 * @desc 函数防抖
 * @param func 需要防抖的函数
 * @param wait 延迟执行毫秒数
 * @param immediate
 *        [true] - 默认值，短时间内多次触发同一事件，只执行最后一次，或者只执行最开始的一次，中间的不执行。
 *        [false] - 触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果
 */
export function debounce(func, wait, immediate = true) {
  let timer;
  return function() {
    let context = this,
      args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(() => {
        func.apply;
      }, wait);
    }
  };
}

// export const debounce = (func, delay = 200) => {
//   let timeout = null;
//   return function() {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       func.apply(this, arguments);
//     }, delay);
//   };
// };

/**
 * @desc 函数节流
 * @param func 需要节流的函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，时间段前 2 表定时器版，时间段后
 */
export function throttle(func, wait, type) {
  if (type === 1) {
    let previous = 0;
  } else if (type === 2) {
    let timeout;
  }
  return function() {
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
}

/**
 * @description: date日期对象格式化
 * @param {*} date
 * @param {*} fmt
 * @return {*}
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  let o = {
    "M+": date.getMonth() + 1,

    "d+": date.getDate(),

    "h+": date.getHours(),

    "m+": date.getMinutes(),

    "s+": date.getSeconds(),
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";

      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }

  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

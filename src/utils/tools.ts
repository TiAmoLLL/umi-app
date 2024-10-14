interface Tools {
  data: {
    set(table: string, settings: any): any;
    get(table: string): any;
    remove(table: string): any;
    clear(): any;
  };
  url(url: string, params: { [key: string]: any }): string;
  getToday(): string;
  debounce(
    func: (...args: any[]) => void,
    wait: number,
  ): (...args: any[]) => void;
  throttle(
    func: (...args: any[]) => void,
    wait: number,
  ): (...args: any[]) => void;
}
const tools: Tools = {
  /* localStorage */
  data: {
    set(table: string, settings: any) {
      let _set = JSON.stringify(settings);
      return localStorage.setItem(table, _set);
    },
    get(table: string) {
      let data: string | null = localStorage.getItem(table);
      try {
        data = data && JSON.parse(data);
      } catch (err) {
        return null;
      }
      return data;
    },
    remove(table: string) {
      return localStorage.removeItem(table);
    },
    clear() {
      return localStorage.clear();
    },
  },
  url: (url: string, params: { [key: string]: any }) => {
    const searchParams = new URLSearchParams(params).toString();
    return url.includes('?')
      ? `${url}&${searchParams}`
      : `${url}?${searchParams}`;
    // var hasParams = url.indexOf("?") > 0;
    // for (var key in params) {
    //     if (params.hasOwnProperty(key)) {
    //         url = url + (hasParams ? '&' : '?') + key + '=' + params[key];
    //         hasParams = true;
    //     }
    // }
    // return url;
  },
  getToday: () => {
    let date = new Date(),
      year = date.getFullYear(), //获取完整的年份(4位)
      month: number | string = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
      strDate: number | string = date.getDate(); // 获取当前日(1-31)
    if (month < 10) month = `0${month}`; // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `0${strDate}`; // 如果日是个位数，在前面补0
    return `${year}-${month}-${strDate}`;
  },
  debounce: function (func: (...args: any[]) => void, wait: number) {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args); // 直接调用 func，不需要额外绑定 this
      }, wait);
    };
  },
  throttle: function (func: (...args: any[]) => void, wait: number) {
    let inProgress: boolean = false;
    return (...args: any[]) => {
      if (!inProgress) {
        inProgress = true;
        setTimeout(() => {
          func(...args); // 直接调用 func，不需要额外绑定 this
          inProgress = false;
        }, wait);
      }
    };
  },

  // debounce: function (func: (...args: any[]) => void, wait: number) {
  //     console.log(func, wait);
  //     let timer: any;
  //     return function (this: any, ...args: any[]) {
  //         console.log('return的function');

  //         const context = this;
  //         clearTimeout(timer);
  //         console.log('this', this, args);
  //         timer = setTimeout(() => {
  //             console.log('this', context, args);
  //             func.apply(context, args);
  //         }, wait);
  //     };
  // },
  // throttle: function (func: (...args: any[]) => void, wait: number) {
  //     let inProgress: boolean = false;
  //     return function (this: any, ...args: any[]) {
  //         const context = this;
  //         if (!inProgress) {
  //             inProgress = true;
  //             setTimeout(() => {
  //                 func.apply(context, args);
  //                 inProgress = false;
  //             }, wait);
  //         }
  //     }
  // }
};

export default tools;

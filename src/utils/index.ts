import { isArray } from "@/utils/is";
import { FieldNamesProps } from "@/components/ProTable/interface";
import { JSEncrypt } from "jsencrypt";
import dayjs from "dayjs";

const mode = import.meta.env.VITE_ROUTER_MODE;

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @returns {String}
 */
export function localGet(key: string) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key) as string);
  } catch (error) {
    return value;
  }
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {*} value Storage值
 * @returns {void}
 */
export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @returns {void}
 */
export function localRemove(key: string) {
  window.localStorage.removeItem(key);
}

/**
 * @description 清除所有localStorage
 * @returns {void}
 */
export function localClear() {
  window.localStorage.clear();
}

/**
 * @description 判断数据类型
 * @param {*} val 需要判断类型的数据
 * @returns {String}
 */
export function isType(val: any) {
  if (val === null) return "null";
  if (typeof val !== "object") return typeof val;
  else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    let random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

/**
 * 判断两个对象是否相同
 * @param {Object} a 要比较的对象一
 * @param {Object} b 要比较的对象二
 * @returns {Boolean} 相同返回 true，反之 false
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
  if (!a || !b) return false;
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) return false;
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    let propA = a[propName];
    let propB = b[propName];
    if (!b.hasOwnProperty(propName)) return false;
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB)) return false;
    } else if (propA !== propB) {
      return false;
    }
  }
  return true;
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number}
 */
export function randomNum(min: number, max: number): number {
  let num = Math.floor(Math.random() * (min - max) + max);
  return num;
}

/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
export function getTimeState() {
  let timeNow = new Date();
  let hours = timeNow.getHours();
  if (hours >= 6 && hours <= 10) return `早上好 ⛅`;
  if (hours >= 10 && hours <= 14) return `中午好 🌞`;
  if (hours >= 14 && hours <= 18) return `下午好 🌞`;
  if (hours >= 18 && hours <= 24) return `晚上好 🌛`;
  if (hours >= 0 && hours <= 6) return `凌晨好 🌛`;
}

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  let defaultBrowserLang = "";
  if (["cn", "zh", "zh-cn"].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = "zh";
  } else {
    defaultBrowserLang = "en";
  }
  return defaultBrowserLang;
}

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */
export function getUrlWithParams() {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  };
  return url[mode];
}

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]);
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], parent = [], result: { [key: string]: any } = {}) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
};

/**
 * @description 使用递归处理路由菜单 path，生成一维数组 (第一版本地路由鉴权会用到，该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} menuPathArr 菜单地址的一维数组 ['**','**']
 * @returns {Array}
 */
export function getMenuListPath(menuList: Menu.MenuOptions[], menuPathArr: string[] = []): string[] {
  for (const item of menuList) {
    if (typeof item === "object" && item.path) menuPathArr.push(item.path);
    if (item.children?.length) getMenuListPath(item.children, menuPathArr);
  }
  return menuPathArr;
}

/**
 * @description 递归查询当前 path 所对应的菜单对象 (该函数暂未使用)
 * @param {Array} menuList 菜单列表
 * @param {String} path 当前访问地址
 * @returns {Object | null}
 */
export function findMenuByPath(menuList: Menu.MenuOptions[], path: string): Menu.MenuOptions | null {
  for (const item of menuList) {
    if (item.path === path) return item;
    if (item.children) {
      const res = findMenuByPath(item.children, path);
      if (res) return res;
    }
  }
  return null;
}

/**
 * @description 使用递归过滤需要缓存的菜单 name (该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} keepAliveNameArr 缓存的菜单 name ['**','**']
 * @returns {Array}
 * */
export function getKeepAliveRouterName(menuList: Menu.MenuOptions[], keepAliveNameArr: string[] = []) {
  menuList.forEach(item => {
    item.meta.isKeepAlive && item.name && keepAliveNameArr.push(item.name);
    item.children?.length && getKeepAliveRouterName(item.children, keepAliveNameArr);
  });
  return keepAliveNameArr;
}

/**
 * @description 格式化表格单元格默认值 (el-table-column)
 * @param {Number} row 行
 * @param {Number} col 列
 * @param {*} callValue 当前单元格值
 * @returns {String}
 * */
export function formatTableColumn(row: number, col: number, callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
}

/**
 * @description 处理 ProTable 值为数组 || 无数据
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes(".")) return row[prop] ?? "--";
  prop.split(".").forEach(item => (row = row[item] ?? "--"));
  return row;
}

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(prop: string) {
  const propArr = prop.split(".");
  if (propArr.length == 1) return prop;
  return propArr[propArr.length - 1];
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: "tag") {
  const value = fieldNames?.value ?? "value";
  const label = fieldNames?.label ?? "label";
  const children = fieldNames?.children ?? "children";
  let filterData: { [key: string]: any } = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
  // 判断是否输出的结果为 tag 类型
  if (type == "tag") {
    return filterData?.tagType ? filterData.tagType : "";
  } else {
    return filterData ? filterData[label] : "--";
  }
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData.reduce((accumulator: any, current: any) => {
    if (accumulator) return accumulator;
    if (current[value] === callValue) return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
}
/**
 * 列表数据转换树形数据
 * @param {Array} data 要转换的列表
 * @param {String} id 主键字段字段名
 * @param {String} pid 父字段字段名
 * @returns {Array} 转换后的树数据
 */
export function treeDataTranslate<D>(data: Array<D>, id = "id", pid = "parentId"): D[] {
  const res: D[] = [];
  const temp: any = {};
  const dataList: any[] = data.map(item => {
    return { ...item } as any;
  });
  for (let i = 0; i < dataList.length; i++) {
    const d = dataList[i];
    if (d) {
      temp[d[id]] = dataList[i];
    }
  }
  for (let k = 0; k < dataList.length; k++) {
    const d = dataList[k];
    if (d) {
      if (temp[d[pid]] && d[id] !== d[pid]) {
        if (!temp[d[pid]]["children"]) {
          temp[d[pid]]["children"] = [];
        }
        if (!temp[d[pid]]["_level"]) {
          temp[d[pid]]["_level"] = 1;
        }
        d["_level"] = temp[d[pid]]._level + 1;
        d["_parent"] = d[pid];
        temp[d[pid]]["children"].push(d);
      } else {
        res.push(d as D);
      }
    }
  }

  return res;
}
/**
 * 获取字符串字节长度（中文算2个字符）
 * @param {String} str 要获取长度的字符串
 */
export function getStringLength(str: string) {
  return str.replace(/[\u4e00-\u9fa5\uff00-\uffff]/g, "**").length;
}
/**
 * 获取uuid
 */
export function getUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const random: number = Math.random() * 16;
    return (c === "x" ? random : (random & 0x3) | 0x8).toString(16);
  });
}

export function stringCase(str: string, type: number) {
  if (str == null || str === "") return str;
  if (type === 0) {
    // 首字母小写
    return str.slice(0, 1).toLowerCase() + str.slice(1);
  } else {
    // 首字母大写
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }
}

/**
 * 大小驼峰变换函数
 * @param name 要转换的字符串
 * @param type 转换的类型0：转换成小驼峰，1：转换成大驼峰
 */
export function nameTranslate(name: string, type: 0 | 1) {
  name = name.toLowerCase();
  let nameArray = name.split("_");
  nameArray.forEach((item, index) => {
    if (index === 0) {
      name = type === 1 ? item.slice(0, 1).toUpperCase() + item.slice(1) : item;
    } else {
      name = name + item.slice(0, 1).toUpperCase() + item.slice(1);
    }
  });

  nameArray = name.split("-");
  nameArray.forEach((item, index) => {
    if (index === 0) {
      name = type === 1 ? item.slice(0, 1).toUpperCase() + item.slice(1) : item;
    } else {
      name = name + item.slice(0, 1).toUpperCase() + item.slice(1);
    }
  });
  return name;
}
/**
 * 通过id从树中获取指定的节点
 * @param {Object} node 根节点
 * @param {String|Nubmer} id 键值
 * @param {Array} list 保存查询路径
 * @param {String} idKey 主键字段名
 * @param {String} childKey 子节点字段名
 */
function findNode(
  node: any,
  id: string | number | undefined,
  list?: Array<any> | undefined,
  idKey = "id",
  childKey = "children"
): any | undefined {
  if (Array.isArray(list)) list.push(node);
  if (node[idKey] === id) {
    return node;
  }

  if (node[childKey] != null && Array.isArray(node[childKey])) {
    for (let i = 0; i < node[childKey].length; i++) {
      const tempNode: any | undefined = findNode(node[childKey][i], id, list, idKey, childKey);
      if (tempNode) return tempNode;
    }
  }

  if (Array.isArray(list)) list.pop();
}
/**
 * 通过id返回从根节点到指定节点的路径
 * @param {Array} treeRoot 树根节点数组
 * @param {*} id 要查询的节点的id
 * @param {*} idKey 主键字段名
 * @param {*} childKey 子节点字段名
 */
export function findTreeNodeObjectPath(treeRoot: any, id: string | number | undefined, idKey = "id", childKey = "children") {
  const tempList: any[] = [];
  for (let i = 0; i < treeRoot.length; i++) {
    if (findNode(treeRoot[i], id, tempList, idKey, childKey)) {
      return tempList;
    }
  }

  return [];
}

export function findTreeNodePath<D>(
  treeRoot: Array<D>,
  id: string | number | undefined,
  idKey = "id",
  childKey = "children"
): Array<string | number> {
  return (findTreeNodeObjectPath(treeRoot, id, idKey, childKey) || []).map(item => item[idKey]);
}

/**
 * 通过id从树中查找节点
 * @param {Array} treeRoot 根节点数组
 * @param {*} id 要查找的节点的id
 * @param {*} idKey 主键字段名
 * @param {*} childKey 子节点字段名
 */
export function findTreeNode(treeRoot: any, id: string, idKey = "id", childKey = "children") {
  for (let i = 0; i < treeRoot.length; i++) {
    const tempNode = findNode(treeRoot[i], id, undefined, idKey, childKey);
    if (tempNode) return tempNode;
  }
}

export function traverseTree(root: any, callback: (node: any) => void, childKey = "children") {
  function traverseNode(node: any) {
    if (typeof callback === "function") callback(node);
    if (Array.isArray(node[childKey])) {
      node[childKey].forEach((suNode: any) => {
        traverseNode(suNode);
      });
    }
  }
  if (Array.isArray(root)) {
    root.forEach(node => {
      traverseNode(node);
    });
  }
}

/**
 * 把Object转换成query字符串
 * @param {Object} params 要转换的Object
 */
export function objectToQueryString(params: any | null) {
  if (params == null) {
    return null;
  } else {
    return Object.keys(params)
      .map(key => {
        if (params[key] !== undefined) {
          return `${key}=${params[key]}`;
        } else {
          return undefined;
        }
      })
      .filter(item => item != null)
      .join("&");
  }
}
/**
 * 从数组中查找某一项
 * @param {Array} list 要查找的数组
 * @param {String} id 要查找的节点id
 * @param {String} idKey 主键字段名（如果为null则直接比较）
 * @param {Boolean} removeItem 是否从数组中移除查找到的节点
 * @returns {Object} 找到返回节点，没找到返回undefined
 */
export function findItemFromList(
  list: any[],
  id: string | number | undefined | null,
  idKey: string | null = null,
  removeItem = false
) {
  if (Array.isArray(list) && list.length > 0 && id != null) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (((idKey == null || idKey === "") && item.toString() === id) || (idKey != null && item[idKey] === id)) {
        if (removeItem) list.splice(i, 1);
        return item;
      }
    }
  }
  return null;
}
/**
 * 将数据保存到sessionStorage
 * @param {*} key sessionStorage的键值
 * @param {*} value 要保存的数据
 */
export function setObjectToSessionStorage(key: string, value: any) {
  if (key == null || key === "") return false;
  if (value == null) {
    window.sessionStorage.removeItem(key);
    return true;
  } else {
    const jsonObj = {
      data: value
    };
    window.sessionStorage.setItem(key, JSON.stringify(jsonObj));
    return true;
  }
}
/**
 * 从sessionStorage里面获取数据
 * @param {String} key 键值
 * @param {*} defaultValue 默认值
 */
export function getObjectFromSessionStorage(key: string, defaultValue: any): any {
  let jsonObj = {};
  try {
    const val: string | null = sessionStorage.getItem(key);
    if (val == null) return defaultValue;
    jsonObj = JSON.parse(val);
    jsonObj = (jsonObj || {})["data"];
  } catch (e) {
    jsonObj = defaultValue;
  }
  return jsonObj != null ? jsonObj : defaultValue;
}
/**
 * 判读字符串是否一个数字
 * @param {String} str 要判断的字符串
 */
export function isNumber(str: string) {
  const num = Number.parseFloat(str);
  if (Number.isNaN(num)) return false;
  return num.toString() === str;
}
/**
 * 生成随机数
 * @param {Integer} min 随机数最小值
 * @param {Integer} max 随机数最大值
 */
export function random(min: number, max: number) {
  const base = Math.random();
  return min + base * (max - min);
}
/**
 * 加密
 * @param {*} value 要加密的字符串
 */
const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpC4QMnbTrQOFriJJCCFFWhlruBJThAEBfRk7pRx1jsAhyNVL3CqJb0tRvpnbCnJhrRAEPdgFHXv5A0RrvFp+5Cw7QoFH6O9rKB8+0H7+aVQeKITMUHf/XMXioymw6Iq4QfWd8RhdtM1KM6eGTy8aU7SO2s69Mc1LXefg/x3yw6wIDAQAB";
export function encrypt(value: string): string {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encodeURIComponent(encrypt.encrypt(value));
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function setToken(token: string | null | undefined) {
  if (token == null || token === "") {
    sessionStorage.removeItem("token");
  } else {
    sessionStorage.setItem("token", token);
  }
}

export function getAppId() {
  const appId = sessionStorage.getItem("appId");
  return appId != null ? appId : undefined;
}

export function setAppId(appId: string | null | undefined) {
  if (appId == null || appId === "") {
    sessionStorage.removeItem("appId");
  } else {
    sessionStorage.setItem("appId", appId);
  }
}

export function traversalTree(treeNode: any, callback: (treeNode: any) => void, childrenKey = "children") {
  if (treeNode != null && Array.isArray(treeNode[childrenKey]) && treeNode[childrenKey].length > 0) {
    treeNode[childrenKey].forEach((childNode: any) => {
      traversalTree(childNode, callback, childrenKey);
    });
  }
  return typeof callback === "function" ? callback(treeNode) : undefined;
}

export class TreeTableImpl {
  private options;
  private dataList;
  private dataMap;
  private checkedRows: Map<string, any> | undefined;

  constructor(
    dataList: Array<any>,
    options: {
      idKey: string;
      nameKey: string;
      parentIdKey: string;
      isLefeCallback: (item: any) => boolean | undefined;
      checkStrictly: boolean;
    }
  ) {
    this.options = {
      idKey: options ? options.idKey : "id",
      nameKey: options ? options.nameKey : "name",
      parentIdKey: options ? options.parentIdKey : "parentId",
      isLefeCallback: options ? options.isLefeCallback : undefined,
      checkStrictly: options ? options.checkStrictly : false
    };

    this.dataList = Array.isArray(dataList) ? dataList : [];
    this.dataMap = new Map();
    this.dataList.forEach(item => {
      this.dataMap.set(item[this.options.idKey], item);
    });
    // 表格选中行
    this.checkedRows = undefined;
    this.onCheckedRowChange = this.onCheckedRowChange.bind(this);
  }

  /**
   * 过滤表格数据
   * @param {string} filterString 过滤条件字符串
   * @param {boolean} onlyChecked 是否只显示选中节点
   * @returns {array} 过滤后的表格数据列表
   */
  getFilterTableData(filterString: string | null, onlyChecked = false) {
    const { idKey, nameKey, parentIdKey, isLefeCallback } = this.options;
    const tempMap = new Map();
    const parentIdList: any[] = [];
    this.dataList.forEach(item => {
      if (
        (filterString == null || filterString === "" || item[nameKey].indexOf(filterString) !== -1) &&
        (!onlyChecked || (this.checkedRows != null && this.checkedRows.get(item[idKey])))
      ) {
        if (!isLefeCallback || !isLefeCallback(item)) {
          parentIdList.push(item[idKey]);
        }
        // 将命中节点以及它的父节点都设置为命中
        let tempItem = item;
        do {
          tempMap.set(tempItem[idKey], tempItem);
          tempItem = this.dataMap.get(tempItem[parentIdKey]);
        } while (tempItem != null);
      }
    });

    return this.dataList.map(item => {
      let disabled = true;

      if (parentIdList.indexOf(item[parentIdKey]) !== -1 || tempMap.get(item[idKey]) != null) {
        if (parentIdList.indexOf(item[parentIdKey]) !== -1 && (isLefeCallback == null || !isLefeCallback(item))) {
          parentIdList.push(item[idKey]);
        }
        disabled = false;
      }

      return {
        ...item,
        __disabled: disabled
      };
    });
  }

  /**
   * 获取表格树数据，计算选中状态
   * @param {array} dataList 表格列表数据
   */
  getTableTreeData(dataList: any[], checkedRows: Map<string, any>) {
    const { idKey, parentIdKey, checkStrictly } = this.options;
    let treeData: any[] = [];
    function calcPermCodeTreeAttribute(treeNode: any, checkedRows: Map<string, any>) {
      const checkedItem = checkedRows == null ? null : checkedRows.get(treeNode[idKey]);
      treeNode.__checked = checkedItem != null;
      // 是否所有子权限字都被选中
      let allChildChecked = true;
      // 是否任意子权限字被选中
      let hasChildChecked = false;
      // 如果存在子权限字
      if (Array.isArray(treeNode.children) && treeNode.children.length > 0) {
        treeNode.children.forEach((item: any) => {
          const isChecked = calcPermCodeTreeAttribute(item, checkedRows);
          hasChildChecked = hasChildChecked || isChecked;
          allChildChecked = allChildChecked && isChecked;
        });
      } else {
        allChildChecked = false;
      }
      treeNode.__indeterminate = !checkStrictly && hasChildChecked && !allChildChecked;
      treeNode.__checked = treeNode.__checked || (allChildChecked && !checkStrictly);
      return treeNode.__checked || treeNode.__indeterminate;
    }

    if (Array.isArray(dataList)) {
      treeData = treeDataTranslate(
        dataList.map(item => {
          return { ...item };
        }),
        idKey,
        parentIdKey
      );
      treeData.forEach(item => {
        calcPermCodeTreeAttribute(item, checkedRows);
      });
    }

    return treeData;
  }

  /**
   * 树表格行选中状态改变
   * @param {object} row 选中状态改变行数据
   */
  onCheckedRowChange(row: any) {
    if (this.checkedRows == null) {
      this.checkedRows = new Map();
    } else {
      const temp = new Map();
      this.checkedRows.forEach((item, key) => {
        temp.set(key, item);
      });
      this.checkedRows = temp;
    }
    const { idKey } = this.options;
    if (!row.__checked || row.__indeterminate) {
      // 节点之前未被选中或者之前为半选状态，修改当前节点以及子节点为选中状态
      this.checkedRows.set(row[idKey], row);
      if (Array.isArray(row.children) && !this.options.checkStrictly) {
        row.children.forEach((childNode: any) => {
          traversalTree(childNode, node => {
            this.checkedRows?.set(node[idKey], node);
          });
        });
      }
    } else {
      // 节点之前为选中状态，修改节点以及子节点为未选中状态
      this.checkedRows.delete(row[idKey]);
      if (Array.isArray(row.children) && !this.options.checkStrictly) {
        row.children.forEach((childNode: any) => {
          traversalTree(childNode, node => {
            this.checkedRows?.delete(node[idKey]);
          });
        });
      }
    }
  }

  /**
   * 获取所有选中的权限字节点
   * @param {array} treeData 树数据
   * @param {boolean} includeHalfChecked 是否包含半选节点，默认为false
   * @returns {array} 选中节点列表
   */
  getCheckedRows(treeData: any, includeHalfChecked = false) {
    const checkedRows: any[] = [];

    function traversalCallback(node: any) {
      if (node == null) return;
      if (node.__checked || (includeHalfChecked && node.__indeterminate)) {
        checkedRows.push(node);
      }
    }

    if (Array.isArray(treeData) && treeData.length > 0) {
      treeData.forEach(permCode => {
        traversalTree(permCode, traversalCallback, "children");
      });
    }

    return checkedRows;
  }

  /**
   * 设置选中节点
   * @param {array} checkedRows
   */
  setCheckedRows(checkedRows: any[]) {
    this.checkedRows = new Map();
    if (Array.isArray(checkedRows)) {
      checkedRows.forEach(item => {
        const node = this.dataMap.get(item[this.options.idKey]);
        if (node != null) {
          this.checkedRows?.set(node[this.options.idKey], node);
        }
      });
    }
  }
  /**
   * 根据id获取表格行
   * @param {*} id
   */
  getTableRow(id: string) {
    return this.dataMap.get(id);
  }
}

export function formatDate(date: string | number | Date | dayjs.Dayjs | null | undefined, formatString: string | undefined) {
  return dayjs(date).format(formatString);
}

export function parseDate(date: string | number | Date, formatString: string | undefined) {
  return dayjs(date, formatString);
}

export function fileToBase64(file: File) {
  return new Promise<string | undefined>((resolve, reject) => {
    if (file == null) return reject();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      console.log("file loaded", e);
      resolve(e.target?.result as string);
    };
    reader.onerror = e => {
      console.warn("file load", e);
      reject(e);
    };
  });
}

export function getObjectValue(data: any, fieldName: string) {
  if (data == null) return undefined;
  if (fieldName == null || fieldName === "") return data;
  const fieldPath = fieldName.split(".");
  let tempValue = data;
  if (Array.isArray(fieldPath)) {
    fieldPath.forEach(key => {
      if (tempValue != null) {
        tempValue = tempValue[key];
      }
    });
  }

  return tempValue;
}

// 判断输入值是否一个Object
export function isObject(obj: any) {
  return obj != null && typeof obj === "object" && obj.toString() === "[object Object]";
}

function copyObject(obj: any): any {
  if (obj == null) return obj;
  return JSON.parse(JSON.stringify(obj));
}

export function deepMerge(obj1: any, obj2: any) {
  const tempObj = copyObject(obj1);
  if (obj2 != null) {
    Object.keys(obj2).forEach(key => {
      const val2 = obj2[key];
      const val1 = tempObj[key];
      if (isObject(val2)) {
        // 如果两个值都是对象，则递归合并
        if (isObject(val1)) {
          tempObj[key] = deepMerge(val1, val2);
        } else {
          tempObj[key] = copyObject(val2);
        }
      } else if (Array.isArray(val2)) {
        //console.log('......deepMerge.......', val1, val2, obj1, obj2);
        // 如果两个值都是数组，则合并数组
        if (Array.isArray(val1)) {
          tempObj[key] = val2.map((arrVal2, index) => {
            const arrVal1 = val1[index];
            if (isObject(arrVal1)) {
              return deepMerge(arrVal1, arrVal2);
            } else {
              return arrVal2;
            }
          });
        } else {
          tempObj[key] = copyObject(val2);
        }
      } else {
        // 直接覆盖
        tempObj[key] = val2;
      }
    });
  }
  return tempObj;
}

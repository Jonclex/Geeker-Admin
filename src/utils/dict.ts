// ? 系统全局字典

import { DictionaryBase } from "@/utils/types";

/**
 * @description：用户性别
 */
export const genderType = [
  { label: "男", value: 1 },
  { label: "女", value: 2 }
];

/**
 * @description：用户状态
 */
export const userStatus = [
  { label: "启用", value: 1, tagType: "success" },
  { label: "禁用", value: 0, tagType: "danger" }
];

export const SysMenuBindType = new DictionaryBase("菜单绑定类型", [
  {
    id: 0,
    name: "路由菜单",
    symbol: "ROUTER"
  },
  {
    id: 1,
    name: "在线表单",
    symbol: "ONLINE_FORM"
  },
  {
    id: 2,
    name: "工单列表",
    symbol: "WORK_ORDER"
  },
  {
    id: 3,
    name: "报表页面",
    symbol: "REPORT"
  },
  {
    id: 4,
    name: "外部链接",
    symbol: "THRID_URL"
  }
]);

import { BaseController } from "@/api/modules/BaseController";
import { RequestOption, TableData } from "@/common/http/types";
import { ANY_OBJECT } from "@/types/generic";
import { Perm } from "@/types/upms/perm";
import { PermCode } from "@/types/upms/permcode";
import { User, UserInfo } from "@/types/upms/user";
import { API_CONTEXT } from "../config";

export default class SystemUserController extends BaseController {
  static getUserList(params: ANY_OBJECT, httpOptions?: RequestOption) {
    return this.post<TableData<User>>(API_CONTEXT + "/upms/sysUser/list", params, httpOptions);
  }

  static addUser(params: ANY_OBJECT, httpOptions?: RequestOption) {
    return this.post(API_CONTEXT + "/upms/sysUser/add", params, httpOptions);
  }

  static updateUser(params: ANY_OBJECT, httpOptions?: RequestOption) {
    return this.post(API_CONTEXT + "/upms/sysUser/update", params, httpOptions);
  }

  static deleteUser(params: User, httpOptions?: RequestOption) {
    return this.post(API_CONTEXT + "/upms/sysUser/delete", params, httpOptions);
  }

  static viewMenu(params: ANY_OBJECT, httpOptions?: RequestOption) {
    return this.post<UserInfo>(API_CONTEXT + "/upms/sysMenu/view", params, httpOptions);
  }

  static getUser(params: User, httpOptions?: RequestOption) {
    return this.get(API_CONTEXT + "/upms/sysUser/view", params, httpOptions);
  }

  static resetUserPassword(params: ANY_OBJECT, httpOptions?: RequestOption) {
    return this.post(API_CONTEXT + "/upms/sysUser/resetPassword", params, httpOptions);
  }

  static listSysPermWithDetail(params: ANY_OBJECT, httpOptions?: RequestOption) {
    return this.get<TableData<Perm>>(API_CONTEXT + "/upms/sysUser/listSysPermWithDetail", params, httpOptions);
  }

  static listSysPermCodeWithDetail(params: ANY_OBJECT, httpOptions?: RequestOption) {
    return this.get<TableData<PermCode>>(API_CONTEXT + "/upms/sysUser/listSysPermCodeWithDetail", params, httpOptions);
  }

  static listSysMenuWithDetail(params: ANY_OBJECT, httpOptions?: RequestOption) {
    return this.get<TableData<MenuItem>>(API_CONTEXT + "/upms/sysUser/listSysMenuWithDetail", params, httpOptions);
  }
}

import { SysMenuBindType } from "@/utils/dict";
import { UserInfo } from "@/types/upms/user";
function processMenu(item: Menu.MenuOptions): void {
  if (item == null) return;
  if (item.extraData != null && item.extraData !== "") {
    const extraData = JSON.parse(item.extraData);
    delete item.extraData;
    item.bindType = extraData.bindType || item.bindType;
    item.onlineFormId = extraData.onlineFormId || item.onlineFormId;
    item.onlineFlowEntryId = extraData.onlineFlowEntryId || item.onlineFlowEntryId;
    item.reportPageId = extraData.reportPageId || item.reportPageId;
    item.formRouterName = extraData.formRouterName || item.formRouterName;
    item.targetUrl = extraData.targetUrl;
  }
  item.path = item.formRouterName || "";
  item.name = item.formRouterName || item.menuName;
  item.meta = {
    title: item.menuName,
    icon: item.icon,
    isHide: false,
    isFull: false,
    isAffix: false,
    isKeepAlive: true
  };
  if (item.path) {
    item.component = item.path;
  }
  if (item.bindType == null) {
    if (item.onlineFlowEntryId != null) {
      item.bindType = SysMenuBindType.WORK_ORDER;
    } else if (item.reportPageId != null) {
      item.bindType = SysMenuBindType.REPORT;
    } else if (item.targetUrl != null) {
      item.bindType = SysMenuBindType.THRID_URL;
    } else {
      item.bindType = item.onlineFormId == null ? SysMenuBindType.ROUTER : SysMenuBindType.ONLINE_FORM;
    }
  }
  if (item.children && item.children.length > 0) {
    item.children.forEach(item => {
      processMenu(item);
    });
  }
}
/**
 * 从给定的数据中找到ID对应的菜单
 *
 * @param id 目标ID
 * @param menuList 源数据列表
 * @returns 目标对象（ID相同）
 */
function findMenuItemById(id: string, menuList: Array<Menu.MenuOptions>): Menu.MenuOptions | null {
  if (menuList != null && menuList.length > 0) {
    for (const menu of menuList) {
      if (menu.menuId == id) {
        return menu;
      } else if (menu.children != null) {
        const item = findMenuItemById(id, menu.children);
        if (item != null) {
          return item;
        }
      }
    }
  }
  return null;
}

/**
 * 寻找目标菜单，压入全路径
 *
 * @param menuItem 父级菜单
 * @param menuId 目标ID
 * @param path 父子菜单集合（全路径）
 * @returns 目标菜单
 */
function findMenuItem(menuItem: Menu.MenuOptions, menuId: string, path: Menu.MenuOptions[]): Menu.MenuOptions | null {
  path.push(menuItem);
  if (menuItem.menuId == menuId) {
    return menuItem;
  }

  let findItem: Menu.MenuOptions | null = null;
  if (Array.isArray(menuItem.children)) {
    for (let i = 0; i < menuItem.children.length; i++) {
      findItem = findMenuItem(menuItem.children[i], menuId, path);
      if (findItem != null) {
        break;
      }
    }
  }

  // 没有找到目标，弹出之前压入的菜单
  if (findItem == null) {
    path.pop();
  }
  return findItem;
}

function initUserInfo(userInfo: UserInfo) {
  if (userInfo != null && userInfo.headImageUrl != null && userInfo.headImageUrl !== "") {
    try {
      userInfo.headImageUrl = JSON.parse(userInfo.headImageUrl);
      if (Array.isArray(userInfo.headImageUrl)) {
        userInfo.headImageUrl = userInfo.headImageUrl[0];
      } else {
        userInfo.headImageUrl = null;
      }
    } catch (e) {
      console.error("解析头像数据失败！", e);
      userInfo.headImageUrl = null;
    }
  } else {
    if (userInfo) userInfo.headImageUrl = null;
  }

  return userInfo;
}

export { processMenu, findMenuItem, initUserInfo, findMenuItemById };

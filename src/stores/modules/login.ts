import { defineStore } from "pinia";
import { UserInfo } from "@/types/upms/user";
import { initUserInfo } from "./utils";

export const useLoginStore = defineStore({
  id: "login",
  state: () => {
    return {
      token: "" as string | null,
      userInfo: {} as UserInfo | null
    };
  },
  getters: {
    getPermCodeList(): Set<string> {
      if (this.userInfo == null) return new Set<string>();
      return new Set<string>(this.userInfo.permCodeList);
    }
  },
  actions: {
    setUserInfo(info: UserInfo) {
      this.userInfo = initUserInfo(info);
    }
  },
  persist: {
    key: "userInfo",
    paths: ["userInfo"]
  }
});

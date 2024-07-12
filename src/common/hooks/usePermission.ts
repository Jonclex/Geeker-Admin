import { getAppId } from "@/utils";
import { useLoginStore } from "@/stores/modules/login";

export const usePermissions = () => {
  const loginStorage = useLoginStore();

  const checkPermCodeExist = (permCode: string) => {
    //console.log(permCode);
    if (getAppId() != null && getAppId() !== "") return true;

    if (loginStorage.userInfo == null) {
      return false;
    }

    if (loginStorage.userInfo.permCodeList != null) {
      return loginStorage.userInfo.permCodeList.indexOf(permCode) != -1;
    } else {
      return loginStorage.userInfo.isAdmin;
    }
  };

  return {
    checkPermCodeExist
  };
};

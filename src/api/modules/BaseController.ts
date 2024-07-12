import { RequestOption } from "@/common/http/types";
import { ANY_OBJECT } from "@/types/generic";
import http from "@/api";

export class BaseController {
  static async get<D>(url: string, params: ANY_OBJECT, options?: RequestOption) {
    return await http.get<D>(url, params, options);
  }
  static async post<D>(url: string, params: ANY_OBJECT, options?: RequestOption) {
    return await http.post<D>(url, params, options);
  }
}

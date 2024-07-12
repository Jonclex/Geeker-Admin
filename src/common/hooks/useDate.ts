import { formatDate, parseDate } from "@/utils";

const allowStatsType = ["time", "datetime", "day", "month", "year"];

export const useDate = () => {
  /**
   * 格式化日期
   * @param {Date|String} date 要格式化的日期
   * @param {String} statsType 输出日期类型
   * @param {String} format 输入日期的格式
   */
  const formatDateByStatsType = (date: string | number | Date, statsType = "day", format = "YYYY-MM-DD") => {
    if (date == null) return undefined;
    if (statsType == null) return date;
    statsType = allowStatsType.indexOf(statsType) === -1 ? "day" : statsType;
    if (statsType === "datetime") format = "YYYY-MM-DD HH:mm:ss";

    //console.log('date', statsType, format, date);

    const tempDate = date instanceof Date ? date : parseDate(date, format);
    //console.log('tempDate', tempDate);
    if (!tempDate) return undefined;
    switch (statsType) {
      case "time":
        return formatDate(tempDate, "HH:mm:ss");
      case "datetime":
        return formatDate(tempDate, "YYYY-MM-DD HH:mm:ss");
      case "day":
        return formatDate(tempDate, "YYYY-MM-DD");
      case "month":
        return formatDate(tempDate, "YYYY-MM");
      case "year":
        return formatDate(tempDate, "YYYY");
      default:
        return formatDate(tempDate, "YYYY-MM-DD");
    }
  };

  /**
   * 根据输入的日期获得日期范围（例如：输入2019-12-12，输出['2019-12-12 00:00:00', '2019-12-12 23:59:59']）
   * @param {Date|String} date 要转换的日期
   * @param {String} statsType 转换类型（day, month, year）
   * @param {String} format 输出格式
   */
  const getDateRangeFilter = (date: string, statsType = "day", format = "YYYY-MM-dd HH:mm:ss") => {
    if (date == null) return [];

    statsType = allowStatsType.indexOf(statsType) === -1 ? "day" : statsType;
    date = date.substring(0, date.indexOf(" "));
    const tempList = date.split("-");
    const year = Number.parseInt(tempList[0]);
    const month = Number.parseInt(tempList[1]);
    const day = Number.parseInt(tempList[2]);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return [];
    }
    const tempDate = new Date(year, month - 1, day);
    // 判断是否正确的日期
    if (isNaN(tempDate.getTime())) return [];

    tempDate.setHours(0, 0, 0, 0);
    let retDate: Date[] = [];
    // TODO 如果类型为'time', 'datetime'会出错
    switch (statsType) {
      case "day":
        retDate = [new Date(tempDate), new Date(tempDate.setDate(tempDate.getDate() + 1))];
        break;
      case "month":
        tempDate.setDate(1);
        retDate = [new Date(tempDate), new Date(tempDate.setMonth(tempDate.getMonth() + 1))];
        break;
      case "year":
        tempDate.setDate(1);
        tempDate.setMonth(0);
        retDate = [new Date(tempDate), new Date(tempDate.setFullYear(tempDate.getFullYear() + 1))];
        break;
    }

    retDate[1] = new Date(retDate[1].getTime() - 1);

    return [formatDate(retDate[0], format), formatDate(retDate[1], format)];
  };

  return {
    formatDateByStatsType,
    getDateRangeFilter
  };
};

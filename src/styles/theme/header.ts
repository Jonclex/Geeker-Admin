import { Theme } from "@/hooks/interface";

export const headerTheme: Record<Theme.ThemeType, { [key: string]: string }> = {
  light: {
    "--el-header-logo-text-color": "#303133",
    "--el-header-bg-color": "#f5f5f5",
    "--el-header-text-color": "#303133",
    "--el-header-text-color-regular": "#606266",
    "--el-header-border-color": "#f5f5f5"
  },
  inverted: {
    "--el-header-logo-text-color": "#dadada",
    "--el-header-bg-color": "#191a20",
    "--el-header-text-color": "#e5eaf3",
    "--el-header-text-color-regular": "#cfd3dc",
    "--el-header-border-color": "#414243"
  },
  dark: {
    "--el-header-logo-text-color": "#dadada",
    "--el-header-bg-color": "#141414",
    "--el-header-text-color": "#e5eaf3",
    "--el-header-text-color-regular": "#cfd3dc",
    "--el-header-border-color": "#414243"
  }
};

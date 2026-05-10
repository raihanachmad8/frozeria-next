"use client";

import { App, ConfigProvider, theme } from "antd";

export function AntDesignProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0f766e",
          colorSuccess: "#15803d",
          colorWarning: "#b45309",
          colorError: "#b91c1c",
          borderRadius: 6,
          controlHeight: 40,
          fontSize: 15,
          fontSizeHeading1: 36,
          fontSizeHeading2: 30,
          fontSizeHeading3: 24,
          fontFamily:
            'Geist, "Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        components: {
          Card: {
            paddingLG: 18,
          },
          Table: {
            cellFontSize: 15,
            cellPaddingBlock: 12,
            cellPaddingInline: 14,
            headerBg: "#f2f6f3",
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}

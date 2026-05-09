"use client";

import {
  AppstoreOutlined,
  BarsOutlined,
  InboxOutlined,
  MenuOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Layout, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { APP_ACTIONS, APP_NAME, APP_VERSION, NAVIGATION_LABELS, ROUTES } from "@/commons/constants";

const navItems = [
  { href: ROUTES.dashboard, label: NAVIGATION_LABELS.dashboard, icon: <AppstoreOutlined /> },
  { href: ROUTES.categories, label: NAVIGATION_LABELS.categories, icon: <BarsOutlined /> },
  { href: ROUTES.help, label: NAVIGATION_LABELS.help, icon: <QuestionCircleOutlined /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function renderNav(className: string, onNavigate?: () => void) {
    return (
      <nav className={className} aria-label="Main navigation">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              className={active ? "nav-link active" : "nav-link"}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <Layout className="app-shell">
      <Layout.Header className="app-header">
        <Link href="/" className="brand" aria-label={`${APP_NAME} dashboard`}>
          <div className="brand-mark">
            <InboxOutlined />
          </div>
          <Typography.Text className="brand-title">{APP_NAME}</Typography.Text>
        </Link>

        {renderNav("main-nav desktop-nav")}

        <div className="header-actions">
          <Button className="mobile-menu-button" icon={<MenuOutlined />} onClick={() => setMobileNavOpen(true)} />
          <Button type="primary" icon={<PlusOutlined />} href={ROUTES.dashboardCreateItem}>
            {APP_ACTIONS.addItem}
          </Button>
        </div>
      </Layout.Header>

      <Drawer
        className="mobile-nav-drawer"
        open={mobileNavOpen}
        placement="left"
        size="default"
        title={APP_NAME}
        onClose={() => setMobileNavOpen(false)}
      >
        {renderNav("main-nav mobile-nav", () => setMobileNavOpen(false))}
      </Drawer>

      <Layout.Content className="app-content">{children}</Layout.Content>
      <Layout.Footer className="app-footer">
        <Typography.Text type="secondary">{APP_NAME} v{APP_VERSION}</Typography.Text>
      </Layout.Footer>
    </Layout>
  );
}

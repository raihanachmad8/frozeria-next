"use client";

import { BarsOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";

import { CATEGORY_PAGE_COPY } from "./constants";

export function CategoryPage() {
  return (
    <>
      <section className="page-heading">
        <div>
          <Typography.Title level={1}>{CATEGORY_PAGE_COPY.title}</Typography.Title>
          <Typography.Paragraph>{CATEGORY_PAGE_COPY.description}</Typography.Paragraph>
        </div>
      </section>

      <Card>
        <Space align="start" size={12}>
          <div className="placeholder-icon">
            <BarsOutlined />
          </div>
          <Space orientation="vertical" size={8}>
            <Typography.Text strong>{CATEGORY_PAGE_COPY.workspaceTitle}</Typography.Text>
            <Typography.Text type="secondary">{CATEGORY_PAGE_COPY.workspaceDescription}</Typography.Text>
            <Button icon={<PlusOutlined />}>{CATEGORY_PAGE_COPY.addCategory}</Button>
          </Space>
        </Space>
      </Card>
    </>
  );
}

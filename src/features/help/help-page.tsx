"use client";

import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Space, Typography } from "antd";

import { HELP_PAGE_COPY } from "./constants";

export function HelpPageContent() {
  return (
    <>
      <section className="page-heading">
        <div>
          <Typography.Title level={1}>{HELP_PAGE_COPY.title}</Typography.Title>
          <Typography.Paragraph>{HELP_PAGE_COPY.description}</Typography.Paragraph>
        </div>
      </section>

      <Card>
        <Space align="start" size={12}>
          <div className="placeholder-icon">
            <QuestionCircleOutlined />
          </div>
          <Space orientation="vertical" size={8}>
            <Typography.Text strong>{HELP_PAGE_COPY.workspaceTitle}</Typography.Text>
            <Typography.Text type="secondary">{HELP_PAGE_COPY.workspaceDescription}</Typography.Text>
          </Space>
        </Space>
      </Card>
    </>
  );
}

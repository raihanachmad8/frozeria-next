"use client";

import {
  AlertOutlined,
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Select, Space, Table, Tag, Typography } from "antd";

import { StatCard } from "@/components/shared/stat-card";

import {
  DASHBOARD_ACTIONS,
  DASHBOARD_CATEGORY_OPTIONS,
  DASHBOARD_COPY,
  type DashboardStatPreview,
  DASHBOARD_ITEM_PREVIEWS,
  DASHBOARD_TABLE_COPY,
} from "./constants";

export function DashboardPage() {
  const dashboardStats: DashboardStatPreview[] = [
    { icon: <InboxOutlined />, label: DASHBOARD_COPY.totalItems, value: "48" },
    { icon: <FolderOpenOutlined />, label: DASHBOARD_COPY.totalCategories, tone: "blue", value: "5" },
    { icon: <AlertOutlined />, label: DASHBOARD_COPY.lowStock, tone: "amber", value: "9" },
    { icon: <StopOutlined />, label: DASHBOARD_COPY.outOfStock, tone: "red", value: "4" },
  ];

  return (
    <>
      <section className="page-heading">
        <div>
          <Typography.Title level={1}>{DASHBOARD_COPY.title}</Typography.Title>
          <Typography.Paragraph>{DASHBOARD_COPY.description}</Typography.Paragraph>
        </div>
      </section>

      <Row gutter={[16, 16]}>
        {dashboardStats.map((stat) => (
          <Col xs={24} md={12} xl={6} key={stat.label}>
            <StatCard icon={stat.icon} label={stat.label} tone={stat.tone} value={stat.value} />
          </Col>
        ))}
      </Row>

      <Card
        className="inventory-card"
        title={
          <Space>
            <AppstoreOutlined />
            {DASHBOARD_COPY.inventoryTitle}
          </Space>
        }
      >
        <div className="table-toolbar">
          <Input placeholder={DASHBOARD_COPY.searchPlaceholder} allowClear prefix={<SearchOutlined />} />
          <Select defaultValue="all" options={[...DASHBOARD_CATEGORY_OPTIONS]} />
        </div>
        <Table
          dataSource={DASHBOARD_ITEM_PREVIEWS}
          scroll={{ x: 720 }}
          pagination={{
            pageSize: 10,
            total: 48,
            showSizeChanger: true,
            pageSizeOptions: [10, 25, 50, 100],
            showTotal: (total, range) =>
              `${DASHBOARD_COPY.showingItems} ${range[0]}-${range[1]} dari ${total} ${DASHBOARD_COPY.itemSuffix}`,
          }}
          columns={[
            { title: DASHBOARD_TABLE_COPY.itemName, dataIndex: "name" },
            {
              title: DASHBOARD_TABLE_COPY.category,
              dataIndex: "category",
              render: (category: string) => <Tag>{category}</Tag>,
            },
            { title: DASHBOARD_TABLE_COPY.stock, dataIndex: "stock" },
            { title: DASHBOARD_TABLE_COPY.unit, dataIndex: "unit" },
            { title: DASHBOARD_TABLE_COPY.sellingPrice, dataIndex: "sellingPrice" },
            {
              title: DASHBOARD_TABLE_COPY.actions,
              key: "actions",
              render: () => (
                <Space size={6}>
                  <Button size="small" icon={<EyeOutlined />}>
                    {DASHBOARD_ACTIONS.detail}
                  </Button>
                  <Button size="small" icon={<EditOutlined />}>
                    {DASHBOARD_ACTIONS.edit}
                  </Button>
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    {DASHBOARD_ACTIONS.delete}
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}

"use client";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import type { Category, CategoryListPagination } from "@/modules/categories";

import { CATEGORY_PAGE_COPY, CATEGORY_TABLE_COPY } from "./constants";

interface CategoryTableProps {
  categories: Category[];
  pagination: CategoryListPagination;
  loading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function CategoryTable({ categories, pagination, loading, onPageChange, onEdit, onDelete }: CategoryTableProps) {
  const columns: ColumnsType<Category> = [
    {
      title: CATEGORY_TABLE_COPY.name,
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => <Typography.Text strong>{name}</Typography.Text>,
    },
    {
      title: CATEGORY_TABLE_COPY.description,
      dataIndex: "description",
      render: (description: string | null) => (
        <Typography.Text type={description ? undefined : "secondary"}>
          {description || CATEGORY_TABLE_COPY.noDescription}
        </Typography.Text>
      ),
    },
    {
      title: CATEGORY_TABLE_COPY.updatedAt,
      dataIndex: "updatedAt",
      width: 190,
      render: (updatedAt: string) => <Typography.Text type="secondary">{formatDate(updatedAt)}</Typography.Text>,
    },
    {
      title: CATEGORY_TABLE_COPY.actions,
      key: "actions",
      width: 170,
      render: (_, category) => (
        <Space size={6}>
          <Button
            size="small"
            icon={<EditOutlined />}
            aria-label={`${CATEGORY_TABLE_COPY.edit} kategori ${category.name}`}
            onClick={() => onEdit(category)}
          >
            {CATEGORY_TABLE_COPY.edit}
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            aria-label={`${CATEGORY_TABLE_COPY.delete} kategori ${category.name}`}
            onClick={() => onDelete(category)}
          >
            {CATEGORY_TABLE_COPY.delete}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={categories}
      columns={columns}
      scroll={{ x: 760 }}
      locale={{ emptyText: CATEGORY_PAGE_COPY.emptyDescription }}
      pagination={{
        current: pagination.currentPage,
        pageSize: pagination.pageSize,
        total: pagination.totalItems,
        showSizeChanger: true,
        pageSizeOptions: [10, 25, 50, 100],
        showTotal: (total, range) =>
          `${CATEGORY_PAGE_COPY.showingItems} ${range[0]}-${range[1]} dari ${total} ${CATEGORY_PAGE_COPY.itemSuffix}`,
      }}
      onChange={(nextPagination: TablePaginationConfig) =>
        onPageChange(nextPagination.current ?? 1, nextPagination.pageSize ?? pagination.pageSize)
      }
    />
  );
}

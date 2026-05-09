"use client";

import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { ROUTES } from "@/commons/constants";
import type { Item, ItemListPagination } from "@/modules/items";
import { formatRupiah } from "@/utils";

import { ITEM_PAGE_COPY, ITEM_TABLE_COPY, LOW_STOCK_THRESHOLD } from "./constants";

interface ItemTableProps {
  items: Item[];
  pagination: ItemListPagination;
  loading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

function getStockTag(item: Item) {
  if (item.stock <= 0) {
    return (
      <Tag className="stock-status-tag" color="red">
        {ITEM_PAGE_COPY.outOfStock}
      </Tag>
    );
  }

  if (item.stock < LOW_STOCK_THRESHOLD) {
    return (
      <Tag className="stock-status-tag" color="orange">
        {ITEM_PAGE_COPY.lowStock}
      </Tag>
    );
  }

  return (
    <Tag className="stock-status-tag" color="green">
      {ITEM_PAGE_COPY.available}
    </Tag>
  );
}

export function ItemTable({ items, pagination, loading, onPageChange, onEdit, onDelete }: ItemTableProps) {
  const columns: ColumnsType<Item> = [
    {
      title: ITEM_TABLE_COPY.itemName,
      dataIndex: "name",
      render: (name: string) => <Typography.Text strong>{name}</Typography.Text>,
    },
    {
      title: ITEM_TABLE_COPY.category,
      dataIndex: "category",
      width: 160,
      render: (_, item) =>
        item.category ? <Typography.Text>{item.category.name}</Typography.Text> : <Typography.Text type="secondary">{ITEM_PAGE_COPY.noCategory}</Typography.Text>,
    },
    {
      title: ITEM_TABLE_COPY.stock,
      dataIndex: "stock",
      width: 150,
      render: (_, item) => (
        <div className="item-stock-cell">
          <Typography.Text className="stock-value">{item.stock}</Typography.Text>
          {getStockTag(item)}
        </div>
      ),
    },
    {
      title: ITEM_TABLE_COPY.unit,
      dataIndex: "unit",
      width: 100,
    },
    {
      title: ITEM_TABLE_COPY.packageSize,
      dataIndex: "packageSize",
      width: 130,
      render: (packageSize: string | null) => packageSize || ITEM_PAGE_COPY.noValue,
    },
    {
      title: ITEM_TABLE_COPY.sellingPrice,
      dataIndex: "sellingPrice",
      width: 150,
      render: (sellingPrice: number) => formatRupiah(sellingPrice),
    },
    {
      title: ITEM_TABLE_COPY.actions,
      key: "actions",
      width: 230,
      render: (_, item) => (
        <Space className="item-action-group" size={6}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            aria-label={`${ITEM_TABLE_COPY.detail} barang ${item.name}`}
            href={ROUTES.itemDetail(item.id)}
          >
            {ITEM_TABLE_COPY.detail}
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            aria-label={`${ITEM_TABLE_COPY.edit} barang ${item.name}`}
            onClick={() => onEdit(item)}
          >
            {ITEM_TABLE_COPY.edit}
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            aria-label={`${ITEM_TABLE_COPY.delete} barang ${item.name}`}
            onClick={() => onDelete(item)}
          >
            {ITEM_TABLE_COPY.delete}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      className="inventory-table"
      size="middle"
      loading={loading}
      dataSource={items}
      columns={columns}
      scroll={{ x: 980 }}
      rowClassName={(item) => {
        if (item.stock <= 0) return "item-row-out-of-stock";
        if (item.stock < LOW_STOCK_THRESHOLD) return "item-row-low-stock";
        return "";
      }}
      locale={{ emptyText: ITEM_PAGE_COPY.emptyDescription }}
      pagination={{
        current: pagination.currentPage,
        pageSize: pagination.pageSize,
        total: pagination.totalItems,
        showSizeChanger: true,
        pageSizeOptions: [10, 25, 50, 100],
        showTotal: (total, range) =>
          `Menampilkan ${range[0]}-${range[1]} dari ${total} barang`,
      }}
      onChange={(nextPagination: TablePaginationConfig) =>
        onPageChange(nextPagination.current ?? 1, nextPagination.pageSize ?? pagination.pageSize)
      }
    />
  );
}

"use client";

import { ArrowLeftOutlined, PictureOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Image, Skeleton, Space, Tag, Typography } from "antd";

import { ROUTES } from "@/commons/constants";
import { ApiClientError } from "@/lib/api";
import type { Item } from "@/modules/items";
import { useItemQuery } from "@/modules/items";
import { formatRupiah } from "@/utils";

import { ITEM_DETAIL_COPY, ITEM_PAGE_COPY } from "./constants";

interface ItemDetailPageProps {
  id: string;
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
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

function getStockStatus(item: Item) {
  if (item.stock <= 0) {
    return <Tag color="red">{ITEM_PAGE_COPY.outOfStock}</Tag>;
  }

  if (item.stock < 20) {
    return <Tag color="orange">{ITEM_PAGE_COPY.lowStock}</Tag>;
  }

  return <Tag color="green">{ITEM_PAGE_COPY.available}</Tag>;
}

function DetailMetric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="item-detail-metric">
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Typography.Text strong>{value}</Typography.Text>
    </div>
  );
}

export function ItemDetailPage({ id }: ItemDetailPageProps) {
  const itemQuery = useItemQuery({ id });
  const item = itemQuery.data;

  return (
    <>
      <section className="page-heading">
        <div>
          <Typography.Title level={1}>{ITEM_PAGE_COPY.detailTitle}</Typography.Title>
          <Typography.Paragraph>{ITEM_PAGE_COPY.detailDescription}</Typography.Paragraph>
        </div>
        <Button href={ROUTES.dashboard} icon={<ArrowLeftOutlined />}>
          {ITEM_PAGE_COPY.backToDashboard}
        </Button>
      </section>

      {itemQuery.isLoading ? (
        <Card className="inventory-card">
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      ) : itemQuery.isError ? (
        <Alert
          showIcon
          type="error"
          title={ITEM_PAGE_COPY.errorTitle}
          description={resolveErrorMessage(itemQuery.error)}
        />
      ) : item ? (
        <Card className="inventory-card item-detail-card">
          <div className="item-detail-summary">
            {item.photoUrl ? (
              <Image className="item-detail-image" src={item.photoUrl} alt={item.name} width={104} height={104} />
            ) : (
              <div className="item-photo-placeholder" aria-label="Foto barang belum tersedia">
                <PictureOutlined />
              </div>
            )}
            <div className="item-detail-title">
              <Typography.Title level={2}>{item.name}</Typography.Title>
              <Space size={6} wrap>
                <Tag>{item.category?.name ?? ITEM_PAGE_COPY.noCategory}</Tag>
                {getStockStatus(item)}
              </Space>
            </div>
          </div>

          <div className="item-detail-grid">
            <DetailMetric label={ITEM_DETAIL_COPY.stock} value={`${item.stock} ${item.unit}`} />
            <DetailMetric label={ITEM_DETAIL_COPY.minimumStock} value={`${item.minimumStock} ${item.unit}`} />
            <DetailMetric label={ITEM_DETAIL_COPY.sellingPrice} value={formatRupiah(item.sellingPrice)} />
            <DetailMetric label={ITEM_DETAIL_COPY.purchasePrice} value={formatRupiah(item.purchasePrice)} />
            <DetailMetric label={ITEM_DETAIL_COPY.packageSize} value={item.packageSize ?? ITEM_PAGE_COPY.noValue} />
            <DetailMetric label={ITEM_DETAIL_COPY.storageLocation} value={item.storageLocation ?? ITEM_PAGE_COPY.noValue} />
            <DetailMetric label={ITEM_DETAIL_COPY.createdAt} value={formatDate(item.createdAt)} />
            <DetailMetric label={ITEM_DETAIL_COPY.updatedAt} value={formatDate(item.updatedAt)} />
          </div>

          <div className="item-detail-description">
            <Typography.Text type="secondary">{ITEM_DETAIL_COPY.description}</Typography.Text>
            <Typography.Paragraph>
              {item.description ?? ITEM_PAGE_COPY.noValue}
            </Typography.Paragraph>
          </div>
        </Card>
      ) : null}
    </>
  );
}

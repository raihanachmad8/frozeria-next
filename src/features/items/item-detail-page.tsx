"use client";

import { ArrowLeftOutlined, InboxOutlined, PictureOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Descriptions, Image, Skeleton, Space, Tag, Typography } from "antd";

import { ROUTES } from "@/commons/constants";
import { ApiClientError } from "@/lib/api";
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
          message={ITEM_PAGE_COPY.errorTitle}
          description={resolveErrorMessage(itemQuery.error)}
        />
      ) : item ? (
        <Card
          className="inventory-card"
          title={
            <Space>
              <InboxOutlined />
              {item.name}
            </Space>
          }
        >
          <div className="item-detail-media">
            {item.photoUrl ? (
              <Image className="item-detail-image" src={item.photoUrl} alt={item.name} width={220} height={160} />
            ) : (
              <div className="item-photo-placeholder" aria-label="Foto barang belum tersedia">
                <PictureOutlined />
                <Typography.Text type="secondary">Foto belum tersedia</Typography.Text>
              </div>
            )}
          </div>

          <Descriptions bordered column={{ xs: 1, md: 2 }}>
            <Descriptions.Item label={ITEM_DETAIL_COPY.name}>{item.name}</Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.category}>
              {item.category?.name ?? ITEM_PAGE_COPY.noCategory}
            </Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.stock}>
              <Space>
                {item.stock}
                {item.stock <= 0 ? <Tag color="red">{ITEM_PAGE_COPY.outOfStock}</Tag> : null}
                {item.stock > 0 && item.stock <= item.minimumStock ? <Tag color="orange">{ITEM_PAGE_COPY.lowStock}</Tag> : null}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.minimumStock}>{item.minimumStock}</Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.unit}>{item.unit}</Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.packageSize}>
              {item.packageSize ?? ITEM_PAGE_COPY.noValue}
            </Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.purchasePrice}>
              {formatRupiah(item.purchasePrice)}
            </Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.sellingPrice}>
              {formatRupiah(item.sellingPrice)}
            </Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.storageLocation}>
              {item.storageLocation ?? ITEM_PAGE_COPY.noValue}
            </Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.photoUrl}>
              {item.photoUrl ?? ITEM_PAGE_COPY.noValue}
            </Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.description}>
              {item.description ?? ITEM_PAGE_COPY.noValue}
            </Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.createdAt}>{formatDate(item.createdAt)}</Descriptions.Item>
            <Descriptions.Item label={ITEM_DETAIL_COPY.updatedAt}>{formatDate(item.updatedAt)}</Descriptions.Item>
          </Descriptions>
        </Card>
      ) : null}
    </>
  );
}

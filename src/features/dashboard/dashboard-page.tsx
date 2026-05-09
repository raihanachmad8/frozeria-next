"use client";

import {
  AlertOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Alert, App as AntApp, Button, Card, Col, Input, Modal, Row, Select, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { StatCard } from "@/components/shared/stat-card";
import { ApiClientError } from "@/lib/api";
import type { Item } from "@/modules/items";
import { useCategoriesQuery } from "@/modules/categories";
import { useDashboardSummaryQuery } from "@/modules/dashboard";
import { useCreateItemMutation, useDeleteItemMutation, useItemsQuery, useUpdateItemMutation } from "@/modules/items";

import {
  DASHBOARD_COPY,
  type DashboardStatPreview,
} from "./constants";
import { ItemForm, type ItemFormValues } from "@/features/items/item-form";
import { ItemTable } from "@/features/items/item-table";
import { ITEM_PAGE_COPY } from "@/features/items/constants";

const ITEM_FORM_ID = "item-form";
const ITEM_SEARCH_DEBOUNCE_MS = 350;
const DEFAULT_ITEM_PAGE = 1;
const DEFAULT_ITEM_PAGE_SIZE = 10;

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
}

function getPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function DashboardPage() {
  const { message, modal } = AntApp.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const currentPage = getPositiveNumber(searchParams.get("page"), DEFAULT_ITEM_PAGE);
  const currentPageSize = getPositiveNumber(searchParams.get("pageSize"), DEFAULT_ITEM_PAGE_SIZE);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemPhotoUploading, setItemPhotoUploading] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsQuery = useItemsQuery({
    q: query || undefined,
    categoryId: categoryId || undefined,
    page: currentPage,
    pageSize: currentPageSize,
  });
  const categoriesQuery = useCategoriesQuery({ pageSize: 100 });
  const summaryQuery = useDashboardSummaryQuery();
  const createItemMutation = useCreateItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();
  const isSubmitting = createItemMutation.isPending || updateItemMutation.isPending || itemPhotoUploading;
  const items = itemsQuery.data?.items ?? [];
  const pagination = itemsQuery.data?.pagination ?? {
    currentPage: DEFAULT_ITEM_PAGE,
    pageSize: DEFAULT_ITEM_PAGE_SIZE,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };
  const categories = categoriesQuery.data?.categories ?? [];
  const summary = summaryQuery.data;
  const dashboardStats: DashboardStatPreview[] = [
    { icon: <InboxOutlined />, label: DASHBOARD_COPY.totalItems, value: String(summary?.totalItems ?? pagination.totalItems) },
    {
      icon: <FolderOpenOutlined />,
      label: DASHBOARD_COPY.totalCategories,
      tone: "blue",
      value: String(summary?.totalCategories ?? categoriesQuery.data?.pagination.totalItems ?? categories.length),
    },
    { icon: <AlertOutlined />, label: DASHBOARD_COPY.lowStock, tone: "amber", value: String(summary?.lowStockItems ?? 0) },
    { icon: <StopOutlined />, label: DASHBOARD_COPY.outOfStock, tone: "red", value: String(summary?.outOfStockItems ?? 0) },
  ];
  const modalTitle = formMode === "edit" ? ITEM_PAGE_COPY.editModalTitle : ITEM_PAGE_COPY.createModalTitle;

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  function setQueryParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);

    const nextPath = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextPath);
  }

  function updateSearch(nextSearch: string) {
    setQueryParams((params) => {
      const trimmed = nextSearch.trim();

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      params.set("page", String(DEFAULT_ITEM_PAGE));
    });
  }

  function scheduleSearch(nextSearch: string) {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      updateSearch(nextSearch);
    }, ITEM_SEARCH_DEBOUNCE_MS);
  }

  function updateCategoryFilter(nextCategoryId: string) {
    setQueryParams((params) => {
      if (nextCategoryId === "all") {
        params.delete("categoryId");
      } else {
        params.set("categoryId", nextCategoryId);
      }

      params.set("page", String(DEFAULT_ITEM_PAGE));
    });
  }

  function updatePage(page: number, pageSize: number) {
    setQueryParams((params) => {
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
    });
  }

  function openCreateModal() {
    setSelectedItem(null);
    setFormMode("create");
  }

  function openEditModal(item: Item) {
    setSelectedItem(item);
    setFormMode("edit");
  }

  function closeFormModal() {
    if (isSubmitting) return;

    setFormMode(null);
    setSelectedItem(null);
  }

  async function handleFormSubmit(values: ItemFormValues) {
    try {
      if (formMode === "edit" && selectedItem) {
        await updateItemMutation.mutateAsync({ id: selectedItem.id, payload: values });
        message.success(ITEM_PAGE_COPY.updateSuccess);
      } else {
        await createItemMutation.mutateAsync(values);
        message.success(ITEM_PAGE_COPY.createSuccess);
      }

      closeFormModal();
    } catch (error) {
      message.error(resolveErrorMessage(error));
    }
  }

  function confirmDelete(item: Item) {
    modal.confirm({
      title: ITEM_PAGE_COPY.deleteTitle,
      content: `${ITEM_PAGE_COPY.deleteDescription} (${item.name})`,
      okText: ITEM_PAGE_COPY.deleteOkText,
      cancelText: ITEM_PAGE_COPY.cancelText,
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await deleteItemMutation.mutateAsync(item.id);
          message.success(ITEM_PAGE_COPY.deleteSuccess);
        } catch (error) {
          message.error(resolveErrorMessage(error));
        }
      },
    });
  }

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
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            {ITEM_PAGE_COPY.addItem}
          </Button>
        }
      >
        <div className="table-toolbar">
          <Input
            key={query}
            aria-label={ITEM_PAGE_COPY.searchLabel}
            defaultValue={query}
            allowClear
            prefix={<SearchOutlined />}
            placeholder={DASHBOARD_COPY.searchPlaceholder}
            onChange={(event) => scheduleSearch(event.target.value)}
            onPressEnter={(event) => updateSearch(event.currentTarget.value)}
            onClear={() => updateSearch("")}
          />
          <Select
            aria-label={ITEM_PAGE_COPY.categoryFilterLabel}
            value={categoryId || "all"}
            loading={categoriesQuery.isLoading}
            options={[
              { label: ITEM_PAGE_COPY.allCategories, value: "all" },
              ...categories.map((category) => ({ label: category.name, value: category.id })),
            ]}
            onChange={updateCategoryFilter}
          />
        </div>

        {itemsQuery.isError ? (
          <Alert showIcon type="error" title={ITEM_PAGE_COPY.errorTitle} description={resolveErrorMessage(itemsQuery.error)} />
        ) : (
          <ItemTable
            items={items}
            pagination={pagination}
            loading={itemsQuery.isLoading}
            onPageChange={updatePage}
            onEdit={openEditModal}
            onDelete={confirmDelete}
          />
        )}
      </Card>

      <Modal
        open={formMode !== null}
        title={modalTitle}
        okText={ITEM_PAGE_COPY.saveText}
        cancelText={ITEM_PAGE_COPY.cancelText}
        okButtonProps={{ htmlType: "submit", form: ITEM_FORM_ID, loading: isSubmitting }}
        onCancel={closeFormModal}
        destroyOnHidden
      >
        <ItemForm
          key={selectedItem?.id ?? formMode ?? "create"}
          formId={ITEM_FORM_ID}
          item={selectedItem}
          categories={categories}
          categoriesLoading={categoriesQuery.isLoading}
          onUploadingChange={setItemPhotoUploading}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </>
  );
}

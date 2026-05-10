"use client";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, App as AntApp, Button, Card, Input, Modal, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ApiClientError } from "@/lib/api";
import type { Category } from "@/modules/categories";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/modules/categories";

import { CategoryForm, type CategoryFormValues } from "./category-form";
import { CategoryTable } from "./category-table";
import { CATEGORY_PAGE_COPY } from "./constants";

const CATEGORY_FORM_ID = "category-form";
const CATEGORY_SEARCH_DEBOUNCE_MS = 350;
const DEFAULT_CATEGORY_PAGE = 1;
const DEFAULT_CATEGORY_PAGE_SIZE = 10;

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
}

export function CategoryPage() {
  const { message, modal } = AntApp.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const currentPage = Number(searchParams.get("page") ?? DEFAULT_CATEGORY_PAGE);
  const currentPageSize = Number(searchParams.get("pageSize") ?? DEFAULT_CATEGORY_PAGE_SIZE);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categoriesQuery = useCategoriesQuery({
    q: query || undefined,
    page: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : DEFAULT_CATEGORY_PAGE,
    pageSize: Number.isFinite(currentPageSize) && currentPageSize > 0 ? currentPageSize : DEFAULT_CATEGORY_PAGE_SIZE,
  });
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending;
  const modalTitle = formMode === "edit" ? CATEGORY_PAGE_COPY.editModalTitle : CATEGORY_PAGE_COPY.createModalTitle;
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = categoriesQuery.data?.categories ?? [];
  const pagination = categoriesQuery.data?.pagination ?? {
    currentPage: DEFAULT_CATEGORY_PAGE,
    pageSize: DEFAULT_CATEGORY_PAGE_SIZE,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  function updateSearch(nextSearch: string) {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = nextSearch.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    params.set("page", String(DEFAULT_CATEGORY_PAGE));

    const nextPath = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextPath);
  }

  function updatePage(page: number, pageSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    router.replace(`${pathname}?${params.toString()}`);
  }

  function scheduleSearch(nextSearch: string) {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      updateSearch(nextSearch);
    }, CATEGORY_SEARCH_DEBOUNCE_MS);
  }

  function openCreateModal() {
    setSelectedCategory(null);
    setFormMode("create");
  }

  function openEditModal(category: Category) {
    setSelectedCategory(category);
    setFormMode("edit");
  }

  function closeFormModal() {
    if (isSubmitting) return;
    setFormMode(null);
    setSelectedCategory(null);
  }

  async function handleFormSubmit(values: CategoryFormValues) {
    try {
      if (formMode === "edit" && selectedCategory) {
        await updateCategoryMutation.mutateAsync({ id: selectedCategory.id, payload: values });
        message.success(CATEGORY_PAGE_COPY.updateSuccess);
      } else {
        await createCategoryMutation.mutateAsync(values);
        message.success(CATEGORY_PAGE_COPY.createSuccess);
      }

      setFormMode(null);
      setSelectedCategory(null);
    } catch (error) {
      message.error(resolveErrorMessage(error));
    }
  }

  function confirmDelete(category: Category) {
    modal.confirm({
      title: CATEGORY_PAGE_COPY.deleteTitle,
      content: `${CATEGORY_PAGE_COPY.deleteDescription} (${category.name})`,
      okText: CATEGORY_PAGE_COPY.deleteOkText,
      cancelText: CATEGORY_PAGE_COPY.cancelText,
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await deleteCategoryMutation.mutateAsync(category.id);
          message.success(CATEGORY_PAGE_COPY.deleteSuccess);
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
          <Typography.Title level={1}>{CATEGORY_PAGE_COPY.title}</Typography.Title>
          <Typography.Paragraph>{CATEGORY_PAGE_COPY.description}</Typography.Paragraph>
        </div>
      </section>

      <Card
        className="inventory-card"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            {CATEGORY_PAGE_COPY.addCategory}
          </Button>
        }
      >
        <div className="category-toolbar">
          <Input
            key={query}
            aria-label={CATEGORY_PAGE_COPY.searchLabel}
            defaultValue={query}
            allowClear
            prefix={<SearchOutlined />}
            placeholder={CATEGORY_PAGE_COPY.searchPlaceholder}
            onChange={(event) => scheduleSearch(event.target.value)}
            onPressEnter={(event) => updateSearch(event.currentTarget.value)}
            onClear={() => updateSearch("")}
          />
        </div>

        {categoriesQuery.isError ? (
          <Alert
            showIcon
            type="error"
            title={CATEGORY_PAGE_COPY.errorTitle}
            description={resolveErrorMessage(categoriesQuery.error)}
          />
        ) : (
          <CategoryTable
            categories={categories}
            pagination={pagination}
            loading={categoriesQuery.isLoading}
            onPageChange={updatePage}
            onEdit={openEditModal}
            onDelete={confirmDelete}
          />
        )}
      </Card>

      <Modal
        open={formMode !== null}
        title={modalTitle}
        okText={CATEGORY_PAGE_COPY.saveText}
        cancelText={CATEGORY_PAGE_COPY.cancelText}
        okButtonProps={{ htmlType: "submit", form: CATEGORY_FORM_ID, loading: isSubmitting }}
        onCancel={closeFormModal}
        destroyOnHidden
      >
        <CategoryForm formId={CATEGORY_FORM_ID} category={selectedCategory} onSubmit={handleFormSubmit} />
      </Modal>
    </>
  );
}

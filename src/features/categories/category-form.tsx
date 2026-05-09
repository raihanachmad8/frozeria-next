"use client";

import { Form, Input } from "antd";
import { useEffect } from "react";

import type { Category } from "@/modules/categories";

import { CATEGORY_PAGE_COPY } from "./constants";

export interface CategoryFormValues {
  name: string;
  description?: string | null;
}

interface CategoryFormProps {
  formId: string;
  category?: Category | null;
  onSubmit: (values: CategoryFormValues) => void;
}

export function CategoryForm({ formId, category, onSubmit }: CategoryFormProps) {
  const [form] = Form.useForm<CategoryFormValues>();

  useEffect(() => {
    form.setFieldsValue({
      name: category?.name ?? "",
      description: category?.description ?? "",
    });
  }, [category, form]);

  return (
    <Form
      id={formId}
      form={form}
      layout="vertical"
      requiredMark
      onFinish={(values) =>
        onSubmit({
          name: values.name?.trim(),
          description: values.description?.trim() || null,
        })
      }
    >
      <Form.Item
        label={CATEGORY_PAGE_COPY.nameLabel}
        name="name"
        rules={[{ required: true, message: "Nama kategori wajib diisi." }]}
      >
        <Input autoFocus placeholder={CATEGORY_PAGE_COPY.namePlaceholder} maxLength={100} />
      </Form.Item>

      <Form.Item label={CATEGORY_PAGE_COPY.descriptionLabel} name="description">
        <Input.TextArea placeholder={CATEGORY_PAGE_COPY.descriptionPlaceholder} maxLength={500} rows={4} showCount />
      </Form.Item>
    </Form>
  );
}

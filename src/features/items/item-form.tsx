"use client";

import { Form, Input, InputNumber, Select } from "antd";
import { useEffect } from "react";

import type { Category } from "@/modules/categories";
import type { CreateItemPayload, Item } from "@/modules/items";

import { ITEM_FORM_COPY, ITEM_UNIT_OPTIONS } from "./constants";

export type ItemFormValues = CreateItemPayload;

interface ItemFormProps {
  formId: string;
  item?: Item | null;
  categories: Category[];
  categoriesLoading?: boolean;
  onSubmit: (values: ItemFormValues) => void;
}

function emptyToNull(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function ItemForm({ formId, item, categories, categoriesLoading, onSubmit }: ItemFormProps) {
  const [form] = Form.useForm<ItemFormValues>();

  useEffect(() => {
    form.setFieldsValue({
      name: item?.name ?? "",
      categoryId: item?.categoryId ?? null,
      stock: item?.stock ?? 0,
      minimumStock: item?.minimumStock ?? 20,
      unit: item?.unit ?? "pcs",
      packageSize: item?.packageSize ?? null,
      purchasePrice: item?.purchasePrice ?? 0,
      sellingPrice: item?.sellingPrice ?? 0,
      photoUrl: item?.photoUrl ?? null,
      storageLocation: item?.storageLocation ?? null,
      description: item?.description ?? null,
    });
  }, [form, item]);

  return (
    <Form
      id={formId}
      form={form}
      layout="vertical"
      requiredMark
      onFinish={(values) =>
        onSubmit({
          name: values.name.trim(),
          categoryId: values.categoryId || null,
          stock: values.stock,
          minimumStock: values.minimumStock,
          unit: values.unit.trim(),
          packageSize: emptyToNull(values.packageSize),
          purchasePrice: values.purchasePrice ?? 0,
          sellingPrice: values.sellingPrice,
          photoUrl: emptyToNull(values.photoUrl),
          storageLocation: emptyToNull(values.storageLocation),
          description: emptyToNull(values.description),
        })
      }
    >
      <Form.Item
        label={ITEM_FORM_COPY.nameLabel}
        name="name"
        rules={[{ required: true, message: ITEM_FORM_COPY.nameRequired }]}
      >
        <Input autoFocus placeholder={ITEM_FORM_COPY.namePlaceholder} maxLength={150} />
      </Form.Item>

      <Form.Item label={ITEM_FORM_COPY.categoryLabel} name="categoryId">
        <Select
          allowClear
          loading={categoriesLoading}
          placeholder={ITEM_FORM_COPY.categoryPlaceholder}
          options={categories.map((category) => ({ label: category.name, value: category.id }))}
        />
      </Form.Item>

      <div className="form-grid">
        <Form.Item
          label={ITEM_FORM_COPY.stockLabel}
          name="stock"
          rules={[{ required: true, message: ITEM_FORM_COPY.stockRequired }]}
        >
          <InputNumber min={0} precision={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={ITEM_FORM_COPY.minimumStockLabel}
          name="minimumStock"
          rules={[{ required: true, message: ITEM_FORM_COPY.minimumStockRequired }]}
        >
          <InputNumber min={0} precision={0} style={{ width: "100%" }} />
        </Form.Item>
      </div>

      <div className="form-grid">
        <Form.Item
          label={ITEM_FORM_COPY.unitLabel}
          name="unit"
          rules={[{ required: true, message: ITEM_FORM_COPY.unitRequired }]}
        >
          <Select
            showSearch
            placeholder={ITEM_FORM_COPY.unitPlaceholder}
            options={[...ITEM_UNIT_OPTIONS]}
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item label={ITEM_FORM_COPY.packageSizeLabel} name="packageSize">
          <Input placeholder={ITEM_FORM_COPY.packageSizePlaceholder} maxLength={80} />
        </Form.Item>
      </div>

      <div className="form-grid">
        <Form.Item label={ITEM_FORM_COPY.purchasePriceLabel} name="purchasePrice">
          <InputNumber min={0} precision={0} prefix="Rp" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={ITEM_FORM_COPY.sellingPriceLabel}
          name="sellingPrice"
          rules={[{ required: true, message: ITEM_FORM_COPY.sellingPriceRequired }]}
        >
          <InputNumber min={0} precision={0} prefix="Rp" style={{ width: "100%" }} />
        </Form.Item>
      </div>

      <Form.Item label={ITEM_FORM_COPY.storageLocationLabel} name="storageLocation">
        <Input placeholder={ITEM_FORM_COPY.storageLocationPlaceholder} maxLength={120} />
      </Form.Item>

      <Form.Item label={ITEM_FORM_COPY.photoUrlLabel} name="photoUrl">
        <Input placeholder={ITEM_FORM_COPY.photoUrlPlaceholder} maxLength={500} />
      </Form.Item>

      <Form.Item label={ITEM_FORM_COPY.descriptionLabel} name="description">
        <Input.TextArea placeholder={ITEM_FORM_COPY.descriptionPlaceholder} maxLength={700} rows={3} showCount />
      </Form.Item>
    </Form>
  );
}

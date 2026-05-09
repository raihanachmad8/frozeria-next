"use client";

import { PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { App as AntApp, Form, Input, InputNumber, Select, Typography, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";

import { ApiClientError } from "@/lib/api";
import type { Category } from "@/modules/categories";
import type { CreateItemPayload, Item } from "@/modules/items";
import { uploadItemPhoto } from "@/modules/items";

import { ITEM_FORM_COPY, ITEM_UNIT_OPTIONS } from "./constants";

export type ItemFormValues = CreateItemPayload;
const MAX_ITEM_PHOTO_SIZE = 2 * 1024 * 1024;
const ALLOWED_ITEM_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ItemFormProps {
  formId: string;
  item?: Item | null;
  categories: Category[];
  categoriesLoading?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
  onSubmit: (values: ItemFormValues) => void;
}

function emptyToNull(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Foto gagal diunggah. Silakan coba lagi.";
}

function buildPhotoFileList(item?: Item | null): UploadFile[] {
  return item?.photoUrl
    ? [
        {
          uid: item.id,
          name: ITEM_FORM_COPY.photoUrlLabel,
          status: "done",
          url: item.photoUrl,
        },
      ]
    : [];
}

export function ItemForm({ formId, item, categories, categoriesLoading, onUploadingChange, onSubmit }: ItemFormProps) {
  const { message } = AntApp.useApp();
  const [form] = Form.useForm<ItemFormValues>();
  const [photoFileList, setPhotoFileList] = useState<UploadFile[]>(() => buildPhotoFileList(item));

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

  function setPhotoUploading(uploading: boolean) {
    onUploadingChange?.(uploading);
  }

  const validatePhotoFile: UploadProps["beforeUpload"] = (file) => {
    if (!ALLOWED_ITEM_PHOTO_TYPES.includes(file.type)) {
      message.error(ITEM_FORM_COPY.photoUploadTypeError);
      return Upload.LIST_IGNORE;
    }

    if (file.size > MAX_ITEM_PHOTO_SIZE) {
      message.error(ITEM_FORM_COPY.photoUploadSizeError);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handlePhotoUpload: UploadProps["customRequest"] = async ({ file, onError, onSuccess }) => {
    const selectedFile = file as File;

    setPhotoUploading(true);
    setPhotoFileList([
      {
        uid: selectedFile.name,
        name: selectedFile.name,
        status: "uploading",
      },
    ]);

    try {
      const uploadedPhoto = await uploadItemPhoto(selectedFile);
      form.setFieldValue("photoUrl", uploadedPhoto.url);
      setPhotoFileList([
        {
          uid: uploadedPhoto.key,
          name: selectedFile.name,
          status: "done",
          url: uploadedPhoto.url,
        },
      ]);
      message.success(ITEM_FORM_COPY.photoUploadSuccess);
      onSuccess?.(uploadedPhoto);
    } catch (error) {
      const errorMessage = resolveErrorMessage(error);
      form.setFields([{ name: "photoUrl", errors: [errorMessage] }]);
      setPhotoFileList([
        {
          uid: selectedFile.name,
          name: selectedFile.name,
          status: "error",
        },
      ]);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setPhotoUploading(false);
    }
  };

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
      <Form.Item name="photoUrl" hidden>
        <Input />
      </Form.Item>

      <Form.Item label={ITEM_FORM_COPY.photoUrlLabel}>
        <Upload.Dragger
          accept="image/jpeg,image/png,image/webp"
          beforeUpload={validatePhotoFile}
          className="item-photo-upload"
          customRequest={handlePhotoUpload}
          fileList={photoFileList}
          listType="picture"
          maxCount={1}
          onRemove={() => {
            form.setFieldValue("photoUrl", null);
            setPhotoFileList([]);
            message.info(ITEM_FORM_COPY.photoUploadRemove);
          }}
        >
          <p className="ant-upload-drag-icon">
            <PictureOutlined />
          </p>
          <Typography.Text strong>{ITEM_FORM_COPY.photoUploadText}</Typography.Text>
          <Typography.Paragraph type="secondary">{ITEM_FORM_COPY.photoUploadHint}</Typography.Paragraph>
          <span className="item-photo-upload-button">
            <PlusOutlined />
            {ITEM_FORM_COPY.photoUploadButton}
          </span>
        </Upload.Dragger>
      </Form.Item>

      <Form.Item
        label={ITEM_FORM_COPY.nameLabel}
        name="name"
        rules={[{ required: true, message: ITEM_FORM_COPY.nameRequired }]}
      >
        <Input autoFocus placeholder={ITEM_FORM_COPY.namePlaceholder} maxLength={150} />
      </Form.Item>

      <div className="form-grid">
        <Form.Item
          label={ITEM_FORM_COPY.categoryLabel}
          name="categoryId"
          rules={[{ required: true, message: ITEM_FORM_COPY.categoryRequired }]}
        >
          <Select
            loading={categoriesLoading}
            placeholder={ITEM_FORM_COPY.categoryPlaceholder}
            options={categories.map((category) => ({ label: category.name, value: category.id }))}
          />
        </Form.Item>

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
      </div>

      <div className="form-grid">
        <Form.Item
          label={ITEM_FORM_COPY.stockLabel}
          name="stock"
          rules={[{ required: true, message: ITEM_FORM_COPY.stockRequired }]}
        >
          <InputNumber min={0} precision={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label={ITEM_FORM_COPY.minimumStockLabel} name="minimumStock">
          <InputNumber min={0} precision={0} style={{ width: "100%" }} />
        </Form.Item>
      </div>

      <div className="form-grid">
        <Form.Item label={ITEM_FORM_COPY.sellingPriceLabel} name="sellingPrice">
          <InputNumber min={0} precision={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label={ITEM_FORM_COPY.purchasePriceLabel} name="purchasePrice">
          <InputNumber min={0} precision={0} style={{ width: "100%" }} />
        </Form.Item>
      </div>

      <div className="form-grid">
        <Form.Item label={ITEM_FORM_COPY.packageSizeLabel} name="packageSize">
          <Input placeholder={ITEM_FORM_COPY.packageSizePlaceholder} maxLength={80} />
        </Form.Item>

        <Form.Item label={ITEM_FORM_COPY.storageLocationLabel} name="storageLocation">
          <Input placeholder={ITEM_FORM_COPY.storageLocationPlaceholder} maxLength={120} />
        </Form.Item>
      </div>

      <Form.Item label={ITEM_FORM_COPY.descriptionLabel} name="description">
        <Input.TextArea placeholder={ITEM_FORM_COPY.descriptionPlaceholder} maxLength={700} rows={3} showCount />
      </Form.Item>
    </Form>
  );
}

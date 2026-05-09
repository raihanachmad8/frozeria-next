export interface UploadFileInput {
  buffer: Buffer;
  contentType: string;
  extension: string;
  fileName: string;
}

export interface UploadedFile {
  url: string;
  key: string;
  provider: "local" | "cloudinary" | "s3";
}

export interface StorageDriver {
  uploadItemPhoto(file: UploadFileInput): Promise<UploadedFile>;
}

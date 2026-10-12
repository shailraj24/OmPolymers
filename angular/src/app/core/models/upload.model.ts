export interface ImageUploadResponse {
  fileId: number;
  relativeUrl: string;
  category: string;
  originalFileName: string;
  uniqueFileName?: string;
  fileSizeBytes: number;
  contentType: string;
  uploadedAt: string;
}

export interface UploadProgressEvent {
  progress: number;
  response?: ImageUploadResponse;
}

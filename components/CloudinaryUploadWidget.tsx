'use client';

import { useEffect, useRef, type MouseEvent } from 'react';

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        config: CloudinaryUploadWidgetProps,
        callback: (error: Error | null, result: CloudinaryUploadResult) => void
      ) => {
        open: () => void;
        close: () => void;
        destroy: () => void;
      };
    };
  }
}

interface CloudinaryUploadWidgetProps {
  cloudName: string;
  uploadPreset: string;
  cropping?: boolean;
  multiple?: boolean;
  resourceType?: 'image' | 'video' | 'auto';
  maxImageFileSize?: number;
}

interface CloudinaryUploadResult {
  event: string;
  info: {
    public_id: string;
    secure_url: string;
    original_filename: string;
    format: string;
    bytes: number;
  };
}

interface CloudinaryUploadWidgetComponentProps {
  uwConfig: CloudinaryUploadWidgetProps;
  setPublicId: (publicId: string) => void;
}

const CloudinaryUploadWidget = ({
  uwConfig,
  setPublicId,
}: CloudinaryUploadWidgetComponentProps) => {
  const uploadWidgetRef = useRef<ReturnType<typeof window.cloudinary.createUploadWidget> | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (typeof window !== 'undefined' && window.cloudinary && uploadButtonRef.current) {
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === 'success') {
              console.log('Upload successful:', result.info);
              setPublicId(result.info.public_id);
            }
          }
        );

        const handleUploadClick = (e: MouseEvent) => {
          e.preventDefault();
          uploadWidgetRef.current?.open();
        };

        const button = uploadButtonRef.current;
        button.addEventListener('click', handleUploadClick as unknown as EventListener);

        return () => {
          button.removeEventListener('click', handleUploadClick as unknown as EventListener);
        };
      }
    };

    initializeUploadWidget();
  }, [uwConfig, setPublicId]);

  return (
    <button
      ref={uploadButtonRef}
      id="upload_widget"
      className="cloudinary-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      type="button"
    >
      Upload Image
    </button>
  );
};

export default CloudinaryUploadWidget;
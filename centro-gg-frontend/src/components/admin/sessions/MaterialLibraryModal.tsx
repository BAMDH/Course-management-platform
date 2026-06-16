import { useEffect, useState } from "react";

import { supabase } from "@/services/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
};

type StorageFile = {
  name: string;
};

export default function MaterialLibraryModal({
  open,
  onClose,
  onSelect,
}: Props) {
  const [files, setFiles] =
    useState<StorageFile[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (open) {
      loadFiles();
    }
  }, [open]);

  const loadFiles = async () => {
    setLoading(true);

    const { data, error } =
      await supabase.storage
        .from("course-materials")
        .list("", {
          limit: 100,
        });

    if (error) {
      console.error(error);

      setLoading(false);

      return;
    }

    setFiles(data || []);

    setLoading(false);
  };

  const uploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const { error } =
      await supabase.storage
        .from("course-materials")
        .upload(
          file.name,
          file,
          {
            upsert: false,
          }
        );

    if (error) {
      alert(error.message);

      return;
    }

    loadFiles();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[900px] max-w-[95vw] rounded-3xl p-8">

        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Biblioteca de Materiales
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mb-6">
          <label className="bg-red-600 text-white px-6 py-3 rounded-xl cursor-pointer inline-block">
            Subir Archivo

            <input
              type="file"
              className="hidden"
              onChange={uploadFile}
            />
          </label>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-auto">
            {files.map((file) => (
              <div
                key={file.name}
                onClick={() => {
                  onSelect(file.name);
                  onClose();
                }}
                className="border rounded-2xl p-4 cursor-pointer hover:bg-gray-50"
              >
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
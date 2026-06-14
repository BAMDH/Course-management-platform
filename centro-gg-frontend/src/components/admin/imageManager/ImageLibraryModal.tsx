import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

interface ImageLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}

type StorageImage = {
  name: string;
  publicUrl: string;
};

export default function ImageLibraryModal({
  open,
  onClose,
  onSelect,
}: ImageLibraryModalProps) {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);

  const loadImages = async () => {
    setLoading(true);

    const { data, error } = await supabase.storage
      .from("course-images")
      .list("", {
        limit: 100,
      });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const mapped =
      data?.map((file) => ({
        name: file.name,
        publicUrl: supabase.storage
          .from("course-images")
          .getPublicUrl(file.name).data.publicUrl,
      })) || [];

    setImages(mapped);
    setLoading(false);
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName =
      Date.now() + "-" + file.name;

    const { error } = await supabase.storage
      .from("course-images")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    loadImages();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[1000px] max-w-[95vw] rounded-3xl p-8 max-h-[85vh] overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">
            Biblioteca de Imágenes
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-8">
          <label className="bg-red-600 text-white px-6 py-3 rounded-xl cursor-pointer inline-block">
            Subir Nueva Imagen

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadImage}
            />
          </label>
        </div>

        {loading ? (
          <p>Cargando imágenes...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {images.map((image) => (
              <div
                key={image.name}
                className="cursor-pointer border rounded-2xl overflow-hidden hover:ring-4 hover:ring-red-500 transition"
                onClick={() => {
                  onSelect(image.name);
                  onClose();
                }}
              >
                <img
                  src={image.publicUrl}
                  alt=""
                  className="w-full h-44 object-cover"
                />

                <div className="p-3 text-xs truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
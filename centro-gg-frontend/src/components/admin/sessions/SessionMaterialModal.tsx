    import {
    useEffect,
    useState,
    } from "react";

    import Button from "@/components/admin/Button";

    import { supabase } from "@/services/supabase";
    import MaterialLibraryModal
    from "./MaterialLibraryModal";

    type Material = {
        id: string;

        title: string;

        description: string | null;

        file_path: string | null;
        };

    type Props = {
    open: boolean;

    onClose: () => void;

    courseId: string;

    sessionId: string;
    };

    const SessionMaterialsModal = ({
    open,
    onClose,
    courseId,
    sessionId,
    }: Props) => {
    const [materials, setMaterials] =
        useState<Material[]>([]);

    const [title, setTitle] =
        useState("");

    const [
        description,
        setDescription,
    ] = useState("");


    const fetchMaterials =
        async () => {
        const {
            data,
            error,
        } = await supabase
            .from("materials")
           .select(`
                id,
                title,
                description,
                file_path
                `)
            .eq(
            "session",
            sessionId
            )
            .order(
            "created_at",
            {
                ascending:
                false,
            }
            );

        if (error) {
            console.error(error);
            return;
        }

        setMaterials(data || []);
        };

    useEffect(() => {
        if (
        open &&
        sessionId
        ) {
        fetchMaterials();
        }
    }, [
        open,
        sessionId,
    ]);
    const [
  showPicker,
  setShowPicker,
] = useState(false);
    const [
    selectedFile,
    setSelectedFile,
    ] = useState("");
    const createMaterial =
        async () => {
        if (
            !title.trim()
        )
            return;

        if (!selectedFile) {
        alert(
            "Seleccione un archivo"
        );

        return;
        }
        const { error } =
            await supabase
            .from(
                "materials"
            )
            .insert({
                course_id: courseId,

                session: sessionId,

                title,

                description,

                file_path:
                    selectedFile,

                external_url:
                    null,

                kind: "document",

                is_downloadable:
                    true,

                is_extra_purchase:
                    false,

                price: 0,
                });

        if (error) {
            console.error(error);

            return;
        }

        setTitle("");

        setDescription("");

        setTitle("");

        setDescription("");

        setSelectedFile("");

        fetchMaterials();
        };

    const deleteMaterial =
        async (
        id: string
        ) => {
        if (
            !window.confirm(
            "¿Eliminar material?"
            )
        )
            return;

        const { error } =
            await supabase
            .from(
                "materials"
            )
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);

            return;
        }

        fetchMaterials();
        };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-auto">

            <h2 className="text-3xl font-bold mb-6">
            Materiales
            </h2>

            <div className="space-y-4 mb-8">
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) =>
                setTitle(
                    e.target.value
                )
                }
                className="w-full border rounded-2xl p-4"
            />

            <textarea
                placeholder="Descripción"
                value={
                description
                }
                onChange={(e) =>
                setDescription(
                    e.target.value
                )
                }
                className="w-full border rounded-2xl p-4"
            />

            <Button
                variant="secondary"
                onClick={() =>
                    setShowPicker(true)
                }
                >
                Seleccionar Archivo
                </Button>
                <p className="text-sm text-gray-500">
                {selectedFile ||
                    "Ningún archivo seleccionado"}
                </p>
            <Button
                onClick={
                createMaterial
                }
            >
                Agregar Material
            </Button>
            </div>

            <div className="space-y-4">
            {materials.map(
                (
                material
                ) => (
                <div
                    key={
                    material.id
                    }
                    className="border rounded-2xl p-4 flex justify-between"
                >
                    <div>
                    <h3 className="font-bold">
                        {
                        material.title
                        }
                    </h3>

                    <p className="text-sm text-gray-500">
                        {
                        material.description
                        }
                    </p>

                   <p className="text-sm text-blue-600">
                    {material.file_path}
                    </p>
                    </div>

                    <Button
                    onClick={() =>
                        deleteMaterial(
                        material.id
                        )
                    }
                    >
                    Eliminar
                    </Button>
                </div>
                )
            )}
            </div>

            <div className="flex justify-end mt-8">
            <Button
                variant="secondary"
                onClick={onClose}
            >
                Cerrar
            </Button>
            </div>
        </div>
        <MaterialLibraryModal
        open={showPicker}
        onClose={() =>
            setShowPicker(false)
        }
        onSelect={(path) =>
            setSelectedFile(path)
        }
        />
        </div>
        
    );
    
    };

    export default SessionMaterialsModal;
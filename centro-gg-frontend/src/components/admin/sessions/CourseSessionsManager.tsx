import {
  useEffect,
  useState,
} from "react";

import Card from "@/components/admin/Cards/Card";

import Button from "@/components/admin/Button";

import { supabase } from "@/services/supabase";

import SessionMaterialsModal from "./SessionMaterialModal";
import SessionFormModal from "./SessionFormModal";
type CourseSession = {
  id: string;
  course_id: string;

  title: string;

  description: string | null;

  starts_at: string | null;

  ends_at: string | null;

  session_order: number | null;
};
type Props = {
  courseId: string;
};


const CourseSessionsManager = ({
  courseId,
}: Props) => {
  const [sessions, setSessions] =
    useState<CourseSession[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    selectedSession,
    setSelectedSession,
  ] = useState<CourseSession | null>(
    null
  );

  const [
  materialsModalOpen,
  setMaterialsModalOpen,
] = useState(false);
  const fetchSessions =
    async () => {
      try {
        setLoading(true);

        const {
          data,
          error,
        } = await supabase
          .from(
            "course_sessions"
          )
          .select("*")
          .eq(
            "course_id",
            courseId
          )
          .order(
            "starts_at",
            {
              ascending:
                true,
            }
          );

        if (error)
          throw error;

        setSessions(
          data || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSessions();
  }, [courseId]);

  const deleteSession =
    async (
      sessionId: string
    ) => {
      const confirmDelete =
        window.confirm(
          "¿Eliminar sesión?"
        );

      if (!confirmDelete)
        return;

      const { error } =
        await supabase
          .from(
            "course_sessions"
          )
          .delete()
          .eq(
            "id",
            sessionId
          );

      if (error) {
        console.error(error);

        return;
      }

      fetchSessions();
    };
    
const formatDateLiteral = (
  date: string | null
) => {
  if (!date) return "";

  const [datePart, timePart] =
    date.split("T");

  const [year, month, day] =
    datePart.split("-");

  const [hour, minute] =
    timePart.split(":");

  return `${day}/${month}/${year} ${hour}:${minute}`;
};
  return (
    <>
      <Card className="p-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Sesiones
          </h2>

          <Button
            onClick={() => {
              setSelectedSession(
                null
              );

              setModalOpen(
                true
              );
            }}
          >
            Nueva Sesión
          </Button>
        </div>

        {loading ? (
          <p>
            Cargando sesiones...
          </p>
        ) : sessions.length ===
          0 ? (
          <div className="bg-gray-50 rounded-3xl p-8 text-center">
            No existen sesiones
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map(
              (
                session,
                index
              ) => (
                <div
                  key={
                    session.id
                  }
                  className="bg-gray-50 rounded-3xl p-6"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-xl">
                        Sesión{" "}
                        {index +
                          1}
                        :{" "}
                        {
                          session.title
                        }
                      </h3>

                      {session.description && (
                        <p className="mt-2 text-gray-600">
                          {
                            session.description
                          }
                        </p>
                      )}

                      <div className="mt-4 text-sm text-gray-500">
                        {formatDateLiteral(
                            session.starts_at
                        )}

                        {session.ends_at &&
                            ` - ${formatDateLiteral(
                            session.ends_at
                            )}`}
                        </div>
                    </div>

                    <div className="flex gap-2 h-fit">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedSession(
                            session
                          );

                          setModalOpen(
                            true
                          );
                        }}
                      >
                        Editar
                      </Button>

                      <Button
                        onClick={() =>
                          deleteSession(
                            session.id
                          )
                        }
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                            setSelectedSession(session);
                            setMaterialsModalOpen(true);
                        }}
                        >
                        Materiales
                        </Button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Card>
<SessionMaterialsModal
  open={materialsModalOpen}
  onClose={() =>
    setMaterialsModalOpen(false)
  }
  courseId={courseId}
  sessionId={
    selectedSession?.id || ""
  }
/>
      <SessionFormModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(
            false
          )
        }
        onSaved={
          fetchSessions
        }
        courseId={courseId}
        session={
          selectedSession
        }
      />
    </>
  );
};

export default CourseSessionsManager;
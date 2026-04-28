import { useParams } from 'react-router-dom';

const TeacherCourseDetail = () => {
  const { courseId } = useParams();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-2">Detalle del curso</h1>
      <p className="text-gray-500">ID: {courseId}</p>
    </main>
  );
};

export default TeacherCourseDetail;

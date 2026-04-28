import { useParams } from 'react-router-dom';

const StudentClassroom = () => {
  const { courseId } = useParams();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-2">Aula virtual</h1>
      <p className="text-gray-500">Curso: {courseId}</p>
    </main>
  );
};

export default StudentClassroom;

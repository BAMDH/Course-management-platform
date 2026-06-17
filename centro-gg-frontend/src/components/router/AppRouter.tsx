import { lazy, Suspense, useEffect } from 'react';
import { PublicLayout } from './PublicLayout';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
  Outlet
} from 'react-router-dom';

// ── Componentes core ─────────────────────────────────────────────────────────
import Header from '@/components/nav/Header';
import { TeacherLayout } from '@/layout/TeacherLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ROLES } from '@/auth/roles';
import AdminResources from '@/pages/admin/AdminResources';
import { StudentLayout } from '@/components/layout/StudentLayout';

// ── Páginas públicas / auth ──────────────────────────────────────────────────
const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));
const CoursesPage = lazy(() => import('@/pages/landing/CoursesPage'));
const CourseDetail = lazy(() => import('@/pages/landing/CourseDetailPage'));
const AboutPage = lazy(() => import('@/pages/landing/AboutPage'));
const ContactPage = lazy(() => import('@/pages/landing/ContactPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const AuthCallback = lazy(() => import('@/pages/auth/AuthCallback'));
const Unauthorized = lazy(() => import('@/pages/other/UnauthorizedPage'));
const ErrorPage = lazy(() => import('@/pages/other/ErrorPage'));

// ── Páginas de estudiante ────────────────────────────────────────────────────
const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'));
const StudentCourses = lazy(() => import('@/pages/student/StudentCourses'));
const StudentClassroom = lazy(() => import('@/pages/student/StudentClassroom'));
const StudentPayments = lazy(() => import('@/pages/student/StudentPayments'));
const StudentCertificates = lazy(() => import('@/pages/student/StudentCertificates'));
const StudentProfile = lazy(() => import('@/pages/student/StudentProfile'));
const StudentCalendar = lazy(() => import('@/pages/student/StudentCalendar'));
const StudentCourseEnrollment = lazy(() => import('@/pages/student/StudentCourseEnrollment'));
const StudentHelpPage = lazy(() => import('@/pages/student/StudentHelpPage'));

// ── Páginas de profesor ──────────────────────────────────────────────────────
const TeacherDashboard = lazy(() => import('@/pages/teacher/TeacherDashboard'));
const TeacherCourses = lazy(() => import('@/pages/teacher/TeacherCourses'));
const TeacherCourseDetail = lazy(() => import('@/pages/teacher/TeacherCourseDetail'));
const TeacherMaterials = lazy(() => import('@/pages/teacher/TeacherMaterials'));
const TeacherAttendance = lazy(() => import('@/pages/teacher/TeacherAttendance'));
const TeacherAnnouncements = lazy(() => import('@/pages/teacher/TeacherAnnouncements'));
const TeacherGrades = lazy(() => import('@/pages/teacher/TeacherGrades'));
const TeacherCalendar = lazy(() => import('@/pages/teacher/TeacherCalendar'));
const TeacherProfile = lazy(() => import('@/pages/teacher/TeacherProfile'));
const TeacherStudents = lazy(() => import('@/pages/teacher/TeacherStudents'));
const TeacherStudentDetail = lazy(() => import('@/pages/teacher/TeacherStudentDetail'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));

// ── Páginas de administrador ─────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminCourses = lazy(() => import('@/pages/admin/AdminCourses'));
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments'));
const AdminPaymentDetail = lazy(() => import('@/pages/admin/AdminPaymentDetail'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminCreateCourse = lazy(() => import('@/pages/admin/AdminCreateCourse'));
const AdminAttendance = lazy(() => import('@/pages/admin/AdminAttendance'));
const AdminAttendanceDetails = lazy(() => import('@/pages/admin/AdminAttendanceDetails'));

// ─────────────────────────────────────────────────────────────────────────────
// Rutas públicas
// ─────────────────────────────────────────────────────────────────────────────
const publicLayout = (
  <Route element={<PublicLayout />} errorElement={<ErrorPage />}>
    <Route index element={<LandingPage />} />
    <Route path="courses" element={<CoursesPage />} />
    <Route path="courses/:courseId" element={<CourseDetail />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />
  </Route>
);

// ─────────────────────────────────────────────────────────────────────────────
// Rutas de autenticación
// ─────────────────────────────────────────────────────────────────────────────
const authLayout = (
  <Route errorElement={<ErrorPage />}>
    <Route path="welcome" element={<LandingPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="reset-password" element={<ResetPasswordPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="auth/callback" element={<AuthCallback />} />
    <Route path="unauthorized" element={<Unauthorized />} />
  </Route>
);

// ─────────────────────────────────────────────────────────────────────────────
// Rutas de estudiante
// ─────────────────────────────────────────────────────────────────────────────
const studentLayout = (
  <Route
    path="student"
    element={
      <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
        <StudentLayout />
      </ProtectedRoute>
    }
    errorElement={<ErrorPage />}
  >
    <Route index element={<StudentDashboard />} />
    <Route path="courses" element={<StudentCourses />} />
    <Route path="courses/:courseId/classroom" element={<StudentClassroom />} />
    <Route path="courses/:courseId/enroll" element={<StudentCourseEnrollment />} />
    <Route path="payments" element={<StudentPayments />} />
    <Route path="certificates" element={<StudentCertificates />} />
    <Route path="profile" element={<StudentProfile />} />
    <Route path="calendar" element={<StudentCalendar />} />
    <Route path="help" element={<StudentHelpPage />} />
  </Route>
);

// ─────────────────────────────────────────────────────────────────────────────
// Rutas de profesor
// ─────────────────────────────────────────────────────────────────────────────
const teacherLayout = (
  <Route
    path="teacher"
    element={
      <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
        <TeacherLayout />
      </ProtectedRoute>
    }
    errorElement={<ErrorPage />}
  >
    <Route index element={<TeacherDashboard />} />
    <Route path="courses" element={<TeacherCourses />} />
    <Route path="courses/:courseId" element={<TeacherCourseDetail />} />
    <Route path="courses/:courseId/materials" element={<TeacherMaterials />} />
    <Route path="courses/:courseId/announcements" element={<TeacherAnnouncements />} />
    <Route path="courses/:courseId/grades" element={<TeacherGrades />} />
    <Route path="courses/:courseId/attendance" element={<TeacherAttendance />} />
    <Route path="attendance" element={<TeacherAttendance />} />
    <Route path="calendar" element={<TeacherCalendar />} />
    <Route path="profile" element={<TeacherProfile />} />
    <Route path="students" element={<TeacherStudents />} />
    <Route path="students/:studentId" element={<TeacherStudentDetail />} />
    <Route path="help" element={<HelpPage />} />
  </Route>
);

// ─────────────────────────────────────────────────────────────────────────────
// Rutas de administrador
// ─────────────────────────────────────────────────────────────────────────────
const adminLayout = (
  <Route
    path="admin"
    element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Header />
      </ProtectedRoute>
    }
    errorElement={<ErrorPage />}
  >
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="courses" element={<AdminCourses />} />
    <Route path="courses/create" element={<AdminCreateCourse />} />
    <Route path="payments" element={<AdminPayments />} />
    <Route path="payments/detail/:id" element={<AdminPaymentDetail />} />
    <Route path="reports" element={<AdminReports />} />
    <Route path="resources/:id" element={<AdminResources />} />
    <Route path="attendance" element={<AdminAttendance />} />
    <Route path="attendance/details/:id" element={<AdminAttendanceDetails />} />
  </Route>
);

// ─────────────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────────────

function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'Centro GG';

    if (path.startsWith('/admin')) {
      title = 'Admin | Centro GG';
    } else if (path.startsWith('/teacher')) {
      title = 'Teacher | Centro GG';
    } else if (path.startsWith('/student')) {
      title = 'Student | Centro GG';
    } else if (path.includes('/login')) {
      title = 'Login | Centro GG';
    } else if (path.includes('/register')) {
      title = 'Register | Centro GG';
    } else if (path.includes('/courses')) {
      title = 'Courses | Centro GG';
    }

    document.title = title;
  }, [location]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<TitleManager />}>
      {publicLayout}
      {authLayout}
      {studentLayout}
      {teacherLayout}
      {adminLayout}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

const PageLoader = () => (
  <div
    className="flex min-h-screen items-center justify-center"
    style={{ backgroundColor: 'var(--background)' }}
  >
    <div
      className="h-8 w-8 animate-spin rounded-full border-b-2"
      style={{ borderBottomColor: 'var(--brand-tertiary-500, #3b82f6)' }}
    />
  </div>
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
-- 20260427_initial_schema.sql
-- Centro de Capacitación G&G
-- Initial Supabase schema for:
-- - authentication profiles and roles
-- - courses and teachers
-- - enrollments / waitlist
-- - virtual classroom materials / recipes
-- - announcements
-- - assignments, submissions and grades
-- - sessions and attendance
-- - payments
-- - certificates
-- - audit logs
--
-- Place this file inside:
-- supabase/migrations/<timestamp>_initial_schema.sql

begin;

-- =========================================================
-- Extensions
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- Enums
-- =========================================================

create type public.app_role as enum (
  'student',
  'teacher',
  'admin'
);

create type public.account_status as enum (
  'active',
  'blocked'
);

create type public.course_status as enum (
  'draft',
  'published',
  'open',
  'in_progress',
  'completed',
  'cancelled',
  'archived'
);

create type public.enrollment_status as enum (
  'pending_payment',
  'waitlisted',
  'active',
  'completed',
  'cancelled',
  'failed'
);

create type public.payment_status as enum (
  'pending',
  'paid',
  'cancelled',
  'refunded'
);

create type public.payment_method as enum (
  'cash',
  'bank_transfer',
  'sinpe',
  'card',
  'other'
);

create type public.material_kind as enum (
  'recipe',
  'document',
  'video',
  'link',
  'extra'
);

create type public.assignment_submission_status as enum (
  'draft',
  'submitted',
  'late',
  'graded'
);

create type public.attendance_status as enum (
  'present',
  'absent',
  'late',
  'excused'
);

create type public.purchasable_item_type as enum (
  'course',
  'material'
);

-- =========================================================
-- Shared trigger functions
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- Profiles and roles
-- =========================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  date_of_birth date,
  avatar_url text,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_email_not_empty check (length(trim(email)) > 0)
);

create unique index profiles_email_unique_idx on public.profiles (lower(email));

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,

  primary key (user_id, role)
);

create index user_roles_role_idx on public.user_roles (role);

-- Automatically create a profile and default student role when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================
-- Courses
-- =========================================================

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  category text,
  level text,
  duration_hours numeric(6,2),
  requirements text,
  location text,
  start_date date,
  end_date date,
  price numeric(12,2) not null default 0,
  max_capacity smallint not null default 7,
  status public.course_status not null default 'draft',
  cover_image_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint courses_title_not_empty check (length(trim(title)) > 0),
  constraint courses_price_non_negative check (price >= 0),
  constraint courses_max_capacity_valid check (max_capacity between 1 and 7),
  constraint courses_date_order check (
    start_date is null
    or end_date is null
    or end_date >= start_date
  )
);

create index courses_status_idx on public.courses (status);
create index courses_category_idx on public.courses (category);
create index courses_start_date_idx on public.courses (start_date);

create trigger set_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

create table public.course_teachers (
  course_id uuid not null references public.courses(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),

  primary key (course_id, teacher_id)
);

create index course_teachers_teacher_idx on public.course_teachers (teacher_id);

-- =========================================================
-- Enrollments and waitlist
-- =========================================================

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  status public.enrollment_status not null default 'pending_payment',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  cancelled_at timestamptz,
  notes text,

  constraint enrollments_unique_student_course unique (course_id, student_id)
);

create index enrollments_course_idx on public.enrollments (course_id);
create index enrollments_student_idx on public.enrollments (student_id);
create index enrollments_status_idx on public.enrollments (status);

-- =========================================================
-- Course sessions and attendance
-- =========================================================

create table public.course_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  session_order integer,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint course_sessions_title_not_empty check (length(trim(title)) > 0),
  constraint course_sessions_time_order check (
    starts_at is null
    or ends_at is null
    or ends_at >= starts_at
  )
);

create index course_sessions_course_idx on public.course_sessions (course_id);
create index course_sessions_starts_at_idx on public.course_sessions (starts_at);

create trigger set_course_sessions_updated_at
before update on public.course_sessions
for each row execute function public.set_updated_at();

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.course_sessions(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  status public.attendance_status not null,
  notes text,
  recorded_by uuid references auth.users(id) on delete set null,
  recorded_at timestamptz not null default now(),

  constraint attendance_unique_student_session unique (session_id, student_id)
);

create index attendance_course_idx on public.attendance (course_id);
create index attendance_student_idx on public.attendance (student_id);

-- =========================================================
-- Virtual classroom: materials / recipes and announcements
-- =========================================================

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  kind public.material_kind not null default 'document',
  file_path text,
  external_url text,
  is_downloadable boolean not null default true,
  is_extra_purchase boolean not null default false,
  price numeric(12,2) not null default 0,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint materials_title_not_empty check (length(trim(title)) > 0),
  constraint materials_price_non_negative check (price >= 0),
  constraint materials_has_file_or_url check (
    file_path is not null
    or external_url is not null
  )
);

create index materials_course_idx on public.materials (course_id);
create index materials_kind_idx on public.materials (kind);
create index materials_published_at_idx on public.materials (published_at);

create trigger set_materials_updated_at
before update on public.materials
for each row execute function public.set_updated_at();

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content text not null,
  created_by uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint announcements_title_not_empty check (length(trim(title)) > 0),
  constraint announcements_content_not_empty check (length(trim(content)) > 0)
);

create index announcements_course_idx on public.announcements (course_id);
create index announcements_published_at_idx on public.announcements (published_at desc);

create trigger set_announcements_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

-- =========================================================
-- Assignments, submissions and grades
-- =========================================================

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  max_score numeric(6,2) not null default 100,
  weight numeric(6,2) not null default 0,
  due_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint assignments_title_not_empty check (length(trim(title)) > 0),
  constraint assignments_max_score_positive check (max_score > 0),
  constraint assignments_weight_valid check (weight >= 0 and weight <= 100)
);

create index assignments_course_idx on public.assignments (course_id);
create index assignments_due_at_idx on public.assignments (due_at);

create trigger set_assignments_updated_at
before update on public.assignments
for each row execute function public.set_updated_at();

create table public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  content text,
  file_path text,
  status public.assignment_submission_status not null default 'draft',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint assignment_submissions_unique unique (assignment_id, student_id)
);

create index assignment_submissions_assignment_idx on public.assignment_submissions (assignment_id);
create index assignment_submissions_student_idx on public.assignment_submissions (student_id);
create index assignment_submissions_course_idx on public.assignment_submissions (course_id);

create trigger set_assignment_submissions_updated_at
before update on public.assignment_submissions
for each row execute function public.set_updated_at();

create table public.assignment_grades (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  submission_id uuid references public.assignment_submissions(id) on delete set null,
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  score numeric(6,2) not null,
  feedback text,
  graded_by uuid references auth.users(id) on delete set null,
  graded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint assignment_grades_unique unique (assignment_id, student_id),
  constraint assignment_grades_score_non_negative check (score >= 0)
);

create index assignment_grades_assignment_idx on public.assignment_grades (assignment_id);
create index assignment_grades_student_idx on public.assignment_grades (student_id);
create index assignment_grades_course_idx on public.assignment_grades (course_id);

create trigger set_assignment_grades_updated_at
before update on public.assignment_grades
for each row execute function public.set_updated_at();

-- =========================================================
-- Payments and purchase details
-- =========================================================

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  status public.payment_status not null default 'pending',
  method public.payment_method,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  reference_number text,
  notes text,
  issued_at timestamptz not null default now(),
  paid_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),

  constraint payments_amounts_valid check (
    subtotal >= 0
    and discount >= 0
    and total >= 0
  )
);

create index payments_student_idx on public.payments (student_id);
create index payments_status_idx on public.payments (status);
create index payments_issued_at_idx on public.payments (issued_at desc);

create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create table public.payment_items (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  item_type public.purchasable_item_type not null,
  course_id uuid references public.courses(id) on delete set null,
  material_id uuid references public.materials(id) on delete set null,
  description text not null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),

  constraint payment_items_quantity_positive check (quantity > 0),
  constraint payment_items_amounts_valid check (unit_price >= 0 and total >= 0),
  constraint payment_items_target_valid check (
    (item_type = 'course' and course_id is not null)
    or
    (item_type = 'material' and material_id is not null)
  )
);

create index payment_items_payment_idx on public.payment_items (payment_id);
create index payment_items_course_idx on public.payment_items (course_id);
create index payment_items_material_idx on public.payment_items (material_id);

-- =========================================================
-- Certificates
-- =========================================================

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  certificate_code text not null unique default encode(gen_random_bytes(10), 'hex'),
  file_path text,
  issued_at timestamptz not null default now(),
  issued_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),

  constraint certificates_unique_student_course unique (course_id, student_id)
);

create index certificates_course_idx on public.certificates (course_id);
create index certificates_student_idx on public.certificates (student_id);

-- =========================================================
-- Audit logs
-- =========================================================

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text,
  record_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),

  constraint audit_logs_action_not_empty check (length(trim(action)) > 0)
);

create index audit_logs_actor_idx on public.audit_logs (actor_id);
create index audit_logs_table_idx on public.audit_logs (table_name);
create index audit_logs_created_at_idx on public.audit_logs (created_at desc);

-- =========================================================
-- Helper functions for RLS
-- =========================================================

create or replace function public.has_role(_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    where ur.user_id = auth.uid()
      and ur.role = _role
      and p.status = 'active'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('admin');
$$;

create or replace function public.current_user_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
  );
$$;

create or replace function public.is_teacher_of_course(_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.course_teachers ct
    join public.profiles p on p.id = ct.teacher_id
    where ct.course_id = _course_id
      and ct.teacher_id = auth.uid()
      and p.status = 'active'
  );
$$;

create or replace function public.is_enrolled_in_course(_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.profiles p on p.id = e.student_id
    where e.course_id = _course_id
      and e.student_id = auth.uid()
      and e.status in ('active', 'completed')
      and p.status = 'active'
  );
$$;

create or replace function public.can_access_course(_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin()
    or public.is_teacher_of_course(_course_id)
    or public.is_enrolled_in_course(_course_id);
$$;

-- =========================================================
-- Enable RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.courses enable row level security;
alter table public.course_teachers enable row level security;
alter table public.enrollments enable row level security;
alter table public.course_sessions enable row level security;
alter table public.attendance enable row level security;
alter table public.materials enable row level security;
alter table public.announcements enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.assignment_grades enable row level security;
alter table public.payments enable row level security;
alter table public.payment_items enable row level security;
alter table public.certificates enable row level security;
alter table public.audit_logs enable row level security;

-- =========================================================
-- RLS Policies: profiles and roles
-- =========================================================

create policy "profiles_select_own_related_or_admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
  or exists (
    select 1
    from public.enrollments e
    where e.student_id = profiles.id
      and public.is_teacher_of_course(e.course_id)
  )
);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_update_own_basic_info"
on public.profiles
for update
to authenticated
using (id = auth.uid() and public.current_user_is_active())
with check (id = auth.uid());

create policy "profiles_admin_update"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Prevent normal users from updating protected columns directly.
-- They can update only basic editable profile fields.
revoke update on public.profiles from authenticated;
grant update (full_name, phone, date_of_birth, avatar_url, updated_at) on public.profiles to authenticated;

create policy "user_roles_select_own_or_admin"
on public.user_roles
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

create policy "user_roles_admin_insert"
on public.user_roles
for insert
to authenticated
with check (public.is_admin());

create policy "user_roles_admin_update"
on public.user_roles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "user_roles_admin_delete"
on public.user_roles
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- RLS Policies: courses
-- =========================================================

create policy "courses_public_can_read_published"
on public.courses
for select
to anon, authenticated
using (
  status in ('published', 'open', 'in_progress')
  or public.can_access_course(id)
);

create policy "courses_admin_insert"
on public.courses
for insert
to authenticated
with check (public.is_admin());

create policy "courses_admin_update"
on public.courses
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "courses_admin_delete"
on public.courses
for delete
to authenticated
using (public.is_admin());

create policy "course_teachers_select_related"
on public.course_teachers
for select
to authenticated
using (
  teacher_id = auth.uid()
  or public.is_admin()
  or public.is_enrolled_in_course(course_id)
);

create policy "course_teachers_admin_insert"
on public.course_teachers
for insert
to authenticated
with check (public.is_admin());

create policy "course_teachers_admin_delete"
on public.course_teachers
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- RLS Policies: enrollments, sessions and attendance
-- =========================================================

create policy "enrollments_select_related"
on public.enrollments
for select
to authenticated
using (
  student_id = auth.uid()
  or public.is_teacher_of_course(course_id)
  or public.is_admin()
);

-- Students can request enrollment, but cannot directly activate themselves.
create policy "enrollments_student_insert_pending"
on public.enrollments
for insert
to authenticated
with check (
  student_id = auth.uid()
  and status in ('pending_payment', 'waitlisted')
  and public.current_user_is_active()
);

create policy "enrollments_admin_manage"
on public.enrollments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "course_sessions_select_course_members"
on public.course_sessions
for select
to authenticated
using (public.can_access_course(course_id));

create policy "course_sessions_teacher_or_admin_manage"
on public.course_sessions
for all
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
)
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "attendance_select_related"
on public.attendance
for select
to authenticated
using (
  student_id = auth.uid()
  or public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "attendance_teacher_or_admin_manage"
on public.attendance
for all
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
)
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

-- =========================================================
-- RLS Policies: materials and announcements
-- =========================================================

create policy "materials_select_course_members"
on public.materials
for select
to authenticated
using (public.can_access_course(course_id));

create policy "materials_teacher_or_admin_insert"
on public.materials
for insert
to authenticated
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "materials_teacher_or_admin_update"
on public.materials
for update
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
)
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "materials_teacher_or_admin_delete"
on public.materials
for delete
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "announcements_select_course_members"
on public.announcements
for select
to authenticated
using (public.can_access_course(course_id));

create policy "announcements_teacher_or_admin_insert"
on public.announcements
for insert
to authenticated
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "announcements_teacher_or_admin_update"
on public.announcements
for update
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
)
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "announcements_teacher_or_admin_delete"
on public.announcements
for delete
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

-- =========================================================
-- RLS Policies: assignments, submissions and grades
-- =========================================================

create policy "assignments_select_course_members"
on public.assignments
for select
to authenticated
using (public.can_access_course(course_id));

create policy "assignments_teacher_or_admin_manage"
on public.assignments
for all
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
)
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "submissions_select_related"
on public.assignment_submissions
for select
to authenticated
using (
  student_id = auth.uid()
  or public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "submissions_student_insert_own"
on public.assignment_submissions
for insert
to authenticated
with check (
  student_id = auth.uid()
  and public.is_enrolled_in_course(course_id)
);

create policy "submissions_student_update_own"
on public.assignment_submissions
for update
to authenticated
using (
  student_id = auth.uid()
  and public.is_enrolled_in_course(course_id)
)
with check (
  student_id = auth.uid()
  and public.is_enrolled_in_course(course_id)
);

create policy "submissions_teacher_or_admin_manage"
on public.assignment_submissions
for all
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
)
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "grades_select_related"
on public.assignment_grades
for select
to authenticated
using (
  student_id = auth.uid()
  or public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "grades_teacher_or_admin_manage"
on public.assignment_grades
for all
to authenticated
using (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
)
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

-- =========================================================
-- RLS Policies: payments
-- =========================================================

create policy "payments_select_own_or_admin"
on public.payments
for select
to authenticated
using (
  student_id = auth.uid()
  or public.is_admin()
);

create policy "payments_student_insert_pending"
on public.payments
for insert
to authenticated
with check (
  student_id = auth.uid()
  and status = 'pending'
  and public.current_user_is_active()
);

create policy "payments_admin_manage"
on public.payments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "payment_items_select_owner_or_admin"
on public.payment_items
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.payments p
    where p.id = payment_items.payment_id
      and p.student_id = auth.uid()
  )
);

create policy "payment_items_student_insert_own_pending_payment"
on public.payment_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.payments p
    where p.id = payment_items.payment_id
      and p.student_id = auth.uid()
      and p.status = 'pending'
  )
);

create policy "payment_items_admin_manage"
on public.payment_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- RLS Policies: certificates and audit logs
-- =========================================================

create policy "certificates_select_related"
on public.certificates
for select
to authenticated
using (
  student_id = auth.uid()
  or public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "certificates_teacher_or_admin_insert"
on public.certificates
for insert
to authenticated
with check (
  public.is_teacher_of_course(course_id)
  or public.is_admin()
);

create policy "certificates_admin_delete"
on public.certificates
for delete
to authenticated
using (public.is_admin());

create policy "audit_logs_admin_select"
on public.audit_logs
for select
to authenticated
using (public.is_admin());

create policy "audit_logs_admin_insert"
on public.audit_logs
for insert
to authenticated
with check (public.is_admin());

-- =========================================================
-- Storage buckets
-- =========================================================

insert into storage.buckets (id, name, public)
values
  ('course-materials', 'course-materials', false),
  ('certificates', 'certificates', false),
  ('profile-images', 'profile-images', false)
on conflict (id) do nothing;

-- Course material files are private.
-- Expected path convention:
-- course-materials/<course_id>/<file-name>
create policy "storage_course_materials_select_course_members"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'course-materials'
  and exists (
    select 1
    from public.materials m
    where m.file_path = storage.objects.name
      and public.can_access_course(m.course_id)
  )
);

create policy "storage_course_materials_insert_teacher_or_admin"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'course-materials'
  and (
    public.is_admin()
    or (
      storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
      and public.is_teacher_of_course((split_part(storage.objects.name, '/', 1))::uuid)
    )
  )
);

create policy "storage_course_materials_update_teacher_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'course-materials'
  and (
    public.is_admin()
    or (
      storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
      and public.is_teacher_of_course((split_part(storage.objects.name, '/', 1))::uuid)
    )
  )
)
with check (
  bucket_id = 'course-materials'
  and (
    public.is_admin()
    or (
      storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
      and public.is_teacher_of_course((split_part(storage.objects.name, '/', 1))::uuid)
    )
  )
);

create policy "storage_course_materials_delete_teacher_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'course-materials'
  and (
    public.is_admin()
    or (
      storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
      and public.is_teacher_of_course((split_part(storage.objects.name, '/', 1))::uuid)
    )
  )
);

-- Certificate files are private.
-- Expected path can be anything, but the file_path must match certificates.file_path.
create policy "storage_certificates_select_related"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'certificates'
  and exists (
    select 1
    from public.certificates c
    where c.file_path = storage.objects.name
      and (
        c.student_id = auth.uid()
        or public.is_teacher_of_course(c.course_id)
        or public.is_admin()
      )
  )
);

create policy "storage_certificates_insert_teacher_or_admin"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'certificates'
  and (
    public.is_admin()
    or (
      storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
      and public.is_teacher_of_course((split_part(storage.objects.name, '/', 1))::uuid)
    )
  )
);

-- Profile images are private by default.
-- Expected path convention:
-- profile-images/<user_id>/<file-name>
create policy "storage_profile_images_select_own_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-images'
  and (
    public.is_admin()
    or (
      storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
      and (split_part(storage.objects.name, '/', 1))::uuid = auth.uid()
    )
  )
);

create policy "storage_profile_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-images'
  and storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
  and (split_part(storage.objects.name, '/', 1))::uuid = auth.uid()
);

create policy "storage_profile_images_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-images'
  and storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
  and (split_part(storage.objects.name, '/', 1))::uuid = auth.uid()
)
with check (
  bucket_id = 'profile-images'
  and storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
  and (split_part(storage.objects.name, '/', 1))::uuid = auth.uid()
);

create policy "storage_profile_images_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-images'
  and storage.objects.name ~ '^[0-9a-fA-F-]{36}/'
  and (split_part(storage.objects.name, '/', 1))::uuid = auth.uid()
);

-- =========================================================
-- Optional views for reports
-- =========================================================

create or replace view public.course_enrollment_counts as
select
  c.id as course_id,
  c.title,
  c.max_capacity,
  count(e.id) filter (where e.status in ('active', 'completed')) as active_enrollments,
  count(e.id) filter (where e.status = 'waitlisted') as waitlisted_enrollments,
  greatest(
    c.max_capacity - count(e.id) filter (where e.status in ('active', 'completed')),
    0
  ) as available_spots
from public.courses c
left join public.enrollments e on e.course_id = c.id
group by c.id, c.title, c.max_capacity;

create or replace view public.sales_report as
select
  p.id as payment_id,
  p.student_id,
  p.status,
  p.method,
  p.total,
  p.issued_at,
  p.paid_at,
  pi.item_type,
  pi.course_id,
  c.title as course_title,
  pi.material_id,
  m.title as material_title,
  pi.quantity,
  pi.unit_price,
  pi.total as item_total
from public.payments p
join public.payment_items pi on pi.payment_id = p.id
left join public.courses c on c.id = pi.course_id
left join public.materials m on m.id = pi.material_id;

-- Security barrier is not needed here because base tables already have RLS.
-- Admin report access should still be queried from admin-only routes.

commit;

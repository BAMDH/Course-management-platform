import { supabase } from '@/services/supabase';

export interface EnrollmentSubmission {
  courseId: string;
  studentId: string;
  price: number;
  courseTitle: string;
  receiptFile: File;
  method: 'sinpe' | 'bank_transfer';
}

export async function submitStudentEnrollment(data: EnrollmentSubmission): Promise<void> {
  const { courseId, studentId, price, courseTitle, receiptFile, method } = data;

  // 1. Upload receipt
  const fileExt = receiptFile.name.split('.').pop();
  const fileName = `${studentId}-${courseId}-${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(fileName, receiptFile);

  if (uploadError) {
    throw new Error(`Failed to upload receipt: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('receipts')
    .getPublicUrl(fileName);

  // 2. Create Payment record (status 'pending')
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      student_id: studentId,
      status: 'pending',
      method: method,
      subtotal: price,
      total: price,
      receipt_image_path: publicUrlData.publicUrl,
      issued_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (paymentError || !payment) {
    throw new Error(`Failed to create payment record: ${paymentError?.message}`);
  }

  // 3. Create Payment Item
  const { error: paymentItemError } = await supabase
    .from('payment_items')
    .insert({
      payment_id: payment.id,
      item_type: 'course',
      course_id: courseId,
      quantity: 1,
      unit_price: price,
      total: price,
      description: `Inscripción - ${courseTitle}`
    });

  if (paymentItemError) {
    throw new Error(`Failed to create payment item: ${paymentItemError.message}`);
  }

}

export async function getStudentEnrolledCourseIds(email: string): Promise<{ enrolledIds: string[], pendingIds: string[] }> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!profile) return { enrolledIds: [], pendingIds: [] };

  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', profile.id);

  const enrolledIds = (!error && enrollments) ? enrollments.map(e => e.course_id) : [];

  const { data: pendingItems, error: pendingError } = await supabase
    .from('payment_items')
    .select('course_id, payments!inner(status, student_id)')
    .eq('payments.student_id', profile.id)
    .eq('payments.status', 'pending');

  const pendingIds = (!pendingError && pendingItems) ? pendingItems.map(p => p.course_id) : [];

  return { enrolledIds, pendingIds };
}

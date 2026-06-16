import { supabase } from '@/services/supabase';

export interface PaymentItem {
  id: string;
  quantity: number;
  unit_price: number;
  total: number;
  description: string;
  courseTitle: string | null;
}

export interface StudentPayment {
  id: string;
  issued_at: string;
  status: 'PAGADO' | 'PENDIENTE' | 'RECHAZADO';
  total: number;
  receipt_image_path: string | null;
  items: PaymentItem[];
}

export const getStudentPayments = async (email: string): Promise<StudentPayment[]> => {
  // First get student profile id using email
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (profileError || !profileData) {
    throw new Error('Error fetching student profile');
  }

  const { data: paymentsData, error: paymentsError } = await supabase
    .from('payments')
    .select(`
      id,
      issued_at,
      status,
      total,
      receipt_image_path
    `)
    .eq('student_id', profileData.id)
    .order('issued_at', { ascending: false });

  if (paymentsError) {
    throw new Error('Error fetching student payments');
  }

  if (!paymentsData || paymentsData.length === 0) {
    return [];
  }

  const paymentIds = paymentsData.map(p => p.id);

  const { data: itemsData, error: itemsError } = await supabase
    .from('payment_items')
    .select(`
      id,
      payment_id,
      quantity,
      unit_price,
      total,
      description,
      courses ( title )
    `)
    .in('payment_id', paymentIds);

  if (itemsError) {
    throw new Error('Error fetching payment items');
  }

  return paymentsData.map(payment => {
    const pItems = itemsData?.filter(item => item.payment_id === payment.id) || [];
    
    return {
      id: payment.id,
      issued_at: payment.issued_at,
      status: payment.status === 'paid' ? 'PAGADO' : payment.status === 'pending' ? 'PENDIENTE' : 'RECHAZADO',
      total: Number(payment.total),
      receipt_image_path: payment.receipt_image_path,
      items: pItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        total: Number(item.total),
        description: item.description,
        courseTitle: (item.courses as any)?.title || null
      }))
    };
  });
};

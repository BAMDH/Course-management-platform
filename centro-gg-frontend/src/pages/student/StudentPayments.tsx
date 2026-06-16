import { useState, useMemo } from 'react';
import { 
  Calendar, 
  Wallet, 
  Eye, 
  Info,
  X,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth/useAuth';
import { getStudentPayments } from '@/services/studentPaymentsService';
import { supabase } from '@/services/supabase';

export default function StudentPayments() {
  const { user } = useAuth();
  const [filterMode, setFilterMode] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['studentPayments', user?.email],
    queryFn: () => getStudentPayments(user?.email || ''),
    enabled: !!user?.email,
  });

  const filteredPayments = useMemo(() => {
    if (!payments) return [];
    if (filterMode === 'all') return payments;
    return payments.filter(p => p.status.toLowerCase() === filterMode.toLowerCase());
  }, [payments, filterMode]);

  const nextPayment = useMemo(() => {
    if (!payments) return null;
    const pending = payments.filter(p => p.status === 'PENDIENTE');
    return pending.length > 0 ? pending[pending.length - 1] : null;
  }, [payments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error cargando el historial de pagos. Intenta de nuevo más tarde.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif] relative">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b]">
          Historial de Compras
        </h1>
        <p className="text-[#5d5e60] text-[15px] mt-2">
          Gestiona tus pagos y facturas de Centro de Capacitación G&G.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Próximo Pago Card */}
        {nextPayment ? (
          <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm flex flex-col justify-between max-w-lg">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#dc2626]" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-[#5d5e60] mb-1">Próximo Pago</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
                    ₡{nextPayment.total.toLocaleString()}
                  </span>
                  <span className="text-[15px] text-[#5d5e60] font-medium">CRC</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 pt-6 border-t border-[#e9e8e7]">
              {nextPayment.items.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <Info className="w-[18px] h-[18px] text-[#5d5e60]" />
                  <span className="text-[14px] text-[#5d5e60]">
                    {item.courseTitle || item.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm flex flex-col justify-between max-w-lg">
             <div className="flex items-start gap-5 mb-8">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-[#5d5e60] mb-1">Próximo Pago</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
                    Al día
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-3xl border border-[#e9e8e7] shadow-sm overflow-hidden">
        {/* Table Header Area */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-[#e9e8e7] bg-[#faf9f9]">
          <h2 className="text-[18px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
            Transacciones Recientes
          </h2>
          <select 
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#5d5e60] font-medium hover:bg-white border border-[#e9e8e7] transition-all bg-white outline-none focus:ring-2 focus:ring-[#dc2626]"
          >
            <option value="all">Todos los estados</option>
            <option value="pagado">Pagados</option>
            <option value="pendiente">Pendientes</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#e9e8e7]">
                <th className="py-5 px-8 text-[11px] font-bold text-[#5d5e60] uppercase tracking-wider">FECHA</th>
                <th className="py-5 px-8 text-[11px] font-bold text-[#5d5e60] uppercase tracking-wider">CONCEPTO</th>
                <th className="py-5 px-8 text-[11px] font-bold text-[#5d5e60] uppercase tracking-wider">MONTO</th>
                <th className="py-5 px-8 text-[11px] font-bold text-[#5d5e60] uppercase tracking-wider">ESTADO</th>
                <th className="py-5 px-8 text-[11px] font-bold text-[#5d5e60] uppercase tracking-wider text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e8e7]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-8 text-center text-[#5d5e60] text-[15px]">
                    No se encontraron transacciones.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-8 whitespace-nowrap">
                      <span className="text-[14px] font-medium text-[#1b1c1b]">
                        {new Date(tx.issued_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      <div className="space-y-1">
                        {tx.items.length === 0 ? (
                           <p className="text-[15px] font-bold text-[#1b1c1b] leading-tight">Factura #{tx.id.slice(0,8)}</p>
                        ) : (
                           tx.items.map(item => (
                             <div key={item.id}>
                                <p className="text-[15px] font-bold text-[#1b1c1b] leading-tight">{item.courseTitle || item.description}</p>
                                <p className="text-[13px] text-[#5d5e60]">{item.description}</p>
                             </div>
                           ))
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-8 whitespace-nowrap">
                      <span className="text-[15px] font-bold text-[#1b1c1b]">₡{tx.total.toLocaleString()}</span>
                    </td>
                    <td className="py-5 px-8 whitespace-nowrap">
                      <div className={clsx(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
                        tx.status === 'PAGADO' ? "bg-[#f0fdf4]" : 
                        tx.status === 'PENDIENTE' ? "bg-[#fffbeb]" : "bg-[#fef2f2]"
                      )}>
                        <div className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          tx.status === 'PAGADO' ? "bg-[#16a34a]" : 
                          tx.status === 'PENDIENTE' ? "bg-[#d97706]" : "bg-[#dc2626]"
                        )} />
                        <span className={clsx(
                          "text-[13px] font-bold",
                          tx.status === 'PAGADO' ? "text-[#16a34a]" : 
                          tx.status === 'PENDIENTE' ? "text-[#d97706]" : "text-[#dc2626]"
                        )}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right whitespace-nowrap">
                      {tx.receipt_image_path ? (
                        <button 
                          onClick={() => setSelectedReceipt(tx.receipt_image_path)}
                          className="p-2 text-[#5d5e60] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-lg transition-colors inline-flex justify-center items-center"
                          title="Ver Recibo"
                        >
                          <Eye className="w-[18px] h-[18px]" />
                        </button>
                      ) : (
                        <span className="text-[13px] text-[#a3a3a3] italic">Sin recibo</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedReceipt(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 pr-10">Comprobante de Pago</h3>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              {selectedReceipt.startsWith('http') ? (
                <img src={selectedReceipt} alt="Comprobante de Pago" className="w-full h-auto object-contain max-h-[70vh]" />
              ) : (
                <img src={supabase.storage.from('receipts').getPublicUrl(selectedReceipt).data.publicUrl} alt="Comprobante de Pago" className="w-full h-auto object-contain max-h-[70vh]" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { 
  Calendar, 
  Wallet, 
  Filter, 
  Download, 
  Info 
} from 'lucide-react';
import clsx from 'clsx';

interface Transaction {
  id: string;
  dateStr: string;
  conceptTitle: string;
  conceptSubtitle: string;
  amount: string;
  status: 'Pagado' | 'Pendiente';
}

const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    dateStr: '12 Oct, 2023',
    conceptTitle: 'Mensualidad Octubre',
    conceptSubtitle: 'Masterclass de Cocina Francesa',
    amount: '$150.00',
    status: 'Pagado'
  },
  {
    id: 'tx-2',
    dateStr: '12 Sep, 2023',
    conceptTitle: 'Matrícula Anual',
    conceptSubtitle: 'Renovación 2023-2024',
    amount: '$250.00',
    status: 'Pagado'
  },
  {
    id: 'tx-3',
    dateStr: '15 Nov, 2023',
    conceptTitle: 'Mensualidad Noviembre',
    conceptSubtitle: 'Curso de Repostería Avanzada',
    amount: '$150.00',
    status: 'Pendiente'
  },
  {
    id: 'tx-4',
    dateStr: '05 Ago, 2023',
    conceptTitle: 'Kit de Cuchillos Pro',
    conceptSubtitle: 'Equipamiento',
    amount: '$350.00',
    status: 'Pagado'
  }
];

export default function StudentPayments() {
  return (
    <div className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Próximo Pago Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-5 mb-8">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#dc2626]" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-[#5d5e60] mb-1">Próximo Pago</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">$150.00</span>
                <span className="text-[15px] text-[#5d5e60] font-medium">USD</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-6 border-t border-[#e9e8e7]">
            <Info className="w-[18px] h-[18px] text-[#5d5e60]" />
            <span className="text-[14px] text-[#5d5e60]">
              Vence el 15 de Noviembre, 2023 (Curso de Repostería Avanzada)
            </span>
          </div>
        </div>

        {/* Total Invertido Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-5 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-[#5d5e60] mb-1">Total Invertido</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">$1,450.00</span>
                <span className="text-[15px] text-[#5d5e60] font-medium">USD</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-[#e9e8e7]">
            <span className="text-[14px] text-[#5d5e60]">
              Desde Enero 2023
            </span>
            <button className="text-[14px] font-bold text-[#dc2626] hover:underline">
              Ver Reporte Anual
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-3xl border border-[#e9e8e7] shadow-sm overflow-hidden">
        {/* Table Header Area */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-[#e9e8e7] bg-[#faf9f9]">
          <h2 className="text-[18px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
            Transacciones Recientes
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#5d5e60] font-medium hover:bg-white border border-transparent hover:border-[#e9e8e7] transition-all">
            <Filter className="w-[18px] h-[18px]" />
            <span className="text-[14px]">Filtrar</span>
          </button>
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
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-5 px-8 whitespace-nowrap">
                    <span className="text-[14px] font-medium text-[#1b1c1b]">{tx.dateStr}</span>
                  </td>
                  <td className="py-5 px-8">
                    <div>
                      <p className="text-[15px] font-bold text-[#1b1c1b] leading-tight mb-1">{tx.conceptTitle}</p>
                      <p className="text-[13px] text-[#5d5e60]">{tx.conceptSubtitle}</p>
                    </div>
                  </td>
                  <td className="py-5 px-8 whitespace-nowrap">
                    <span className="text-[15px] font-bold text-[#1b1c1b]">{tx.amount}</span>
                  </td>
                  <td className="py-5 px-8 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f3f2]">
                      <div className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        tx.status === 'Pagado' ? "bg-[#dc2626]" : "bg-[#a3a3a3]"
                      )} />
                      <span className="text-[13px] font-bold text-[#5d5e60]">
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right whitespace-nowrap">
                    <button className="p-2 text-[#5d5e60] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-lg transition-colors inline-flex justify-center items-center">
                      <Download className="w-[18px] h-[18px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between border-t border-[#e9e8e7] gap-4">
          <span className="text-[14px] text-[#5d5e60] font-medium">
            Mostrando 4 de 12 transacciones
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-[#e9e8e7] text-[14px] font-bold text-[#5d5e60] hover:bg-[#f5f3f2] transition-colors">
              Anterior
            </button>
            <button className="px-4 py-2 rounded-xl border border-[#e9e8e7] text-[14px] font-bold text-[#1b1c1b] hover:bg-[#f5f3f2] transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, PhoneCall, ShieldAlert, HeartPulse, Bus, MapPin } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const contacts = [
    {
      title: 'Kolkata Police Control Room (Lalbazar)',
      number: '100 / 112',
      desc: '24x7 Durga Puja Central Command for security & lost person reporting',
      color: 'text-red-700',
    },
    {
      title: 'Kolkata Traffic Police Puja Helpline',
      number: '1073 / 033-22143644',
      desc: 'Real-time road closures, one-way diversions & parking guidance',
      color: 'text-blue-700',
    },
    {
      title: 'Women & Child Safety (Tejaswini Squad)',
      number: '1091 / 1098',
      desc: 'Special women police patrolling squads stationed across pandals',
      color: 'text-purple-700',
    },
    {
      title: 'Medical Ambulance & Emergency (Govt)',
      number: '102 / 108',
      desc: 'R.G. Kar Medical College (Shyambazar) & Calcutta Medical College',
      color: 'text-emerald-700',
    },
    {
      title: 'Kolkata Metro Rail Helpline',
      number: '139 / 033-22264817',
      desc: 'All-night festival train frequency and token counter status',
      color: 'text-amber-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-700 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif font-black text-base">
                Kolkata Puja Helplines & SOS
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                Official Police, Medical & Metro Assistance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Numbers */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 max-h-[70vh]">
          {contacts.map((c, idx) => (
            <div
              key={idx}
              className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start justify-between gap-2"
            >
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                  {c.title}
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                  {c.desc}
                </p>
              </div>
              <a
                href={`tel:${c.number.split('/')[0].trim()}`}
                className={`flex-shrink-0 flex items-center gap-1 font-extrabold text-xs py-1.5 px-2.5 rounded-lg bg-white border shadow-sm hover:bg-stone-100 transition-colors ${c.color}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{c.number}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

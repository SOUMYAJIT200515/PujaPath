import React, { useState } from 'react';
import { Pandal, CrowdLevel, CrowdReport } from '../types';
import { X, Flame, Clock, MessageSquare, ShieldCheck, Check } from 'lucide-react';

interface CrowdReportModalProps {
  pandal: Pandal | null;
  onClose: () => void;
  onSubmitReport: (report: Partial<CrowdReport>) => void;
}

export const CrowdReportModal: React.FC<CrowdReportModalProps> = ({
  pandal,
  onClose,
  onSubmitReport,
}) => {
  if (!pandal) return null;

  const [level, setLevel] = useState<CrowdLevel>('moderate');
  const [waitTime, setWaitTime] = useState<number>(25);
  const [reporterName, setReporterName] = useState<string>('Pandal Hopper');
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      pandalId: pandal.id,
      pandalName: pandal.name,
      crowdLevel: level,
      waitTimeMinutes: waitTime,
      reporterName: reporterName.trim() || 'Fellow Hopper',
      comment: comment.trim(),
      timestamp: Date.now(),
      source: 'community',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-700 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif font-black text-base">
                Report Live Queue & Crowd
              </h3>
              <p className="text-xs text-amber-200/90 truncate max-w-[240px]">
                {pandal.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">
              Report Submitted!
            </h4>
            <p className="text-xs text-stone-600">
              Thank you for helping fellow devotees avoid congestion.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Disclaimer on Data Integrity */}
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p>
                Community reports expire after 45 minutes to maintain high
                accuracy during changing festival times.
              </p>
            </div>

            {/* Crowd Level Selector */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Observed Crowd Density
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'low' as const,
                    label: 'Low (< 15 mins)',
                    color: 'peer-checked:bg-emerald-600 peer-checked:text-white',
                  },
                  {
                    id: 'moderate' as const,
                    label: 'Moderate (15-35 mins)',
                    color: 'peer-checked:bg-amber-600 peer-checked:text-white',
                  },
                  {
                    id: 'high' as const,
                    label: 'High (35-60 mins)',
                    color: 'peer-checked:bg-orange-600 peer-checked:text-white',
                  },
                  {
                    id: 'very_high' as const,
                    label: 'Very High (> 60 mins)',
                    color: 'peer-checked:bg-rose-700 peer-checked:text-white',
                  },
                ].map((item) => (
                  <label key={item.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="crowdLevel"
                      value={item.id}
                      checked={level === item.id}
                      onChange={() => setLevel(item.id)}
                      className="sr-only peer"
                    />
                    <div
                      className={`p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs font-semibold text-center transition-all ${item.color}`}
                    >
                      {item.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Wait Time Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1">
                <span>Estimated Wait Time</span>
                <span className="text-red-700">{waitTime} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={waitTime}
                onChange={(e) => setWaitTime(Number(e.target.value))}
                className="w-full accent-red-700"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Field Conditions (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. VIP line moving fast, light rain, entry diverted via alley..."
                rows={2}
                maxLength={200}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:border-red-600 resize-none"
              />
            </div>

            {/* Reporter Name */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Your Nickname
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Rahul, Sayantani"
                maxLength={30}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Post Crowd Update
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

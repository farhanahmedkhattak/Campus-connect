import React from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle2 } from 'lucide-react';

export default function EventsView({ events }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0e1422] to-cyan-950/30 border border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h2 className="text-base font-bold text-white">Campus Events & Symposia</h2>
        </div>
        <p className="text-xs text-slate-400">
          Official departmental competitions, workshops, and society festivals at Air University Kamra.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="rounded-2xl bg-[#0e1422] border border-white/5 overflow-hidden hover:border-white/10 transition-all flex flex-col md:flex-row"
          >
            {ev.bannerUrl && (
              <div className="md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
                <img
                  src={ev.bannerUrl}
                  alt={ev.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {ev.society}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {ev.department}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {ev.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {ev.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {ev.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {ev.venue}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">
                    {ev.registeredCount} students attending
                  </span>
                  <button
                    onClick={() => alert(`Registered for ${ev.title}!`)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-md shadow-blue-600/20"
                  >
                    RSVP Attend
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

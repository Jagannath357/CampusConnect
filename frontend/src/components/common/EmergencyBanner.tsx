import React from 'react';
import { AlertTriangle, Bell, X, ShieldAlert } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button } from '../ui/button';

export const EmergencyBanner: React.FC = () => {
  const {
    emergencyAlert,
    isEmergencyOverlayOpen,
    dismissEmergencyOverlay,
  } = useNotifications();

  if (!emergencyAlert || !emergencyAlert.active) return null;

  return (
    <>
      {/* High-Priority Top Persistent Warning Banner */}
      <div className="bg-rose-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-md flex items-center justify-between w-full border-b border-rose-700/50">
        <div className="flex items-center space-x-2 sm:space-x-3 max-w-7xl mx-auto w-full">
          <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-amber-300"></span>
          </span>
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-amber-300" />
            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-rose-800 px-1.5 sm:px-2 py-0.5 rounded text-amber-200">
              CAMPUS EMERGENCY ALERT
            </span>
          </div>
          <div className="text-xs sm:text-sm font-medium truncate flex-1 min-w-0">
            <strong>{emergencyAlert.title}:</strong> {emergencyAlert.message}
          </div>
        </div>
      </div>

      {/* High-Priority Instant Overlay Modal (triggers automatically on socket broadcast) */}
      {isEmergencyOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-4 border-rose-500 overflow-hidden transform scale-100 animate-in zoom-in-95">
            <div className="bg-rose-600 text-white p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-rose-700 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-amber-300 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-widest text-amber-200 uppercase bg-rose-800/80 px-2 py-0.5 rounded">
                      CRITICAL UNIVERSITY BROADCAST
                    </span>
                    <h2 className="text-xl font-extrabold mt-1">{emergencyAlert.title}</h2>
                  </div>
                </div>
                <button
                  onClick={dismissEmergencyOverlay}
                  className="rounded-lg p-1.5 text-rose-200 hover:text-white hover:bg-rose-700/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 rounded-xl p-4 text-slate-800 dark:text-rose-100 text-sm leading-relaxed">
                {emergencyAlert.message}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Issued by Silicon University Administration</span>
                <span>{new Date(emergencyAlert.broadcastAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="danger" className="w-full sm:w-auto" onClick={dismissEmergencyOverlay}>
                  Acknowledge & Dismiss Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


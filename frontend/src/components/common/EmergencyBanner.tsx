import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, X, ShieldAlert, Info } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

export const EmergencyBanner: React.FC = () => {
  const {
    emergencyAlert,
    isEmergencyOverlayOpen,
    dismissEmergencyOverlay,
  } = useNotifications();
  const { user } = useAuth();

  if (!emergencyAlert || !emergencyAlert.active) return null;

  const isCritical = emergencyAlert.isCritical !== false;
  const targetNotificationRoute = user?.role === 'ADMIN' ? '/admin/notifications' : '/notifications';

  return (
    <>
      {/* High-Priority Top Persistent Warning Banner */}
      <div
        className={cn(
          'px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-md flex items-center justify-between w-full border-b transition-colors',
          isCritical
            ? 'bg-red-600 text-white border-red-700/60'
            : 'bg-amber-400 text-slate-950 border-amber-500'
        )}
      >
        <div className="flex items-center space-x-1.5 sm:space-x-3 max-w-7xl mx-auto w-full min-w-0">
          <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative flex-shrink-0">
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                isCritical ? 'bg-white' : 'bg-slate-950'
              )}
            ></span>
            <span
              className={cn(
                'relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5',
                isCritical ? 'bg-amber-300' : 'bg-amber-600'
              )}
            ></span>
          </span>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {isCritical ? (
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-amber-300" />
            ) : (
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-slate-950" />
            )}
            <span
              className={cn(
                'font-black text-[9px] sm:text-xs uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded shadow-xs',
                isCritical
                  ? 'bg-red-950 text-red-100 border border-red-500/50'
                  : 'bg-slate-950 text-amber-300 border border-slate-900'
              )}
            >
              {isCritical ? (
                <>
                  <span className="hidden sm:inline">CAMPUS CRITICAL ALERT</span>
                  <span className="sm:hidden">CRITICAL</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">CAMPUS ADVISORY</span>
                  <span className="sm:hidden">ADVISORY</span>
                </>
              )}
            </span>
          </div>
          <div
            className={cn(
              'text-[11px] sm:text-sm font-medium truncate flex-1 min-w-0',
              isCritical ? 'text-white' : 'text-slate-950 font-semibold'
            )}
          >
            <strong className="font-black">{emergencyAlert.title}:</strong> {emergencyAlert.message}
          </div>
          <Link
            to={targetNotificationRoute}
            className={cn(
              'text-[10px] sm:text-xs font-bold underline whitespace-nowrap ml-1 sm:ml-2 flex-shrink-0 transition-colors',
              isCritical
                ? 'text-amber-200 hover:text-white'
                : 'text-slate-950 hover:text-black font-extrabold'
            )}
          >
            <span className="hidden sm:inline">All Alerts & Details &rarr;</span>
            <span className="sm:hidden">Details &rarr;</span>
          </Link>
        </div>
      </div>

      {/* High-Priority Instant Overlay Modal (triggers automatically on socket broadcast) */}
      {isEmergencyOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={cn(
              'relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-4 overflow-hidden transform scale-100 animate-in zoom-in-95',
              isCritical ? 'border-red-500' : 'border-amber-400'
            )}
          >
            <div
              className={cn(
                'p-6 pb-4 flex-shrink-0',
                isCritical ? 'bg-red-600 text-white' : 'bg-amber-400 text-slate-950'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'p-2.5 rounded-xl',
                      isCritical ? 'bg-red-700' : 'bg-amber-500'
                    )}
                  >
                    <AlertTriangle
                      className={cn(
                        'w-8 h-8 animate-bounce',
                        isCritical ? 'text-amber-300' : 'text-slate-950'
                      )}
                    />
                  </div>
                  <div>
                    <span
                      className={cn(
                        'text-xs font-black tracking-widest uppercase px-2 py-0.5 rounded shadow-xs',
                        isCritical ? 'text-red-100 bg-red-950' : 'text-amber-300 bg-slate-950'
                      )}
                    >
                      {isCritical ? 'CRITICAL UNIVERSITY BROADCAST' : 'CAMPUS ADVISORY BROADCAST'}
                    </span>
                    <h2 className="text-xl font-black mt-1 leading-snug">{emergencyAlert.title}</h2>
                  </div>
                </div>
                <button
                  onClick={dismissEmergencyOverlay}
                  className={cn(
                    'rounded-lg p-1.5 transition-colors',
                    isCritical
                      ? 'text-red-100 hover:text-white hover:bg-red-700/60'
                      : 'text-slate-900 hover:text-black hover:bg-amber-500/60'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div
                className={cn(
                  'border rounded-xl p-4 text-sm leading-relaxed',
                  isCritical
                    ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900/80 text-slate-800 dark:text-red-100'
                    : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/80 text-slate-900 dark:text-amber-100'
                )}
              >
                {emergencyAlert.message}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Issued by Silicon University Administration</span>
                <span>{new Date(emergencyAlert.broadcastAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant={isCritical ? 'danger' : 'primary'}
                  className={cn(
                    'w-full sm:w-auto font-black',
                    !isCritical && 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600'
                  )}
                  onClick={dismissEmergencyOverlay}
                >
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


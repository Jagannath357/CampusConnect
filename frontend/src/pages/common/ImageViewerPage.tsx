import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ExternalLink,
  ImageIcon,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { getFileUrl } from '../../utils/url';
import { useAuth } from '../../contexts/AuthContext';

export const ImageViewerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const rawUrl = searchParams.get('url') || '';
  const title = searchParams.get('title') || 'Uploaded Media Preview';
  const source = searchParams.get('source') || 'CampusConnect Media';
  const backUrl = searchParams.get('backUrl') || '';

  const imageUrl = getFileUrl(rawUrl);
  const isPdf =
    rawUrl.toLowerCase().includes('.pdf') ||
    imageUrl.toLowerCase().includes('.pdf') ||
    title.toLowerCase().endsWith('.pdf');

  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, +(prev - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = title.replace(/\s+/g, '_') + '.jpg';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Top Header Bar with prominent BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="font-bold flex items-center space-x-1.5 border-slate-300 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-100 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400" />
            <span>Back</span>
          </Button>

          <div className="border-l border-slate-200 dark:border-slate-800 h-6 mx-1 hidden sm:block" />

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {source}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                Media Viewer
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate max-w-sm sm:max-w-lg mt-0.5">
              {title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          {!isPdf && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                title="Zoom In"
                className="p-2"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                title="Zoom Out"
                className="p-2"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                title="Rotate Clockwise"
                className="p-2"
              >
                <RotateCw className="w-4 h-4" />
              </Button>

              {(zoom !== 1 || rotation !== 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetZoom}
                  className="text-xs font-semibold px-2.5"
                >
                  Reset
                </Button>
              )}
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            title="Download / Open Original File"
            className="font-bold text-xs flex items-center space-x-1"
          >
            <Download className="w-4 h-4 mr-1 text-slate-600 dark:text-slate-300" />
            <span className="hidden sm:inline">Download</span>
          </Button>

          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Open In Raw New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Image or PDF Display Canvas */}
      <Card className="border-slate-200/90 dark:border-slate-800 overflow-hidden bg-slate-950 shadow-xl">
        <CardContent className="p-0">
          <div className="relative min-h-[50vh] sm:min-h-[65vh] max-h-[85vh] flex items-center justify-center overflow-auto p-2 sm:p-4 bg-dot-grid">
            {isPdf && imageUrl ? (
              <div className="w-full h-[65vh] sm:h-[75vh] flex flex-col items-center justify-center">
                <object
                  data={imageUrl}
                  type="application/pdf"
                  className="w-full h-full rounded-xl border border-slate-800 bg-white"
                >
                  <iframe
                    src={imageUrl}
                    title={title}
                    className="w-full h-full rounded-xl border border-slate-800 bg-white"
                  >
                    <div className="text-center p-8 text-white space-y-3">
                      <p className="text-sm">Unable to render inline PDF in this browser preview.</p>
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-bold text-indigo-400 underline"
                      >
                        Open or Download PDF <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </iframe>
                </object>
              </div>
            ) : imageError || !imageUrl ? (
              <div className="text-center p-12 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-200">Unable to Display Image</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  The requested media asset URL could not be retrieved or is in an unsupported format.
                </p>
                {imageUrl && (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs font-bold text-indigo-400 underline pt-2"
                  >
                    Attempt Direct Link Download <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center transition-transform duration-200">
                <img
                  src={imageUrl}
                  alt={title}
                  onError={() => setImageError(true)}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                  className="max-h-[60vh] sm:max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-200 select-none border border-slate-800"
                />
              </div>
            )}

            {/* Bottom floating zoom indicator for images */}
            {!isPdf && !imageError && imageUrl && (
              <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-xs text-slate-300 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-800 shadow-md">
                {Math.round(zoom * 100)}% {rotation !== 0 && `• ${rotation}°`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Info & Return Callout Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Media Asset • Silicon University</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {title} ({source})
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleBack}
          className="font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Return to Previous Page</span>
        </Button>
      </div>
    </div>
  );
};
export default ImageViewerPage;


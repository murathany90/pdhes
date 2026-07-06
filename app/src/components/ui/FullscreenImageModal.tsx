import { useEffect, useState } from 'react';

interface FullscreenImageModalProps {
  isOpen: boolean;
  src: string;
  title: string;
  onClose: () => void;
}

export default function FullscreenImageModal({ isOpen, src, title, onClose }: FullscreenImageModalProps) {
  const [zoom, setZoom] = useState(1);

  // Reset zoom when modal opens or src changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
    }
  }, [isOpen, src]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(3, prev + 0.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.2));

  const handleNativeFullscreen = () => {
    const el = document.getElementById('imageModal');
    if (el?.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  return (
    <div className="modal open" id="imageModal" aria-hidden={!isOpen}>
      <div className="modal-bar">
        <div className="modal-title">{title || 'Görsel'}</div>
        <div className="modal-actions">
          <button type="button" onClick={handleZoomOut} title="Uzaklaştır">
            −
          </button>
          <button type="button" onClick={handleZoomIn} title="Yakınlaştır">
            +
          </button>
          <button type="button" onClick={handleNativeFullscreen}>
            Tarayıcı tam ekran
          </button>
          <button type="button" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
      <div className="modal-body">
        <img
          src={src}
          alt={title || 'Tam ekran görsel'}
          style={{ transform: `scale(${zoom})` }}
        />
      </div>
    </div>
  );
}

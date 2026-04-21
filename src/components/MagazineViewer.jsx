import React, { useState, useRef, useEffect, forwardRef, useLayoutEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import { BookOpen, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageCover = forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

const PDFPage = forwardRef(({ pageNumber }, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <Page 
          pageNumber={pageNumber} 
          width={800} 
          renderTextLayer={false} 
          renderAnnotationLayer={false} 
        />
      </div>
    </div>
  );
});

export default function MagazineViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(null);
  const [bookDimensions, setBookDimensions] = useState({ width: 0, height: 0 });
  const flipBookRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (wrapperRef.current) {
        // Tomamos el 95% del tamaño para dejar un margen respirable automáticamente
        const W = wrapperRef.current.clientWidth * 0.95;
        const H = wrapperRef.current.clientHeight * 0.95;
        
        let bookW, bookH;
        // La proporción de 2 páginas A4 juntas es 1.414 (ancho/alto)
        const bookRatio = 1.414;
        const containerRatio = W / H;
        
        if (containerRatio > bookRatio) {
          // La pantalla es más ancha que el libro. La altura es el límite.
          bookH = H;
          bookW = H * bookRatio;
        } else {
          // La pantalla es más alta que el libro. El ancho es el límite.
          bookW = W;
          bookH = W / bookRatio;
        }
        
        setBookDimensions({
          width: Math.floor(bookW / 2), // react-pageflip necesita el ancho de UNA sola página
          height: Math.floor(bookH)
        });
      }
    };

    // Darle un pequeño retraso a la primera medición para que el DOM se asiente
    setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (err) => {
    setError(err.message);
  };

  const nextButtonClick = () => {
    flipBookRef.current?.pageFlip()?.flipNext();
  };

  const prevButtonClick = () => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  };

  const onPage = (e) => {
    setPageNumber(e.data);
  };

  return (
    <div className="magazine-viewer-container" ref={containerRef}>
      <header className="magazine-header">
        <div className="header-title">
          <BookOpen className="icon" />
          <h2>Visor de Revista F1</h2>
        </div>
        
        <div className="magazine-controls">
          <button className="btn btn-secondary" onClick={toggleFullscreen} title="Pantalla Completa">
            <Maximize size={18} />
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.25rem' }}></div>
          <button className="btn btn-secondary" onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}>
            <ZoomOut size={18} />
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button className="btn btn-secondary" onClick={() => setZoom(Math.min(2, zoom + 0.2))}>
            <ZoomIn size={18} />
          </button>
        </div>
      </header>

      <div className="magazine-content">
        {error ? (
          <div className="error-state">
            <p>Error cargando el PDF: {error}</p>
            <p className="text-muted">Asegúrate de que el archivo coleccion_F1.pdf existe en la carpeta public.</p>
          </div>
        ) : (
          <div className="flipbook-wrapper" ref={wrapperRef} style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
            <Document
              file={`${import.meta.env.BASE_URL}coleccion_F1.pdf`}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="loading-state">Cargando revista...</div>}
            >
              {numPages && bookDimensions.width > 0 && (
                <HTMLFlipBook
                  width={bookDimensions.width}
                  height={bookDimensions.height}
                  size="fixed"
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  onFlip={onPage}
                  ref={flipBookRef}
                  className="flipbook"
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <PDFPage key={`page_${index + 1}`} pageNumber={index + 1} />
                  ))}
                </HTMLFlipBook>
              )}
            </Document>
          </div>
        )}
      </div>

      <footer className="magazine-footer">
        <button className="btn btn-secondary" onClick={prevButtonClick} disabled={pageNumber === 0}>
          <ChevronLeft size={18} /> Anterior
        </button>
        
        <div className="page-indicator">
          Página {pageNumber} de {numPages || '--'}
        </div>
        
        <button className="btn btn-secondary" onClick={nextButtonClick} disabled={pageNumber >= (numPages || 0)}>
          Siguiente <ChevronRight size={18} />
        </button>
      </footer>
    </div>
  );
}

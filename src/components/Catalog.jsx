import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, Trophy, Flag, Car, Calendar, User, Gauge, Wrench, 
  X, Award, Eye, Sparkles, ZoomIn
} from 'lucide-react';

const TEAM_COLORS = {
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  williams: '#00A0DD',
  'red bull': '#1E41FF',
  mercedes: '#00D2BE',
  alpine: '#0090FF',
  renault: '#FFF500',
  lotus: '#D4AF37',
  'alfa romeo': '#900000',
  'aston martin': '#006F62',
  'toro rosso': '#469BFF',
  jordan: '#E5C000',
  benetton: '#00A859',
  tyrrell: '#003399',
  bar: '#D4AF37',
  shadow: '#111111',
  stewart: '#FFFFFF'
};

const getTeamColor = (teamName, fallbackColor) => {
  if (!teamName) return 'var(--accent-primary)';
  const lower = teamName.toLowerCase();
  for (const [key, hex] of Object.entries(TEAM_COLORS)) {
    if (lower.includes(key)) return hex;
  }
  return fallbackColor && fallbackColor !== '-' ? fallbackColor : 'var(--accent-primary)';
};

export default function Catalog({ collection = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [onlyChampions, setOnlyChampions] = useState(false);
  const [sortBy, setSortBy] = useState('year-desc');
  const [selectedCar, setSelectedCar] = useState(null);
  const [zoomedImg, setZoomedImg] = useState(null); // { url, title }

  const modalBodyRef = useRef(null);

  // Extract unique teams
  const teams = useMemo(() => {
    const set = new Set();
    collection.forEach(c => {
      if (c.Escuderia && c.Escuderia !== '-') set.add(c.Escuderia);
    });
    return Array.from(set).sort();
  }, [collection]);

  // Overall collection stats
  const stats = useMemo(() => {
    const total = collection.length;
    const years = collection.map(c => parseInt(c.Anio)).filter(Boolean);
    const minYear = years.length ? Math.min(...years) : 1950;
    const maxYear = years.length ? Math.max(...years) : 2025;
    const wins = collection.reduce((acc, c) => acc + (parseInt(c.Pil_Victorias) || 0), 0);
    const champions = collection.filter(c => c.is_champion).length;
    return { total, minYear, maxYear, wins, champions, teamsCount: teams.length };
  }, [collection, teams]);

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    return collection.filter(car => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchModel = car.Modelo?.toLowerCase().includes(query);
        const matchDriver = car.Piloto?.toLowerCase().includes(query);
        const matchTeam = car.Escuderia?.toLowerCase().includes(query);
        const matchEngine = car.Motor?.toLowerCase().includes(query);
        const matchDesigner = car.Diseñador?.toLowerCase().includes(query);
        const matchYear = String(car.Anio).includes(query);
        if (!matchModel && !matchDriver && !matchTeam && !matchEngine && !matchDesigner && !matchYear) {
          return false;
        }
      }

      // Era
      if (selectedEra !== 'all' && car.era !== selectedEra) {
        return false;
      }

      // Team
      if (selectedTeam !== 'all' && car.Escuderia !== selectedTeam) {
        return false;
      }

      // Champions
      if (onlyChampions && !car.is_champion) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'year-desc') return (parseInt(b.Anio) || 0) - (parseInt(a.Anio) || 0);
      if (sortBy === 'year-asc') return (parseInt(a.Anio) || 0) - (parseInt(b.Anio) || 0);
      if (sortBy === 'wins-desc') return (parseInt(b.Pil_Victorias) || 0) - (parseInt(a.Pil_Victorias) || 0);
      if (sortBy === 'model-asc') return (a.Modelo || '').localeCompare(b.Modelo || '');
      return 0;
    });
  }, [collection, searchTerm, selectedEra, selectedTeam, onlyChampions, sortBy]);

  // Lock background scrolling and handle Escape key
  useEffect(() => {
    if (selectedCar || zoomedImg) {
      document.body.style.overflow = 'hidden';
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomedImg) setZoomedImg(null);
        else closeCarModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCar, zoomedImg]);

  const openCarModal = (car) => {
    setSelectedCar(car);
  };

  const closeCarModal = () => {
    setSelectedCar(null);
    setZoomedImg(null);
  };

  const getImagePath = (relPath) => {
    if (!relPath) return null;
    const base = import.meta.env.BASE_URL.endsWith('/') 
      ? import.meta.env.BASE_URL 
      : `${import.meta.env.BASE_URL}/`;
    const cleanRel = relPath.startsWith('/') ? relPath.slice(1) : relPath;
    return `${base}${cleanRel}`;
  };

  return (
    <div className="catalog-container animate-fade-in">
      {/* Hero Overview */}
      <section className="catalog-hero">
        <div className="hero-content">
          <div className="hero-tag">
            <Sparkles size={14} /> COLECCIÓN F1 A ESCALA 1:43
          </div>
          <h1>Catálogo de Leyendas de Fórmula 1</h1>
          <p className="hero-subtitle">
            Explora {stats.total} réplicas a escala que documentan la historia, ingeniería y hazañas 
            de los monoplazas más icónicos del automovilismo mundial ({stats.minYear} — {stats.maxYear}).
          </p>

          <div className="hero-stats-bar">
            <div className="stat-box">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-lbl">Monoplazas</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-num">{stats.teamsCount}</span>
              <span className="stat-lbl">Escuderías</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-num">{stats.champions}</span>
              <span className="stat-lbl">Campeones</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-num">{stats.wins}</span>
              <span className="stat-lbl">Victorias</span>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Filters, Search, Sort */}
      <div className="catalog-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Buscar por auto, piloto, escudería, motor, año..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Eras filter pills */}
        <div className="era-filter-pills">
          <button 
            className={`pill-btn ${selectedEra === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedEra('all')}
          >
            Todas las Eras ({collection.length})
          </button>
          <button 
            className={`pill-btn ${selectedEra === 'classic' ? 'active' : ''}`}
            onClick={() => setSelectedEra('classic')}
          >
            Clásicos (50-70s)
          </button>
          <button 
            className={`pill-btn ${selectedEra === 'turbo' ? 'active' : ''}`}
            onClick={() => setSelectedEra('turbo')}
          >
            Turbo & Suelo (80-90s)
          </button>
          <button 
            className={`pill-btn ${selectedEra === 'v10v8' ? 'active' : ''}`}
            onClick={() => setSelectedEra('v10v8')}
          >
            V10 / V8 (2000-2013)
          </button>
          <button 
            className={`pill-btn ${selectedEra === 'hybrid' ? 'active' : ''}`}
            onClick={() => setSelectedEra('hybrid')}
          >
            Híbridos (2014-Pres.)
          </button>
        </div>

        {/* Secondary filters row */}
        <div className="secondary-filters-row">
          <div className="filter-group">
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="select-custom"
            >
              <option value="all">Todas las Escuderías ({teams.length})</option>
              {teams.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="select-custom"
            >
              <option value="year-desc">Año: Más reciente primero</option>
              <option value="year-asc">Año: Más antiguo primero</option>
              <option value="wins-desc">Más Victorias de Piloto</option>
              <option value="model-asc">Modelo (A - Z)</option>
            </select>
          </div>

          <button 
            className={`btn-toggle-champions ${onlyChampions ? 'active' : ''}`}
            onClick={() => setOnlyChampions(!onlyChampions)}
          >
            <Trophy size={16} /> Solo Campeones
          </button>

          <span className="results-counter">
            Mostrando <strong>{filteredCars.length}</strong> de {collection.length}
          </span>
        </div>
      </div>

      {/* Grid of Cars */}
      {filteredCars.length === 0 ? (
        <div className="no-results-card">
          <Car size={48} className="text-muted" />
          <h3>No se encontraron monoplazas</h3>
          <p>Prueba ajustando los términos de búsqueda o eliminando los filtros seleccionados.</p>
          <button 
            className="btn btn-secondary" 
            onClick={() => { setSearchTerm(''); setSelectedEra('all'); setSelectedTeam('all'); setOnlyChampions(false); }}
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="showroom-grid">
          {filteredCars.map((car) => {
            const teamColor = getTeamColor(car.Escuderia, car.Color_Fondo);
            const modelImg = getImagePath(car.img_model);
            const driverImg = getImagePath(car.img_driver);

            return (
              <div 
                key={car.id} 
                className="showroom-card" 
                onClick={() => openCarModal(car)}
                style={{ '--team-color': teamColor }}
              >
                {/* Top Image Container */}
                <div className="card-media-wrapper">
                  {modelImg ? (
                    <img 
                      src={modelImg} 
                      alt={`${car.Modelo} Réplica`} 
                      className="card-image"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <Car size={48} />
                    </div>
                  )}

                  <div className="card-top-badges">
                    <span className="year-badge">
                      <Calendar size={12} /> {car.Anio}
                    </span>
                    {car.is_champion && (
                      <span className="champion-badge" title="Auto o Piloto Campeón del Mundo">
                        <Trophy size={12} /> Campeón
                      </span>
                    )}
                  </div>

                  <div className="media-overlay">
                    <span className="view-detail-hint">
                      <Eye size={14} /> Ver Ficha y Fotos
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <div className="card-team-tag" style={{ color: teamColor }}>
                    <span className="team-dot" style={{ backgroundColor: teamColor }}></span>
                    {car.Escuderia}
                  </div>

                  <h3 className="card-title">{car.Modelo}</h3>

                  <div className="card-driver-row">
                    {driverImg ? (
                      <img 
                        src={driverImg} 
                        alt={car.Piloto} 
                        className="card-driver-avatar"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <User size={14} className="driver-icon" />
                    )}
                    <span className="card-driver-name">{car.Piloto}</span>
                  </div>

                  <div className="card-specs-mini">
                    <div className="spec-mini-item" title="Motor">
                      <Gauge size={13} />
                      <span className="truncate">{car.Motor}</span>
                    </div>
                  </div>

                  {/* Card Footer / Stats */}
                  <div className="card-footer-stats">
                    <div className="stat-pill" title="Victorias del Piloto">
                      <Trophy size={13} color="gold" />
                      <span>{car.Pil_Victorias !== '-' ? car.Pil_Victorias : 0} Vic</span>
                    </div>
                    <div className="stat-pill" title="Podios del Piloto">
                      <Award size={13} color="#00d26a" />
                      <span>{car.Pil_Podios !== '-' ? car.Pil_Podios : 0} Pod</span>
                    </div>
                    <div className="stat-pill position-pill" title="Posición Final Campeonato Piloto">
                      <span>Pos: {car.Pil_Pos !== '-' ? car.Pil_Pos : '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED CAR MODAL (Rendered with React Portal right at body root) */}
      {selectedCar && createPortal(
        <div className="modal-backdrop" onClick={closeCarModal}>
          <div className="modal-dialog animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeCarModal} title="Cerrar (Esc)">
              <X size={20} />
            </button>

            {/* Modal Header (Fixed at top of dialog) */}
            <div className="modal-header">
              <div className="modal-header-top">
                <span 
                  className="modal-team-badge" 
                  style={{ 
                    borderColor: getTeamColor(selectedCar.Escuderia, selectedCar.Color_Fondo),
                    color: getTeamColor(selectedCar.Escuderia, selectedCar.Color_Fondo)
                  }}
                >
                  {selectedCar.Escuderia}
                </span>
                <span className="modal-year-badge">
                  {selectedCar.Anio}
                </span>
                {selectedCar.is_champion && (
                  <span className="modal-champion-badge">
                    <Trophy size={14} /> Campeón Mundial
                  </span>
                )}
                <span className="modal-era-badge">{selectedCar.era_label}</span>
              </div>
              <h2 className="modal-title">{selectedCar.Modelo}</h2>
              <div className="modal-driver-subtitle">
                <User size={18} /> Piloto Oficial: <strong>{selectedCar.Piloto}</strong>
              </div>
            </div>

            {/* Modal Body (Scrolls inside dialog) */}
            <div className="modal-body" ref={modalBodyRef}>
              
              {/* TRILOGÍA FOTOGRÁFICA: Las 3 fotos mostradas juntas simultáneamente */}
              <div className="triptych-section">
                <div className="section-title-sm">
                  <Eye size={16} /> Galería de la Ficha (Réplica, Auto Real y Piloto)
                </div>

                <div className="triptych-grid">
                  {/* 1. Foto Réplica a Escala */}
                  <div 
                    className="triptych-card" 
                    onClick={() => setZoomedImg({ 
                      url: getImagePath(selectedCar.img_model), 
                      title: `Réplica a Escala 1:43 — ${selectedCar.Modelo}` 
                    })}
                  >
                    <div className="triptych-badge">
                      <Car size={13} color="var(--accent-primary)" />
                      <span>Réplica a Escala (1:43)</span>
                    </div>
                    <div className="triptych-img-wrap">
                      {selectedCar.img_model ? (
                        <img 
                          src={getImagePath(selectedCar.img_model)} 
                          alt="Maqueta a escala"
                          className="triptych-img"
                        />
                      ) : (
                        <div className="no-photo-placeholder">Foto de maqueta no disponible</div>
                      )}
                      <div className="triptych-zoom-hint">
                        <ZoomIn size={14} /> Ampliar
                      </div>
                    </div>
                    <div className="triptych-caption">Colección Andy Hansen</div>
                  </div>

                  {/* 2. Foto Auto Real */}
                  <div 
                    className="triptych-card" 
                    onClick={() => setZoomedImg({ 
                      url: getImagePath(selectedCar.img_real), 
                      title: `Monoplaza Real en Pista (${selectedCar.Anio}) — ${selectedCar.Modelo}` 
                    })}
                  >
                    <div className="triptych-badge">
                      <Flag size={13} color="#00d26a" />
                      <span>Monoplaza Real en Pista</span>
                    </div>
                    <div className="triptych-img-wrap">
                      {selectedCar.img_real ? (
                        <img 
                          src={getImagePath(selectedCar.img_real)} 
                          alt="Auto real en pista"
                          className="triptych-img"
                        />
                      ) : (
                        <div className="no-photo-placeholder">Foto de pista no disponible</div>
                      )}
                      <div className="triptych-zoom-hint">
                        <ZoomIn size={14} /> Ampliar
                      </div>
                    </div>
                    <div className="triptych-caption">Temporada F1 {selectedCar.Anio}</div>
                  </div>

                  {/* 3. Foto Piloto */}
                  <div 
                    className="triptych-card" 
                    onClick={() => setZoomedImg({ 
                      url: getImagePath(selectedCar.img_driver), 
                      title: `Piloto Oficial — ${selectedCar.Piloto} (${selectedCar.Anio})` 
                    })}
                  >
                    <div className="triptych-badge">
                      <User size={13} color="var(--accent-secondary)" />
                      <span>Piloto Oficial</span>
                    </div>
                    <div className="triptych-img-wrap">
                      {selectedCar.img_driver ? (
                        <img 
                          src={getImagePath(selectedCar.img_driver)} 
                          alt={selectedCar.Piloto}
                          className="triptych-img pilot-portrait"
                        />
                      ) : (
                        <div className="no-photo-placeholder">Foto del piloto no disponible</div>
                      )}
                      <div className="triptych-zoom-hint">
                        <ZoomIn size={14} /> Ampliar
                      </div>
                    </div>
                    <div className="triptych-caption">{selectedCar.Piloto}</div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid: Narratives & Specs */}
              <div className="modal-narratives-grid">
                <div className="narrative-card">
                  <div className="narrative-heading">
                    <Car size={16} color="var(--accent-primary)" />
                    <h4>Sobre el Automóvil</h4>
                  </div>
                  <p>{selectedCar.Historia_Auto}</p>
                </div>

                <div className="narrative-card">
                  <div className="narrative-heading">
                    <User size={16} color="var(--accent-secondary)" />
                    <h4>El Piloto: {selectedCar.Piloto}</h4>
                  </div>
                  <p>{selectedCar.Historia_Piloto}</p>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="specs-section">
                <div className="section-title-sm">
                  <Wrench size={16} /> Especificaciones Técnicas
                </div>
                <div className="specs-grid">
                  <div className="spec-card">
                    <span className="spec-label">Motor</span>
                    <span className="spec-value">{selectedCar.Motor || '-'}</span>
                  </div>
                  <div className="spec-card">
                    <span className="spec-label">Transmisión</span>
                    <span className="spec-value">{selectedCar.Caja || '-'}</span>
                  </div>
                  <div className="spec-card">
                    <span className="spec-label">Chasis</span>
                    <span className="spec-value">{selectedCar.Chasis || '-'}</span>
                  </div>
                  <div className="spec-card">
                    <span className="spec-label">Diseñador Jefe</span>
                    <span className="spec-value">{selectedCar.Diseñador || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Season Statistics / Telemetry */}
              <div className="stats-section">
                <div className="section-title-sm">
                  <Trophy size={16} /> Rendimiento en Temporada {selectedCar.Anio}
                </div>

                <div className="stats-cards-grid">
                  {/* Team Stats */}
                  <div className="telemetry-card">
                    <div className="telemetry-header">
                      <span>ESCUDERÍA: {selectedCar.Escuderia}</span>
                      <span className="pos-badge">Mundial: {selectedCar.Eq_Pos}</span>
                    </div>
                    <div className="telemetry-metrics">
                      <div className="metric-item">
                        <span className="metric-val">{selectedCar.Eq_Carreras}</span>
                        <span className="metric-name">GPs</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-val highlight-win">{selectedCar.Eq_Victorias}</span>
                        <span className="metric-name">Victorias</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-val">{selectedCar.Eq_Poles}</span>
                        <span className="metric-name">Poles</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-val">{selectedCar.Eq_VR}</span>
                        <span className="metric-name">V. Rápidas</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Stats */}
                  <div className="telemetry-card">
                    <div className="telemetry-header">
                      <span>PILOTO: {selectedCar.Piloto}</span>
                      <span className="pos-badge highlight">Mundial: {selectedCar.Pil_Pos}</span>
                    </div>
                    <div className="telemetry-metrics">
                      <div className="metric-item">
                        <span className="metric-val">{selectedCar.Pil_Carreras}</span>
                        <span className="metric-name">GPs</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-val highlight-win">{selectedCar.Pil_Victorias}</span>
                        <span className="metric-name">Victorias</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-val">{selectedCar.Pil_Podios}</span>
                        <span className="metric-name">Podios</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-val highlight-pts">{selectedCar.Pil_Puntos}</span>
                        <span className="metric-name">Puntos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* LIGHTBOX FOR FULL RESOLUTION PHOTO VIEW */}
      {zoomedImg && createPortal(
        <div className="lightbox-backdrop" onClick={() => setZoomedImg(null)}>
          <div className="lightbox-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setZoomedImg(null)} title="Cerrar">
              <X size={24} />
            </button>
            <img src={zoomedImg.url} alt={zoomedImg.title} className="lightbox-image" />
            <div className="lightbox-title">{zoomedImg.title}</div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import styles from './AdvancedDownloads.module.css';

interface ReleaseItem {
  name: string;
  description: string;
  icon: string;
  url: string;
  extract_size: number;
  extract_sha256: string;
  image_download_size: number;
  release_date: string;
  init_format: string;
}

interface ReleaseCategory {
  name: string;
  description: string;
  icon: string;
  subitems: ReleaseItem[];
}

interface ReleaseData {
  imager: {
    latest_version: string;
    url: string;
  };
  os_list: ReleaseCategory[];
}

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (dateStr: string): string => {
  try {
    // Handle different date formats from the JSON
    const date = new Date(dateStr.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$3-$2'));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateStr;
  }
};

export default function AdvancedDownloads(): JSX.Element {
  const [stableReleases, setStableReleases] = useState<ReleaseData | null>(null);
  const [devReleases, setDevReleases] = useState<ReleaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stable' | 'development'>('stable');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        
        // Try multiple CORS proxies as fallback
        const proxies = [
          'https://cors-anywhere.herokuapp.com/',
          'https://api.codetabs.com/v1/proxy?quest=',
          'https://cors.bridged.cc/',
          'https://proxy.cors.sh/'
        ];
        
        let stableData, devData;
        let lastError;
        
        for (const proxyUrl of proxies) {
          try {
            // Try to fetch all available JSON files
            const [stableResponse, stableResponse2, devResponse] = await Promise.all([
              fetch(proxyUrl + 'https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/Json/OpenHD-download-index.json').catch(() => ({ ok: false })),
              fetch(proxyUrl + 'https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/Json/OpenHD-download-index.json_1.json').catch(() => ({ ok: false })),
              fetch(proxyUrl + 'https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/Json/OpenHD-development-releases.json').catch(() => ({ ok: false }))
            ]);

            // Use whichever stable response is successful
            const workingStableResponse = stableResponse.ok ? stableResponse : (stableResponse2.ok ? stableResponse2 : null);
            
            if (workingStableResponse && devResponse.ok) {
              stableData = await workingStableResponse.json();
              devData = await devResponse.json();
              break; // Success, exit loop
            }
          } catch (err) {
            lastError = err;
            continue; // Try next proxy
          }
        }
        
        if (!stableData || !devData) {
          throw lastError || new Error('All CORS proxies failed');
        }

        setStableReleases(stableData);
        setDevReleases(devData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);


  const renderDownloadItem = (item: ReleaseItem) => {
    // Extract version from name (e.g., "OpenHD-2.6.4-evo", "OpenHD-2.4-evo-beta" -> "2.6.4", "2.4")
    const versionMatch = item.name.match(/(\d+\.\d+(?:\.\d+)?)/);
    const version = versionMatch ? versionMatch[1] : null;
    
    return (
      <a 
        href={item.url}
        className={styles.downloadItem}
        download
        title={`Download ${item.name}`}
        onMouseEnter={(e) => {
          const tooltip = e.currentTarget.querySelector(`.${styles.infoTooltip}`) as HTMLElement;
          if (tooltip) tooltip.style.display = 'block';
        }}
        onMouseLeave={(e) => {
          const tooltip = e.currentTarget.querySelector(`.${styles.infoTooltip}`) as HTMLElement;
          if (tooltip) tooltip.style.display = 'none';
        }}
      >
        <div className={styles.downloadHeader}>
          <h4 className={styles.downloadName}>{item.name}</h4>
          <div className={styles.downloadIcon}>
            <i className="fas fa-download"></i>
          </div>
        </div>
        
        <div className={styles.downloadMeta}>
          {version && <span className={`${styles.downloadMetaItem} ${styles.versionTag}`}>v{version}</span>}
          <span className={styles.downloadMetaItem}>{formatFileSize(item.image_download_size)}</span>
          <span className={styles.downloadMetaItem}>{formatDate(item.release_date)}</span>
          <span className={styles.downloadMetaItem}>Extract: {formatFileSize(item.extract_size)}</span>
        </div>
        
        <p className={styles.downloadDescription}>{item.description}</p>
        
        <div className={styles.infoTooltip} style={{ display: 'none' }}>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
            <strong>Format:</strong> {item.init_format} • <strong>File:</strong> {item.url.split('/').pop()?.split('.').slice(-2).join('.')}
          </div>
          <div><strong>SHA256:</strong></div>
          <code 
            style={{ 
              fontSize: '0.7rem', 
              cursor: 'pointer', 
              wordBreak: 'break-all',
              display: 'block',
              marginTop: '0.25rem',
              padding: '0.25rem',
              background: 'var(--ifm-color-emphasis-100)',
              borderRadius: '3px'
            }}
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(item.extract_sha256);
              const target = e.target as HTMLElement;
              const original = target.textContent;
              target.textContent = 'Copied!';
              setTimeout(() => target.textContent = original, 1000);
            }}
          >
            {item.extract_sha256}
          </code>
        </div>
      </a>
    );
  };

  const renderCategory = (category: ReleaseCategory) => (
    <div key={category.name} className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <img src={category.icon} alt={category.name} className={styles.categoryIcon} />
        <h3 className={styles.categoryName}>{category.name}</h3>
        <span className={styles.categoryCount}>
          {category.subitems.length} files
        </span>
      </div>
      <div className={styles.downloadsList}>
        {category.subitems.map((item, index) => (
          <div key={index}>
            {renderDownloadItem(item)}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading release information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>❌ Failed to load releases</h3>
          <p>{error}</p>
          <p>Please try refreshing the page or check your internet connection.</p>
        </div>
      </div>
    );
  }

  const currentReleases = activeTab === 'stable' ? stableReleases : devReleases;

  if (!showAdvanced) {
    return (
      <div className={styles.container}>
        <div className={styles.collapsedView}>
          <div className={styles.collapsedHeader}>
            <i className="fas fa-cog"></i>
            <div>
              <h3>Advanced Setup - Manual Downloads</h3>
              <p>Raw images for advanced users with specific requirements</p>
            </div>
          </div>
          <button 
            className={styles.expandButton}
            onClick={() => setShowAdvanced(true)}
          >
            Show Advanced Downloads
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Advanced Setup - Manual Downloads</h2>
          <button 
            className={styles.collapseButton}
            onClick={() => setShowAdvanced(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <p className={styles.subtitle}>
          Direct access to all OpenHD images for advanced users and specific hardware configurations
        </p>
        
        <div className={styles.warning}>
          <i className="fas fa-exclamation-triangle"></i>
          <div>
            <strong>For Advanced Users Only</strong>
            <p>These manual downloads require technical knowledge. Most users should use the ImageWriter above.</p>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'stable' ? styles.active : ''}`}
          onClick={() => setActiveTab('stable')}
        >
          <i className="fas fa-check-circle"></i>
          Stable Releases
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'development' ? styles.active : ''}`}
          onClick={() => setActiveTab('development')}
        >
          <i className="fas fa-flask"></i>
          Development Releases
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'stable' && (
          <div className={styles.tabInfo}>
            <p>🟢 <strong>Stable releases</strong> are thoroughly tested and recommended for production use.</p>
          </div>
        )}
        {activeTab === 'development' && (
          <div className={styles.tabInfo}>
            <p>🟡 <strong>Development releases</strong> include the latest features but may contain bugs.</p>
          </div>
        )}

        <div className={styles.categoriesContainer}>
          {currentReleases?.os_list.map(category => renderCategory(category))}
        </div>
      </div>

      <div className={styles.footer}>
        <p>
          <i className="fas fa-info-circle"></i>
          All downloads are compressed (.xz) files. You'll need appropriate software to extract them.
        </p>
        <p>
          <i className="fas fa-shield-alt"></i>
          Always verify SHA256 checksums for security and integrity.
        </p>
      </div>
    </div>
  );
}
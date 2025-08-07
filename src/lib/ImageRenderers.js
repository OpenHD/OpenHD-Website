// OpenHD Social Card Image Renderers
// Using Satori to generate dynamic OG images at build time

const React = require('react');
const { readFileSync } = require('fs');
const { join } = require('path');

// Load OpenHD logo as base64 for embedding in social cards
const getOpenHDLogo = () => {
  try {
    const logoPath = join(__dirname, '../../static/img/OpenHD-Logo.png');
    const logoBuffer = readFileSync(logoPath);
    return `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch (error) {
    console.warn('Could not load OpenHD logo for social cards:', error.message);
    return null;
  }
};

// OpenHD Brand Colors and Typography
const brandColors = {
  primary: '#00a6f2',
  primaryDark: '#0095d9',
  background: '#1c262f',
  backgroundLight: '#ffffff',
  text: '#ffffff',
  textDark: '#212529',
  accent: '#26b4f5',
  gradient: 'linear-gradient(135deg, #00a6f2 0%, #26b4f5 100%)',
};

// Common styling for all cards
const baseCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  background: `linear-gradient(135deg, ${brandColors.background} 0%, #003a52 100%)`,
  color: brandColors.text,
  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
  position: 'relative',
  overflow: 'hidden',
};

// Header component for all cards
const CardHeader = ({ title, subtitle, showLogo = true }) => {
  const logoDataUrl = getOpenHDLogo();
  
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '40px 60px 20px 60px',
      borderBottom: `2px solid ${brandColors.primary}`,
      background: 'rgba(0, 166, 242, 0.1)',
    }
  }, [
    React.createElement('div', { 
      key: 'title-section',
      style: { 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      } 
    }, [
      React.createElement('h1', {
        key: 'title',
        style: {
          fontSize: '48px',
          fontWeight: '700',
          margin: '0 0 10px 0',
          color: brandColors.text,
          lineHeight: '1.1',
        }
      }, title),
      subtitle && React.createElement('p', {
        key: 'subtitle',
        style: {
          fontSize: '24px',
          margin: '0',
          opacity: '0.9',
          color: brandColors.accent,
          fontWeight: '400',
        }
      }, subtitle)
    ]),
    showLogo && React.createElement('div', {
      key: 'logo-section',
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }
    }, [
      logoDataUrl ? React.createElement('img', {
        key: 'logo-image',
        src: logoDataUrl,
        alt: 'OpenHD Logo',
        style: {
          width: '80px',
          height: '80px',
          borderRadius: '12px',
        }
      }) : React.createElement('div', {
        key: 'logo-fallback',
        style: {
          width: '80px',
          height: '80px',
          background: brandColors.gradient,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: '900',
          color: 'white',
        }
      }, 'HD'),
      React.createElement('div', {
        key: 'brand-text',
        style: {
          fontSize: '32px',
          fontWeight: '700',
          color: brandColors.primary,
        }
      }, 'OpenHD')
    ])
  ]);
};

// Footer component for all cards
const CardFooter = ({ category, url = 'openhdfpv.org' }) => {
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '30px 60px',
      borderTop: `1px solid rgba(0, 166, 242, 0.3)`,
      marginTop: 'auto',
      background: 'rgba(0, 0, 0, 0.2)',
    }
  }, [
    React.createElement('div', {
      key: 'category',
      style: {
        background: brandColors.gradient,
        padding: '8px 20px',
        borderRadius: '20px',
        fontSize: '18px',
        fontWeight: '600',
        color: 'white',
      }
    }, category),
    React.createElement('div', {
      key: 'url',
      style: {
        fontSize: '20px',
        color: brandColors.accent,
        fontWeight: '500',
      }
    }, url)
  ]);
};

// Documentation pages renderer
const docs = (data, context) => {
  const title = data.metadata.title || 'Documentation';
  const description = data.metadata.description || 'OpenHD Documentation';
  const category = data.metadata.sidebar_label || 'Docs';
  
  return [
    React.createElement('div', { style: baseCardStyle }, [
      React.createElement(CardHeader, {
        key: 'header',
        title: title,
        subtitle: description.length > 100 ? description.substring(0, 100) + '...' : description,
      }),
      React.createElement('div', {
        key: 'content',
        style: {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 60px',
        }
      }, [
        React.createElement('div', {
          key: 'doc-icon',
          style: {
            width: '120px',
            height: '120px',
            background: 'rgba(0, 166, 242, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            color: brandColors.primary,
            position: 'relative',
          }
        }, [
          getOpenHDLogo() ? React.createElement('img', {
            key: 'doc-logo',
            src: getOpenHDLogo(),
            alt: 'OpenHD Documentation',
            style: {
              width: '80px',
              height: '80px',
              borderRadius: '50%',
            }
          }) : React.createElement('div', {
            key: 'doc-fallback',
            style: {
              fontSize: '48px',
              fontWeight: '700',
              color: brandColors.primary,
            }
          }, 'DOCS')
        ]),
        React.createElement('div', {
          key: 'doc-info',
          style: {
            marginLeft: '40px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          React.createElement('h2', {
            key: 'doc-tagline',
            style: {
              fontSize: '28px',
              color: brandColors.accent,
              margin: '0 0 10px 0',
              fontWeight: '600',
            }
          }, 'Open Source Digital FPV'),
          React.createElement('p', {
            key: 'doc-desc',
            style: {
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0',
              lineHeight: '1.4',
            }
          }, 'Professional HD video transmission for drones and RC aircraft')
        ])
      ]),
      React.createElement(CardFooter, {
        key: 'footer',
        category: category
      })
    ]),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: readFileSync(
            join(__dirname, '../../static/fonts/Inter-Regular.ttf'),
          ),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: readFileSync(
            join(__dirname, '../../static/fonts/Inter-Bold.ttf'),
          ),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  ];
};

// Pages renderer (for custom pages like downloads, changelog, etc.)
const pages = (data, context) => {
  const title = data.metadata.title || 'OpenHD';
  const description = data.metadata.description || 'Open Source Digital FPV Ecosystem';
  
  // Special handling for different page types
  let pageIcon = 'HD';
  let pageCategory = 'Page';
  let pageTagline = 'Open Source Digital FPV';
  
  if (title.toLowerCase().includes('download')) {
    pageIcon = 'DL';
    pageCategory = 'Downloads';
    pageTagline = 'Get OpenHD Images & Tools';
  } else if (title.toLowerCase().includes('changelog')) {
    pageIcon = 'LOG';
    pageCategory = 'Updates';
    pageTagline = 'Latest Features & Fixes';
  } else if (title.toLowerCase().includes('privacy')) {
    pageIcon = 'SEC';
    pageCategory = 'Privacy';
    pageTagline = 'Your Privacy Matters';
  }
  
  return [
    React.createElement('div', { style: baseCardStyle }, [
      React.createElement(CardHeader, {
        key: 'header',
        title: title,
        subtitle: description.length > 80 ? description.substring(0, 80) + '...' : description,
      }),
      React.createElement('div', {
        key: 'content',
        style: {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 60px',
        }
      }, [
        React.createElement('div', {
          key: 'page-icon',
          style: {
            width: '140px',
            height: '140px',
            background: brandColors.gradient,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '900',
            color: 'white',
            marginRight: '50px',
            boxShadow: '0 10px 30px rgba(0, 166, 242, 0.3)',
          }
        }, pageIcon),
        React.createElement('div', {
          key: 'page-info',
          style: { 
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          React.createElement('h2', {
            key: 'page-tagline',
            style: {
              fontSize: '32px',
              color: brandColors.accent,
              margin: '0 0 15px 0',
              fontWeight: '600',
            }
          }, pageTagline),
          React.createElement('p', {
            key: 'page-desc',
            style: {
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              lineHeight: '1.4',
            }
          }, 'Professional HD video transmission and telemetry for FPV applications')
        ])
      ]),
      React.createElement(CardFooter, {
        key: 'footer',
        category: pageCategory
      })
    ]),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: readFileSync(
            join(__dirname, '../../static/fonts/Inter-Regular.ttf'),
          ),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: readFileSync(
            join(__dirname, '../../static/fonts/Inter-Bold.ttf'),
          ),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  ];
};

// Blog renderer (if blog is ever added)
const blog = (data, context) => {
  const title = data.metadata.title || 'OpenHD Blog';
  const description = data.metadata.description || 'Latest OpenHD News';
  const author = data.metadata.authors?.[0]?.name || 'OpenHD Team';
  const date = data.metadata.date ? new Date(data.metadata.date).toLocaleDateString() : '';
  
  return [
    React.createElement('div', { style: baseCardStyle }, [
      React.createElement(CardHeader, {
        key: 'header',
        title: title,
        subtitle: `By ${author} ${date ? `• ${date}` : ''}`,
      }),
      React.createElement('div', {
        key: 'content',
        style: {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '40px 60px',
        }
      }, [
        React.createElement('div', {
          key: 'blog-content',
          style: { 
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          React.createElement('p', {
            key: 'blog-excerpt',
            style: {
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              lineHeight: '1.5',
            }
          }, description.length > 150 ? description.substring(0, 150) + '...' : description)
        ]),
        React.createElement('div', {
          key: 'blog-icon',
          style: {
            width: '100px',
            height: '100px',
            background: brandColors.gradient,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            marginLeft: '40px',
          }
        }, React.createElement('div', {
          style: {
            fontSize: '36px',
            fontWeight: '700',
            color: 'white'
          }
        }, 'BLOG'))
      ]),
      React.createElement(CardFooter, {
        key: 'footer',
        category: 'Blog'
      })
    ]),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: readFileSync(
            join(__dirname, '../../static/fonts/Inter-Regular.ttf'),
          ),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: readFileSync(
            join(__dirname, '../../static/fonts/Inter-Bold.ttf'),
          ),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  ];
};

module.exports = {
  docs,
  pages,
  blog,
};
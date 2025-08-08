import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FundingWidget from '@site/src/components/FundingWidget';
import styles from './help-us.module.css';

interface OpenCollectiveStats {
  balance: number;
  currency: string;
  yearlyBudget: number;
  totalAmountReceived: number;
  contributorsCount: number;
  backersCount: number;
  monthlyBudget: number;
  monthlyBackersCount: number;
}

interface HostInfo {
  name: string;
  hostFeePercent: number;
}

interface Contributor {
  id: string;
  name: string;
  image: string;
  profile: string;
  totalAmountDonated: number;
  currency: string;
  isActive: boolean;
  since: string;
  createdAt: string; // Add donation date
  isMonthly: boolean;
  isCurrentlyMonthly: boolean; // Currently active monthly supporter
  tierName?: string;
}

export default function HelpUs() {
  const [activeTab, setActiveTab] = useState<'donate' | 'develop' | 'community' | null>(null);
  const [supporterTab, setSupporterTab] = useState<'monthly' | 'hall-of-fame' | 'recent'>('monthly');
  const [stats, setStats] = useState<OpenCollectiveStats | null>(null);
  const [hostInfo, setHostInfo] = useState<HostInfo | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [topContributors, setTopContributors] = useState<Contributor[]>([]);
  const [monthlyContributors, setMonthlyContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);

  // Helper function to calculate monthly estimate
  const calculateMonthlyEstimate = (totalAmount: number, sinceDate: string) => {
    const startDate = new Date(sinceDate);
    const now = new Date();
    const monthsActive = Math.max(1, Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))); // Average days per month
    return Math.round(totalAmount / monthsActive);
  };

  // Helper function to format the "since" date
  const formatSinceDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Helper function to format donation date
  const formatDonationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchOpenCollectiveData = async () => {
      try {
        // Working GraphQL query based on terminal testing
        const query = `
          query {
            collective(slug: "openhd") {
              slug
              name
              currency
              host {
                id
                name
                slug
                hostFeePercent
              }
              stats {
                balance {
                  valueInCents
                }
                totalAmountReceived {
                  valueInCents
                }
                totalPaidExpenses {
                  valueInCents
                }
              }
              members(role: BACKER, limit: 50, orderBy: { field: CREATED_AT, direction: DESC }) {
                totalCount
                nodes {
                  id
                  role
                  since
                  createdAt
                  isActive
                  account {
                    id
                    name
                    imageUrl
                    slug
                  }
                  totalDonations {
                    valueInCents
                  }
                  tier {
                    name
                    type
                    frequency
                  }
                }
              }
            }
          }
        `;

        const response = await fetch('https://api.opencollective.com/graphql/v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('HTTP Error:', response.status, response.statusText);
          console.error('Response data:', data);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        if (data.errors) {
          console.error('GraphQL errors:', data.errors);
          throw new Error('GraphQL query failed');
        }

        if (data.data?.collective) {
          const collective = data.data.collective;
          
          // Set host information
          setHostInfo({
            name: collective.host?.name || 'OpenCollective',
            hostFeePercent: collective.host?.hostFeePercent || 10
          });
          
          setStats({
            balance: collective.stats.balance?.valueInCents ? collective.stats.balance.valueInCents / 100 : 0,
            currency: collective.currency,
            yearlyBudget: 0, // Not available in public API
            totalAmountReceived: collective.stats.totalAmountReceived.valueInCents / 100,
            contributorsCount: collective.members.totalCount,
            backersCount: collective.members.totalCount,
            monthlyBudget: 0, // Will be calculated later
            monthlyBackersCount: 0 // Will be calculated later
          });

          const contributorsList = collective.members.nodes
            .filter((member: any) => member.account && member.account.name)
            .map((member: any) => ({
              id: member.id, // Use unique member ID instead of account slug
              name: member.account.name,
              image: member.account.imageUrl || `https://images.opencollective.com/${member.account.slug || 'anonymous'}/avatar/128.png`,
              profile: `https://opencollective.com/${member.account.slug || 'anonymous'}`,
              totalAmountDonated: member.totalDonations.valueInCents / 100,
              currency: collective.currency,
              isActive: true,
              since: member.since,
              createdAt: member.createdAt, // Add donation date
              isMonthly: member.tier?.frequency === 'MONTHLY',
              isCurrentlyMonthly: member.tier?.frequency === 'MONTHLY' && member.isActive,
              tierName: member.tier?.name
            }));

          // Recent contributors (chronological)
          setContributors(contributorsList.slice(0, 12));
          
          // Top contributors (by amount) - Hall of Fame with tied positions
          const sortedDonors = [...contributorsList]
            .sort((a, b) => b.totalAmountDonated - a.totalAmountDonated);
          
          // Get top 10, but include all tied amounts at position 10
          const minTop10 = 10;
          let hallOfFame = sortedDonors.slice(0, minTop10);
          
          if (sortedDonors.length > minTop10) {
            const tenthPlaceAmount = sortedDonors[minTop10 - 1].totalAmountDonated;
            // Add all contributors with the same amount as 10th place
            const additionalTied = sortedDonors.slice(minTop10)
              .filter(contributor => contributor.totalAmountDonated === tenthPlaceAmount);
            hallOfFame = [...hallOfFame, ...additionalTied];
          }
          
          setTopContributors(hallOfFame);

          // Monthly contributors - only currently active ones
          const monthlyDonors = contributorsList
            .filter(contributor => contributor.isCurrentlyMonthly)
            .sort((a, b) => b.totalAmountDonated - a.totalAmountDonated);
          setMonthlyContributors(monthlyDonors);

          // Calculate approximate monthly budget from currently active monthly supporters
          const monthlyTotal = monthlyDonors.reduce((sum, contributor) => sum + contributor.totalAmountDonated, 0);
          const estimatedMonthlyBudget = monthlyTotal > 0 ? Math.round(monthlyTotal / 12) : 0; // Rough estimate

          setStats({
            balance: collective.stats.balance?.valueInCents ? collective.stats.balance.valueInCents / 100 : 0,
            currency: collective.currency,
            yearlyBudget: 0, // Not available in public API
            totalAmountReceived: collective.stats.totalAmountReceived.valueInCents / 100,
            contributorsCount: collective.members.totalCount,
            backersCount: collective.members.totalCount,
            monthlyBudget: estimatedMonthlyBudget,
            monthlyBackersCount: monthlyDonors.length
          });
        } else {
          throw new Error('No collective data received');
        }
      } catch (error) {
        console.error('Error fetching OpenCollective data:', error);
        // Don't set fallback data - just leave stats and contributors empty
        // The UI will handle this by not displaying those sections
      } finally {
        setLoading(false);
      }
    };

    fetchOpenCollectiveData();
  }, []);

  return (
    <Layout
      title="Help us support OpenHD"
      description="Support OpenHD development through donations or by joining our developer community"
    >
      <Head>
        <meta property="og:title" content="Help us support OpenHD" />
        <meta property="og:description" content="Support OpenHD development through donations or by joining our developer community" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className={styles.helpUsPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Help us build the future of <span className={styles.accent}>OpenHD</span>
              </h1>
              <p className={styles.heroSubtitle}>
                OpenHD is an open-source project that depends on community support. 
                Help us continue development and improve the platform for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Selection Interface - Only show if no tab is selected */}
        {!activeTab && (
          <section className={`${styles.selectionSection} ${styles.fadeIn}`}>
            <div className="container">
              <h2>How would you like to support OpenHD?</h2>
              <div className={styles.selectionGrid}>
                <button 
                  className={styles.selectionCard}
                  onClick={() => setActiveTab('donate')}
                >
                  <div className={styles.selectionContent}>
                    <div className={styles.selectionIcon}>
                      <i className="fas fa-heart"></i>
                    </div>
                    <div className={styles.selectionText}>
                      <h3>💰 Financial Support</h3>
                      <p>Support development through donations and help cover infrastructure costs</p>
                    </div>
                  </div>
                  <div className={styles.selectionArrow}>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </button>

                <button 
                  className={styles.selectionCard}
                  onClick={() => setActiveTab('develop')}
                >
                  <div className={styles.selectionContent}>
                    <div className={styles.selectionIcon}>
                      <i className="fas fa-code"></i>
                    </div>
                    <div className={styles.selectionText}>
                      <h3>👨‍💻 Join as Developer</h3>
                      <p>Help build features, fix bugs, and improve the codebase</p>
                    </div>
                  </div>
                  <div className={styles.selectionArrow}>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </button>

                <button 
                  className={styles.selectionCard}
                  onClick={() => setActiveTab('community')}
                >
                  <div className={styles.selectionContent}>
                    <div className={styles.selectionIcon}>
                      <i className="fas fa-users"></i>
                    </div>
                    <div className={styles.selectionText}>
                      <h3>🤝 Community & Support</h3>
                      <p>Help users, report bugs, test hardware, or spread the word</p>
                    </div>
                  </div>
                  <div className={styles.selectionArrow}>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Why Support OpenHD - Show on main page when no tab is selected */}
        {!activeTab && (
        <section className={styles.whySupportSection}>
          <div className="container">
            <h2>Why Support OpenHD?</h2>
            <div className={styles.whySupportGrid}>
              <div className={styles.supportCard}>
                <div className={styles.supportIcon}>
                  <i className="fas fa-rocket"></i>
                </div>
                <h3>Proven Track Record</h3>
                <ul className={styles.supportList}>
                  <li><strong>Continuous development</strong> with regular releases</li>
                  <li><strong>Strong partnerships</strong> with industry leaders</li>
                  <li><strong>Active community</strong> of developers and users</li>
                </ul>
              </div>

              <div className={styles.supportCard}>
                <div className={styles.supportIcon}>
                  <i className="fas fa-flask"></i>
                </div>
                <h3>Innovation Focus</h3>
                <ul className={styles.supportList}>
                  <li>Custom drivers for optimal hardware performance</li>
                  <li>Support for cutting-edge cameras and platforms</li>
                  <li>Real-time settings without reboots</li>
                </ul>
              </div>

              <div className={styles.supportCard}>
                <div className={styles.supportIcon}>
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Always Free</h3>
                <ul className={styles.supportList}>
                  <li>OpenHD will always remain free and open source</li>
                  <li>No premium features behind paywalls</li>
                  <li>Community-driven development priorities</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Tab Navigation - Show when a tab is selected */}
        {activeTab && (
          <section className={styles.tabNavigation}>
            <div className="container">
              <div className={styles.tabHeader}>
                <button 
                  className={styles.backButton}
                  onClick={() => setActiveTab(null)}
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Back to options</span>
                </button>
                <div className={styles.tabIndicator}>
                  <span className={styles.currentTab}>
                    {activeTab === 'donate' && '💰 Financial Support'}
                    {activeTab === 'develop' && '👨‍💻 Development & Code'}
                    {activeTab === 'community' && '🤝 Community & Support'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DONATE TAB CONTENT */}
        {activeTab === 'donate' && (
          <>
            {/* Patreon Info Banner */}
            <section className={styles.patreonInfoSection}>
              <div className="container">
                <div className={styles.patreonBanner}>
                  <div className={styles.patreonIcon}>
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className={styles.patreonContent}>
                    <p>
                      There is also a <a href="https://www.patreon.com/OpenHD" target="_blank" rel="noopener noreferrer">Patreon campaign</a> available, but this exclusively targets the creation of specialized hardware.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action for Donations - moved to top */}
            <section className={styles.donationCTASection}>
              <div className="container">
                <h2>Support OpenHD Financially</h2>
                <div className={styles.donationCTAContent}>
                  <div className={styles.donationText}>
                    <h3>Monthly Funding Status</h3>
                    
                    {/* Use the reusable FundingWidget */}
                    <FundingWidget variant="inline" showDescription={true} showDonateButton={false} />
                    
                    <ul className={styles.needsList}>
                      <li><strong>Server & Infrastructure:</strong> $34/month for hosting and distribution services</li>
                      <li><strong>Hardware Testing:</strong> $50-100/month for new equipment and compatibility testing</li>
                      <li><strong>Development Resources:</strong> $20-40/month for professional tools and licenses</li>
                      <li><strong>Community Engagement:</strong> $15-50/month for outreach activities and events</li>
                    </ul>
                    <p className={styles.sustainabilityNote}>
                      <strong>Our Goal:</strong> $120-240/month for sustainable development and community growth
                    </p>
                  </div>
                  <div className={styles.donationActions}>
                    <h4>Donate Now</h4>
                    <div className={styles.donationButtons}>
                      <a href="https://opencollective.com/openhd" target="_blank" rel="noopener noreferrer" className={styles.donationButton}>
                        <i className="fas fa-heart"></i>
                        <span>Via OpenCollective</span>
                      </a>
                      <div className={styles.donationInfo}>
                        <p><strong>Transparent:</strong> All income and expenses are publicly visible</p>
                        <p><strong>Secure:</strong> Managed by OpenCollective (Non-Profit)</p>
                        <p><strong>Flexible:</strong> One-time donation or monthly contribution</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* OpenCollective Stats - only show if we have real data */}
            {!loading && stats && (
          <section className={styles.statsSection}>
            <div className="container">
              <h2>Community Support</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.balance.toFixed(0)} {stats.currency}</div>
                  <div className={styles.statLabel}>Current Balance</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.backersCount}</div>
                  <div className={styles.statLabel}>Supporters</div>
                </div>
                {stats.monthlyBudget > 0 && (
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>~{stats.monthlyBudget} {stats.currency}</div>
                    <div className={styles.statLabel}>Monthly Budget</div>
                  </div>
                )}
                {stats.monthlyBackersCount > 0 && (
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.monthlyBackersCount}</div>
                    <div className={styles.statLabel}>Monthly Supporters</div>
                  </div>
                )}
                {stats.yearlyBudget > 0 && (
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.yearlyBudget.toFixed(0)} {stats.currency}</div>
                    <div className={styles.statLabel}>Yearly Budget</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Supporters Tab System - only show if we have real data */}
        {!loading && (stats || contributors.length > 0 || topContributors.length > 0 || monthlyContributors.length > 0) && (
          <section className={styles.supportersSection}>
            <div className="container">
              <h2>Our Community Supporters</h2>
              
              {/* Tab Navigation */}
              <div className={styles.supporterTabs}>
                <button 
                  className={`${styles.supporterTab} ${supporterTab === 'monthly' ? styles.active : ''}`}
                  onClick={() => setSupporterTab('monthly')}
                >
                  <i className="fas fa-heart"></i>
                  Monthly Supporters ({monthlyContributors.length})
                </button>
                <button 
                  className={`${styles.supporterTab} ${supporterTab === 'hall-of-fame' ? styles.active : ''}`}
                  onClick={() => setSupporterTab('hall-of-fame')}
                >
                  <i className="fas fa-trophy"></i>
                  Hall of Fame ({topContributors.length})
                </button>
                <button 
                  className={`${styles.supporterTab} ${supporterTab === 'recent' ? styles.active : ''}`}
                  onClick={() => setSupporterTab('recent')}
                >
                  <i className="fas fa-clock"></i>
                  Recent Contributors ({contributors.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className={styles.supporterTabContent}>
                {/* Monthly Supporters Tab */}
                {supporterTab === 'monthly' && monthlyContributors.length > 0 && (
                  <div className={styles.tabPane}>
                    <p className={styles.tabDescription}>
                      Our current monthly supporters who provide ongoing support for OpenHD development!
                    </p>
                    <div className={styles.monthlyGrid}>
                      {monthlyContributors.map((contributor) => (
                        <div key={contributor.id} className={styles.monthlyCard}>
                          <img 
                            src={contributor.image} 
                            alt={contributor.name}
                            className={styles.monthlyAvatar}
                          />
                          <div className={styles.monthlyName}>{contributor.name}</div>
                          <div className={styles.monthlyAmount}>
                            {contributor.totalAmountDonated.toFixed(0)} {contributor.currency} total
                          </div>
                          <div className={styles.monthlyEstimate}>
                            ~{calculateMonthlyEstimate(contributor.totalAmountDonated, contributor.since)} {contributor.currency}/month
                          </div>
                          <div className={styles.monthlyBadge}>Monthly Supporter</div>
                          <div className={styles.monthlySince}>
                            Since {formatSinceDate(contributor.since)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.monthlyNote}>
                      <p>
                        <strong>Monthly supporters provide stable funding</strong> that helps us plan development, 
                        cover server costs, and invest in new features. Thank you for your ongoing commitment!
                      </p>
                    </div>
                  </div>
                )}

                {/* Hall of Fame Tab */}
                {supporterTab === 'hall-of-fame' && topContributors.length > 0 && (
                  <div className={styles.tabPane}>
                    <p className={styles.tabDescription}>
                      Our biggest supporters who make OpenHD development possible!
                    </p>
                    <div className={styles.hallOfFameGrid}>
                      {topContributors.map((contributor, index) => (
                        <div key={contributor.id} className={`${styles.hallOfFameCard} ${index < 3 ? styles.topThree : ''}`}>
                          {index < 3 && (
                            <div className={styles.rankBadge}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </div>
                          )}
                          <img 
                            src={contributor.image} 
                            alt={contributor.name}
                            className={styles.hallOfFameAvatar}
                          />
                          <div className={styles.hallOfFameName}>{contributor.name}</div>
                          <div className={styles.hallOfFameAmount}>
                            {contributor.totalAmountDonated.toFixed(0)} {contributor.currency}
                            {contributor.isMonthly && <span className={styles.monthlyBadge}>monthly</span>}
                          </div>
                          <div className={styles.hallOfFameRank}>#{index + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Contributors Tab */}
                {supporterTab === 'recent' && contributors.length > 0 && (
                  <div className={styles.tabPane}>
                    <p className={styles.tabDescription}>
                      Thank you to our latest supporters who help make OpenHD possible!
                    </p>
                    <div className={styles.contributorsGrid}>
                      {contributors.slice(0, 12).map((contributor) => (
                        <div key={contributor.id} className={styles.contributorCard}>
                          <img 
                            src={contributor.image} 
                            alt={contributor.name}
                            className={styles.contributorAvatar}
                          />
                          <div className={styles.contributorName}>{contributor.name}</div>
                          <div className={styles.contributorAmount}>
                            {contributor.totalAmountDonated.toFixed(0)} {contributor.currency}
                            {contributor.isMonthly && <span className={styles.monthlyBadge}>monthly</span>}
                          </div>
                          <div className={styles.contributorSince}>
                            Donated {formatDonationDate(contributor.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.viewAllContributors}>
                      <a href="https://opencollective.com/openhd" target="_blank" rel="noopener noreferrer">
                        View all contributors →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
          </>
        )}

        {/* DEVELOP TAB CONTENT */}
        {activeTab === 'develop' && (
          <>
            {/* Developer Recruitment */}
            <section className={styles.recruitmentSection}>
              <div className="container">
                <h2>Join the OpenHD Development Team!</h2>
                <div className={styles.recruitmentContent}>
                  <div className={styles.recruitmentText}>
                    <h3>We're Looking for Developers Like You</h3>
                    <p>
                      OpenHD is growing and we need talented developers to help shape the future of FPV. 
                      Whether you have experience with C++, Python, React or are just starting out - 
                      we have opportunities for your contribution.
                    </p>
                    <ul className={styles.skillsList}>
                      <li><i className="fas fa-check"></i> <strong>C++ Development</strong> for core systems</li>
                      <li><i className="fas fa-check"></i> <strong>Python Scripting</strong> and automation</li>
                      <li><i className="fas fa-check"></i> <strong>React/TypeScript</strong> for web interfaces</li>
                      <li><i className="fas fa-check"></i> <strong>Linux Integration</strong> and system adaptations</li>
                      <li><i className="fas fa-check"></i> <strong>Hardware Integration</strong> and testing</li>
                      <li><i className="fas fa-check"></i> <strong>Documentation</strong> and tutorials</li>
                    </ul>
                  </div>
                  <div className={styles.recruitmentCTA}>
                    <div className={styles.ctaBox}>
                      <h4>Ready to Join?</h4>
                      <p>Start with our GitHub repositories and connect with our developer community on Discord and Telegram.</p>
                      <div className={styles.ctaButtons}>
                        <a href="https://github.com/OpenHD" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
                          <i className="fab fa-github"></i>
                          View Code
                        </a>
                        <a href="https://discord.gg/P9kXs9N2RP" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
                          <i className="fab fa-discord"></i>
                          Discord
                        </a>
                        <a href="https://t.me/OpenHD_DEVS" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
                          <i className="fab fa-telegram"></i>
                          Telegram
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Development Areas */}
            <section className={styles.developmentAreasSection}>
              <div className="container">
                <h2>Development Areas</h2>
                <div className={styles.areasGrid}>
                  <div className={styles.areaCard}>
                    <div className={styles.areaIcon}>
                      <i className="fas fa-microchip"></i>
                    </div>
                    <h3>Core System (C++)</h3>
                    <p>Video streaming, telemetry, hardware drivers</p>
                    <ul className={styles.techList}>
                      <li>GStreamer Pipeline</li>
                      <li>WiFi Broadcast</li>
                      <li>Hardware Abstraction</li>
                    </ul>
                    <a href="https://github.com/OpenHD/OpenHD" target="_blank" rel="noopener noreferrer" className={styles.areaButton}>
                      <i className="fab fa-github"></i>
                      OpenHD Core
                    </a>
                  </div>

                  <div className={styles.areaCard}>
                    <div className={styles.areaIcon}>
                      <i className="fas fa-desktop"></i>
                    </div>
                    <h3>Ground Station (Qt/C++)</h3>
                    <p>QOpenHD desktop application</p>
                    <ul className={styles.techList}>
                      <li>Qt Framework</li>
                      <li>OSD Rendering</li>
                      <li>Video Display</li>
                    </ul>
                    <a href="https://github.com/OpenHD/QOpenHD" target="_blank" rel="noopener noreferrer" className={styles.areaButton}>
                      <i className="fab fa-github"></i>
                      QOpenHD
                    </a>
                  </div>

                  <div className={styles.areaCard}>
                    <div className={styles.areaIcon}>
                      <i className="fas fa-globe"></i>
                    </div>
                    <h3>Web Interface (React)</h3>
                    <p>Documentation and web tools</p>
                    <ul className={styles.techList}>
                      <li>React/TypeScript</li>
                      <li>Docusaurus</li>
                      <li>Responsive Design</li>
                    </ul>
                    <a href="https://github.com/OpenHD/UnifiedOpenHDWebsite" target="_blank" rel="noopener noreferrer" className={styles.areaButton}>
                      <i className="fab fa-github"></i>
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* COMMUNITY TAB CONTENT */}
        {activeTab === 'community' && (
          <>
            {/* Community Ways to Help */}
            <section className={styles.communityWaysSection}>
              <div className="container">
                <h2>Community & Support Opportunities</h2>
                <div className={styles.communityGrid}>
                  <div className={styles.communityCard}>
                    <div className={styles.communityIcon}>
                      <i className="fas fa-bug"></i>
                    </div>
                    <h3>Report Bugs</h3>
                    <p>
                      Help us improve by reporting bugs, 
                      suggesting features or contributing to documentation.
                    </p>
                    <a href="https://github.com/OpenHD/OpenHD/issues" target="_blank" rel="noopener noreferrer" className={styles.communityButton}>
                      <i className="fas fa-bug"></i>
                      Report Issues
                    </a>
                  </div>

                  <div className={styles.communityCard}>
                    <div className={styles.communityIcon}>
                      <i className="fas fa-users"></i>
                    </div>
                    <h3>Community Support</h3>
                    <p>
                      Help other users in our community forums, Discord or Telegram. 
                      Share your knowledge and help newcomers get started.
                    </p>
                    <div className={styles.communityButtons}>
                      <a href="https://discord.gg/P9kXs9N2RP" target="_blank" rel="noopener noreferrer" className={styles.communityButton}>
                        <i className="fab fa-discord"></i>
                        Discord
                      </a>
                      <a href="https://t.me/OpenHD_User" target="_blank" rel="noopener noreferrer" className={styles.communityButton}>
                        <i className="fab fa-telegram"></i>
                        Telegram
                      </a>
                    </div>
                  </div>

                  <div className={styles.communityCard}>
                    <div className={styles.communityIcon}>
                      <i className="fas fa-microchip"></i>
                    </div>
                    <h3>Hardware Testing</h3>
                    <p>
                      Test OpenHD with new hardware combinations, report compatibility issues 
                      and share your setups with the community.
                    </p>
                    <a href="https://github.com/OpenHD/OpenHD/issues" target="_blank" rel="noopener noreferrer" className={styles.communityButton}>
                      <i className="fas fa-vial"></i>
                      Test Hardware
                    </a>
                  </div>

                  <div className={styles.communityCard}>
                    <div className={styles.communityIcon}>
                      <i className="fas fa-bullhorn"></i>
                    </div>
                    <h3>Spread the Word</h3>
                    <p>
                      Share OpenHD with FPV enthusiasts, write blog posts, 
                      create videos about your setup or give us a ⭐ on GitHub.
                    </p>
                    <div className={styles.communityButtons}>
                      <a href="https://github.com/OpenHD" target="_blank" rel="noopener noreferrer" className={styles.communityButton}>
                        <i className="fab fa-github"></i>
                        ⭐ GitHub
                      </a>
                      <a href="https://youtube.com/@OpenHD-Official" target="_blank" rel="noopener noreferrer" className={styles.communityButton}>
                        <i className="fab fa-youtube"></i>
                        Videos
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}

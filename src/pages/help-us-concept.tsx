import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './help-us.module.css';

// Interfaces for different contributor types
interface FinancialContributor {
  id: string;
  name: string;
  totalAmountDonated: number;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  isIncognito?: boolean;
  since: string;
  currency: string;
}

interface CodeContributor {
  login: string;
  name?: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
  type: 'User' | 'Bot';
}

interface CommunityHero {
  name: string;
  role: string;
  platform: 'discord' | 'forum' | 'testing' | 'documentation';
  contributions: string[];
  avatar?: string;
  description: string;
}

interface ContentCreator {
  name: string;
  platform: 'youtube' | 'blog' | 'tutorial';
  channelUrl: string;
  subscribers?: number;
  videoCount?: number;
  description: string;
  avatar?: string;
}

export default function HelpUsConcept() {
  const [activeTab, setActiveTab] = useState<'financial' | 'code' | 'community' | 'content'>('financial');
  const [financialContributors, setFinancialContributors] = useState<FinancialContributor[]>([]);
  const [codeContributors, setCodeContributors] = useState<CodeContributor[]>([]);
  const [loading, setLoading] = useState(true);

  // Financial Contributors API Integration
  const fetchFinancialContributors = async (): Promise<FinancialContributor[]> => {
    try {
      const response = await fetch('https://api.opencollective.com/graphql/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              collective(slug: "openhd") {
                members(role: BACKER, limit: 50, orderBy: { field: TOTAL_DONATED, direction: DESC }) {
                  nodes {
                    id
                    since
                    account {
                      name
                      isIncognito
                    }
                    totalDonations {
                      valueInCents
                    }
                  }
                }
              }
            }
          `
        })
      });
      
      const data = await response.json();
      const members = data.data?.collective?.members?.nodes || [];
      
      return members.map((member: any) => {
        const amount = member.totalDonations.valueInCents / 100;
        return {
          id: member.id,
          name: member.account.isIncognito ? 'Anonymous Supporter' : member.account.name,
          totalAmountDonated: amount,
          tier: amount >= 1000 ? 'platinum' : amount >= 500 ? 'gold' : amount >= 100 ? 'silver' : 'bronze',
          isIncognito: member.account.isIncognito,
          since: member.since,
          currency: 'EUR'
        };
      }).slice(0, 12);
    } catch (error) {
      console.error('Error fetching financial contributors:', error);
      return [];
    }
  };

  // Code Contributors GitHub API Integration
  const fetchCodeContributors = async (): Promise<CodeContributor[]> => {
    try {
      const repos = [
        'OpenHD/OpenHD',
        'OpenHD/QOpenHD', 
        'OpenHD/OpenHD-ImageBuilder',
        'OpenHD/Documentation',
        'OpenHD/OpenHD-Website'
      ];
      
      const allContributors = new Map();
      
      for (const repo of repos) {
        const response = await fetch(`https://api.github.com/repos/${repo}/contributors`);
        if (response.ok) {
          const contributors = await response.json();
          contributors.forEach(contributor => {
            if (contributor.type === 'User') {
              const existing = allContributors.get(contributor.login) || {
                ...contributor,
                contributions: 0
              };
              existing.contributions += contributor.contributions;
              allContributors.set(contributor.login, existing);
            }
          });
        }
      }
      
      return Array.from(allContributors.values())
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, 20);
    } catch (error) {
      console.error('Error fetching code contributors:', error);
      return [];
    }
  };

  // Community Heroes - Manual curation for quality control
  const getCommunityHeroes = (): CommunityHero[] => [
    {
      name: "Discord Moderator Team",
      role: "Community Management",
      platform: "discord",
      contributions: ["Daily support", "Community guidelines", "New user onboarding"],
      avatar: "https://images.opencollective.com/guest/avatar/128.png",
      description: "Our Discord moderators provide 24/7 support and maintain community guidelines"
    },
    {
      name: "Beta Testing Community",
      role: "Quality Assurance",
      platform: "testing",
      contributions: ["Hardware testing", "Bug reports", "Feature validation"],
      avatar: "https://images.opencollective.com/guest/avatar/128.png",
      description: "Dedicated testers who validate new features across different hardware configurations"
    },
    {
      name: "Forum Support Champions",
      role: "Knowledge Base",
      platform: "forum",
      contributions: ["Technical support", "Documentation", "FAQ maintenance"],
      avatar: "https://images.opencollective.com/guest/avatar/128.png",
      description: "Expert users who help newcomers and maintain our knowledge base"
    },
    {
      name: "Documentation Team",
      role: "Technical Writing",
      platform: "documentation",
      contributions: ["User guides", "API documentation", "Tutorial creation"],
      avatar: "https://images.opencollective.com/guest/avatar/128.png",
      description: "Writers who create and maintain comprehensive documentation"
    }
  ];

  // Content Creators - YouTube integration and external content
  const getContentCreators = (): ContentCreator[] => [
    {
      name: "OpenHD Official Tutorials",
      platform: "youtube",
      channelUrl: "https://youtube.com/@openhd",
      subscribers: 15000,
      videoCount: 45,
      description: "Official OpenHD channel with complete setup guides and troubleshooting videos",
      avatar: "https://images.opencollective.com/guest/avatar/128.png"
    },
    {
      name: "FPV Tech Deep Dive",
      platform: "blog",
      channelUrl: "https://fpvtech.blog/openhd",
      description: "In-depth technical articles about OpenHD development and implementation",
      avatar: "https://images.opencollective.com/guest/avatar/128.png"
    },
    {
      name: "Drone Academy",
      platform: "tutorial",
      channelUrl: "https://droneacademy.com/openhd",
      subscribers: 8500,
      videoCount: 25,
      description: "Beginner-friendly OpenHD integration tutorials for newcomers",
      avatar: "https://images.opencollective.com/guest/avatar/128.png"
    },
    {
      name: "Community Reviewers",
      platform: "youtube",
      channelUrl: "https://youtube.com/results?search_query=OpenHD+review",
      description: "Independent reviewers showcasing OpenHD setups and experiences",
      avatar: "https://images.opencollective.com/guest/avatar/128.png"
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [financial, code] = await Promise.all([
        fetchFinancialContributors(),
        fetchCodeContributors()
      ]);
      setFinancialContributors(financial);
      setCodeContributors(code);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const communityHeroes = getCommunityHeroes();
  const contentCreators = getContentCreators();

  return (
    <Layout
      title="Help Us - Balanced Contributor Recognition"
      description="Supporting OpenHD through code, community, content, and financial contributions"
    >
      <Head>
        <meta property="og:title" content="Help Us - Balanced Contributor Recognition" />
        <meta property="og:description" content="Supporting OpenHD through code, community, content, and financial contributions" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className={styles.helpUsPage}>
        {/* Hero Section - reusing original hero style */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Support the <span className={styles.accent}>OpenHD</span> Ecosystem
              </h1>
              <p className={styles.heroSubtitle}>
                OpenHD thrives thanks to our diverse community of contributors. 
                Every contribution matters - whether it's code, community support, content creation, or financial backing.
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation - using original help grid style */}
        <section className={styles.waysToHelp}>
          <div className="container">
            <h2>Choose Your Way to Contribute</h2>
            <div className={styles.helpGrid}>
              <div 
                className={`${styles.helpCard} ${activeTab === 'financial' ? styles.activeCard : ''}`}
                onClick={() => setActiveTab('financial')}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.helpIcon}>
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Financial Support</h3>
                <p>One-time donations or monthly contributions to support development and infrastructure.</p>
              </div>

              <div 
                className={`${styles.helpCard} ${activeTab === 'code' ? styles.activeCard : ''}`}
                onClick={() => setActiveTab('code')}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.helpIcon}>
                  <i className="fas fa-code"></i>
                </div>
                <h3>Code Contributions</h3>
                <p>Developers who build, maintain, and improve OpenHD's codebase across all repositories.</p>
              </div>

              <div 
                className={`${styles.helpCard} ${activeTab === 'community' ? styles.activeCard : ''}`}
                onClick={() => setActiveTab('community')}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.helpIcon}>
                  <i className="fas fa-users"></i>
                </div>
                <h3>Community Heroes</h3>
                <p>Moderators, testers, and support champions who help newcomers and maintain quality.</p>
              </div>

              <div 
                className={`${styles.helpCard} ${activeTab === 'content' ? styles.activeCard : ''}`}
                onClick={() => setActiveTab('content')}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.helpIcon}>
                  <i className="fas fa-video"></i>
                </div>
                <h3>Content Creators</h3>
                <p>YouTubers, bloggers, and educators creating valuable OpenHD tutorials and content.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections - reusing original contributors section style */}
        {activeTab === 'financial' && (
          <section className={styles.contributorsSection}>
            <div className="container">
              <h2>💰 Financial Contributors</h2>
              <p className={styles.contributorsSubtitle}>
                Supporting OpenHD's infrastructure, development tools, and hardware testing
              </p>
              
              {/* Stats Grid - reusing original style */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>1620€</div>
                  <div className={styles.statLabel}>Total Raised</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>48</div>
                  <div className={styles.statLabel}>Contributors</div>
                </div>
              </div>
              
              {/* Contributors Grid - reusing original style */}
              <div className={styles.contributorsGrid}>
                {financialContributors.map((contributor, index) => (
                  <div key={contributor.id} className={styles.contributorCard}>
                    <img 
                      src={`https://images.opencollective.com/guest/avatar/128.png`}
                      alt={contributor.name}
                      className={styles.contributorAvatar}
                    />
                    <div className={styles.contributorName}>{contributor.name}</div>
                    <div className={styles.contributorAmount}>
                      {contributor.totalAmountDonated}€
                      <span className={styles.monthlyBadge}>{contributor.tier}</span>
                    </div>
                    <div className={styles.contributorSince}>
                      Since January 2024
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.viewAllContributors}>
                <a href="https://opencollective.com/openhd" target="_blank" rel="noopener noreferrer">
                  Donate via OpenCollective →
                </a>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'code' && (
          <section className={styles.contributorsSection}>
            <div className="container">
              <h2>💻 Code Contributors</h2>
              <p className={styles.contributorsSubtitle}>
                Developers who build, maintain, and improve OpenHD's codebase
              </p>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>2650</div>
                  <div className={styles.statLabel}>Total Commits</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>15</div>
                  <div className={styles.statLabel}>Active Developers</div>
                </div>
              </div>
              
              <div className={styles.contributorsGrid}>
                {codeContributors.map((contributor, index) => (
                  <div key={index} className={styles.contributorCard}>
                    <img 
                      src={contributor.avatar_url}
                      alt={contributor.name || contributor.login}
                      className={styles.contributorAvatar}
                    />
                    <div className={styles.contributorName}>
                      <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                        {contributor.name || contributor.login}
                      </a>
                    </div>
                    <div className={styles.contributorAmount}>
                      {contributor.contributions} contributions
                    </div>
                    <div className={styles.contributorSince}>
                      GitHub Developer
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.viewAllContributors}>
                <a href="https://github.com/OpenHD" target="_blank" rel="noopener noreferrer">
                  View on GitHub →
                </a>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'community' && (
          <section className={styles.contributorsSection}>
            <div className="container">
              <h2>👥 Community Heroes</h2>
              <p className={styles.contributorsSubtitle}>
                Moderators, testers, and support champions who keep our community thriving
              </p>
              
              <div className={styles.contributorsGrid}>
                {communityHeroes.map((hero, index) => (
                  <div key={index} className={styles.contributorCard}>
                    <img 
                      src={`https://images.opencollective.com/guest/avatar/128.png`}
                      alt={hero.name}
                      className={styles.contributorAvatar}
                    />
                    <div className={styles.contributorName}>{hero.name}</div>
                    <div className={styles.contributorAmount}>
                      {hero.role}
                    </div>
                    <div className={styles.contributorSince}>
                      {hero.platform} • {hero.contributions.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.viewAllContributors}>
                <a href="https://discord.gg/openhd" target="_blank" rel="noopener noreferrer">
                  Join Discord Community →
                </a>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'content' && (
          <section className={styles.contributorsSection}>
            <div className="container">
              <h2>🎥 Content Creators</h2>
              <p className={styles.contributorsSubtitle}>
                YouTubers, bloggers, and educators who create valuable OpenHD content
              </p>
              
              <div className={styles.contributorsGrid}>
                {contentCreators.map((creator, index) => (
                  <div key={index} className={styles.contributorCard}>
                    <img 
                      src={`https://images.opencollective.com/guest/avatar/128.png`}
                      alt={creator.name}
                      className={styles.contributorAvatar}
                    />
                    <div className={styles.contributorName}>{creator.name}</div>
                    <div className={styles.contributorAmount}>
                      {creator.platform}
                      {creator.subscribers && ` • ${creator.subscribers.toLocaleString()} subscribers`}
                    </div>
                    <div className={styles.contributorSince}>
                      {creator.description}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.viewAllContributors}>
                <a href="mailto:content@openhd.org">
                  Become a Content Creator →
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action - reusing original other ways section */}
        <section className={styles.otherWaysSection}>
          <div className="container">
            <h2>Ready to Support OpenHD?</h2>
            <div className={styles.otherWaysGrid}>
              <div className={styles.wayCard}>
                <div className={styles.wayIcon}>
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Donate</h3>
                <p>Support infrastructure and development with financial contributions.</p>
                <a href="https://opencollective.com/openhd" target="_blank" rel="noopener noreferrer" className={styles.wayButton}>
                  <i className="fas fa-external-link-alt"></i>
                  Donate Now
                </a>
              </div>

              <div className={styles.wayCard}>
                <div className={styles.wayIcon}>
                  <i className="fas fa-code"></i>
                </div>
                <h3>Contribute Code</h3>
                <p>Help build the future of OpenHD by contributing to our repositories.</p>
                <a href="https://github.com/OpenHD" target="_blank" rel="noopener noreferrer" className={styles.wayButton}>
                  <i className="fab fa-github"></i>
                  View GitHub
                </a>
              </div>

              <div className={styles.wayCard}>
                <div className={styles.wayIcon}>
                  <i className="fas fa-users"></i>
                </div>
                <h3>Join Community</h3>
                <p>Help others and share knowledge in our Discord and forums.</p>
                <a href="https://discord.gg/openhd" target="_blank" rel="noopener noreferrer" className={styles.wayButton}>
                  <i className="fab fa-discord"></i>
                  Join Discord
                </a>
              </div>

              <div className={styles.wayCard}>
                <div className={styles.wayIcon}>
                  <i className="fas fa-video"></i>
                </div>
                <h3>Create Content</h3>
                <p>Make tutorials and educational content about OpenHD.</p>
                <a href="mailto:content@openhd.org" className={styles.wayButton}>
                  <i className="fas fa-envelope"></i>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

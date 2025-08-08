import React from 'react';
import GitHubStars from '@site/src/components/GitHubStars';

export default function CustomGitHubStarsNavbarItem() {
  return (
    <GitHubStars
      repo="OpenHD/OpenHD"
      className="navbar-github-stars"
      showIcon={true}
      showText={typeof window !== 'undefined' ? window.innerWidth > 768 : true}
    />
  );
}
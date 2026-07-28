import { useState, useEffect } from 'react';
import { content } from '../content';

type HeaderProps = {
  onPendingClick: () => void;
};

export default function Header({ onPendingClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <h1 className="logo-text">{content.header.name}</h1>

        <nav className="nav-links">
          <a href="#projects" onClick={onPendingClick}>Projects</a>
          <a href="#yapping" onClick={onPendingClick}>Yapping</a>
          <a className="gh-link" href={content.header.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
          <a className="resume-link" href={content.header.resumeHref} target="_blank" rel="noreferrer">Resume</a>
        </nav>
      </div>
    </header>
  );
}
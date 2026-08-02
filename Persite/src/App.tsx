import { useState } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import DemoBox from './components/DemoBox';
import Typewriter from './components/Typewriter';
import Notice from './components/Notice';
import { content } from './content';
import { activeDemo } from './demos';
import { useNowPlaying } from './hooks/useNowPlaying';
import './App.css';

export default function App() {
  const { hero, about, spotify, projects, yapping, footer } = content;
  const ActiveDemo = activeDemo?.component;

  const [noticeId, setNoticeId] = useState(0);
  const showNotice = () => setNoticeId((n) => n + 1);
  const nowPlaying = useNowPlaying();
  const track = nowPlaying.status === 'ok' && nowPlaying.data.track ? nowPlaying.data : null;
  const spotifyTitle =
  nowPlaying.status !== 'ok'
    ? spotify.titleUnknown
    : track?.playing
      ? spotify.title
      : spotify.titleIdle;
  return (
    <>
      <Header onPendingClick={showNotice} />

      <main>
        <section className="hero" id="home">
          <Typewriter text={hero.tagline} />
        </section>

        <div className="card-grid">
          <Card title={projects.title} id="projects" className="area-projects">
            {ActiveDemo ? <ActiveDemo /> : <DemoBox label={projects.demoLabel} />}
            <ul className="project-list">
              {projects.list.map((project) => (
                <li key={project.name}>
                  <span className="project-name">{project.name}</span>
                  <span className="project-desc">{project.desc}</span>
                  <span className="project-status">{project.status}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title={about.title} id="about" className="area-about">
            {about.body.map((item, i) =>
              Array.isArray(item) ? (
                <ul className="about-list" key={i}>
                  {item.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p key={item}>{item}</p>
              )
            )}
          </Card>
          <Card title={spotifyTitle} className="area-spotify">
            {track ? (
              <div className="now-playing">
                {track.albumArt && (
                  <div className="now-playing-frame">
                    <img className="now-playing-art" src={track.albumArt} alt="" width={64} height={64} />
                  </div>
                )}
                <div className="now-playing-meta">
                  <p className="now-playing-track">
                    <span className={`now-playing-dot ${track.playing ? '' : 'now-playing-dot--idle'}`} aria-hidden="true" />
                    <a className="card-link" href={track.url ?? undefined} target="_blank" rel="noreferrer">{track.track}</a>
                  </p>
                  <p className="now-playing-artist">By: {track.artist}</p>
                  {track.album && <p className="now-playing-album">on {track.album}</p>}
                </div>
              </div>
            ) : (
              <p className="now-playing-empty">
                <span className={`now-playing-dot ${nowPlaying.status === 'loading' ? '' : 'now-playing-dot--idle'}`} aria-hidden="true" />
                {nowPlaying.status === 'loading' ? spotify.loading : spotify.placeholder}
              </p>
            )}
          </Card>
            <Card title={yapping.title} id="yapping" className="area-yapping">
              <p>{yapping.body}</p>
                <p>
                  <a className="card-link" href="#yapping" onClick={(e) => { e.preventDefault(); showNotice(); }}>
                  {yapping.linkText}
                  </a>
                </p>
            </Card>
        </div>
      </main>

      <footer className="footer">
        <p className="footer-quip">{footer.quip}</p>
        <p className="footer-copy">{footer.copyright}</p>
      </footer>

      {noticeId > 0 && (
        <Notice
          key={noticeId}
          message={content.notice.message}
          onDismiss={() => setNoticeId(0)}
        />
      )}
    </>
  );
}
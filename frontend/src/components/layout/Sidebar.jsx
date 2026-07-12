// components/layout/Sidebar.jsx — pixel-perfect YT dark sidebar
// Mini icon-rail (72px) on desktop; full 240px drawer on mobile/when open
import { NavLink, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth.js";

/* ─── Icons ─────────────────────────────────────────────────── */
// ... (all your icons remain exactly as you have them)

/* ─── Reusable nav item wrapper ─────────────────────────────── */
function SidebarNavItem({ to, icon, miniLabel, fullLabel, end = false, onClick }) {
  const cls = ({ isActive }) =>
    `yt-sidebar__item${isActive ? " yt-sidebar__item--active" : ""}`;

  if (to) {
    return (
      <NavLink to={to} className={cls} end={end} onClick={onClick}>
        {icon}
        <span className="yt-sidebar__item-mini-label">{miniLabel}</span>
        <span className="yt-sidebar__item-label">{fullLabel}</span>
      </NavLink>
    );
  }
  return (
    <div className="yt-sidebar__item" onClick={onClick}>
      {icon}
      <span className="yt-sidebar__item-mini-label">{miniLabel}</span>
      <span className="yt-sidebar__item-label">{fullLabel}</span>
    </div>
  );
}

SidebarNavItem.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.node.isRequired,
  miniLabel: PropTypes.string.isRequired,
  fullLabel: PropTypes.string.isRequired,
  end: PropTypes.bool,
  onClick: PropTypes.func,
};

function Sidebar({ isOpen, onClose }) {
  const { isAuthed, user } = useAuth();
  const subscribedChannels = user?.subscribedChannels || [];
  const closeOnNavigate = isOpen ? onClose : undefined;

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          role="button"
          aria-label="Close sidebar"
          tabIndex={-1}
        />
      )}

      <aside className={`yt-sidebar${isOpen ? " yt-sidebar--open" : ""}`}>
        <div className="yt-sidebar__scroll">

          {/* ── Top nav ── */}
          <SidebarNavItem to="/"       icon={<HomeIcon />}   miniLabel="Home"   fullLabel="Home"   end onClick={closeOnNavigate} />
          <SidebarNavItem to="/shorts" icon={<ShortsIcon />} miniLabel="Shorts" fullLabel="Shorts"     onClick={closeOnNavigate} />
          {isAuthed && (
            <SidebarNavItem to="/subscriptions" icon={<SubsIcon />} miniLabel="Subscriptions" fullLabel="Subscriptions" onClick={closeOnNavigate} />
          )}

          {/* ── Divider + You section ── */}
          <div className="yt-sidebar__divider" />

          <div className="yt-sidebar__section-header">
            <span>You</span>
            <ChevronRight />
          </div>

          {isAuthed ? (
            <>
              <SidebarNavItem to="/channel/me" icon={<YouIcon />}       miniLabel="You"         fullLabel="Your channel"  onClick={closeOnNavigate} />
              <SidebarNavItem to="/history"    icon={<HistoryIcon />}   miniLabel="History"     fullLabel="History"       onClick={closeOnNavigate} />
              <SidebarNavItem to="/playlists"  icon={<PlaylistIcon />}  miniLabel="Playlists"   fullLabel="Playlists"     onClick={closeOnNavigate} />
              <SidebarNavItem to="/watch-later"icon={<WatchLaterIcon />}miniLabel="Watch later" fullLabel="Watch later"   onClick={closeOnNavigate} />
              <SidebarNavItem to="/liked"      icon={<LikedIcon />}     miniLabel="Liked"       fullLabel="Liked videos"  onClick={closeOnNavigate} />
              <SidebarNavItem to="/your-videos"icon={<YourVideosIcon />}miniLabel="Your videos" fullLabel="Your videos"   onClick={closeOnNavigate} />
              <SidebarNavItem to="/downloads"  icon={<DownloadsIcon />} miniLabel="Downloads"   fullLabel="Downloads"     onClick={closeOnNavigate} />
            </>
          ) : (
            <div className="yt-sidebar__signin-card">
              <p>Sign in to like videos, comment, and subscribe.</p>
              <Link to="/login" className="yt-sidebar__signin-btn" onClick={closeOnNavigate}>
                <SignInIcon />
                <span>Sign in</span>
              </Link>
            </div>
          )}

          {/* ── Subscriptions shelf ── */}
          {isAuthed && subscribedChannels.length > 0 && (
            <>
              <div className="yt-sidebar__divider" />
              <div className="yt-sidebar__section-header">
                <span>Subscriptions</span>
              </div>

              {subscribedChannels.map((ch) => (
                <Link
                  key={ch._id}
                  to={`/channel/${ch._id}`}
                  className="yt-sidebar__item yt-sidebar__item--channel"
                  onClick={closeOnNavigate}
                >
                  <div className="yt-sidebar__ch-avatar">
                    {ch.avatar
                      ? <img src={ch.avatar} alt={ch.channelName} />
                      : (ch.channelName?.[0]?.toUpperCase() || "C")}
                  </div>
                  <span className="yt-sidebar__item-mini-label" style={{ display: "none" }}></span>
                  <span className="yt-sidebar__item-label yt-sidebar__ch-name">{ch.channelName}</span>
                </Link>
              ))}
            </>
          )}

          {/* ── Explore ── */}
          <div className="yt-sidebar__divider" />
          <div className="yt-sidebar__section-header"><span>Explore</span></div>

          <SidebarNavItem icon={<ShoppingIcon />} miniLabel="Shopping" fullLabel="Shopping" />
          <SidebarNavItem icon={<MusicIcon />}    miniLabel="Music"    fullLabel="Music"    />
          <SidebarNavItem icon={<MoviesIcon />}   miniLabel="Movies"   fullLabel="Movies"   />

          {/* ── More from YouTube ── */}
          <div className="yt-sidebar__divider" />
          <div className="yt-sidebar__section-header"><span>More from YouTube</span></div>

          <div className="yt-sidebar__item">
            <span className="yt-sidebar__yt-icon">
              <svg viewBox="0 0 90 20" height="14" width="32">
                <g>
                  <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                  <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
                </g>
              </svg>
            </span>
            <span className="yt-sidebar__item-mini-label" style={{ display: "none" }}></span>
            <span className="yt-sidebar__item-label">YouTube Premium</span>
          </div>

          <div className="yt-sidebar__item">
            <ReportIcon />
            <span className="yt-sidebar__item-mini-label">Report</span>
            <span className="yt-sidebar__item-label">Report history</span>
          </div>

          {/* ── Footer ── */}
          <div className="yt-sidebar__divider" />

          <div className="yt-sidebar__footer">
            <p>About Press Copyright Contact us Creators</p>
            <p>Advertise Developers</p>
            <br />
            <p>Terms Privacy Policy &amp; Safety</p>
            <p>How YouTube works</p>
            <p>Test new features</p>
            <br />
            <p>© 2025 Google LLC</p>
          </div>

        </div>
      </aside>
    </>
  );
}

// PropTypes for better type safety
Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
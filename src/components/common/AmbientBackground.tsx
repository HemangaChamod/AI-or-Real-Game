export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="ambient__orb ambient__orb--one" />
      <span className="ambient__orb ambient__orb--two" />
      <span className="ambient__grid" />
      <span className="ambient__noise" />
      <span className="ambient__vignette" />
      <span className="particle-field">
        {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
      </span>
    </div>
  );
}

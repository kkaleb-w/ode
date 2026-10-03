/**
 * Two layers, deliberately split:
 *  - the vignette sits UNDER the furniture, so the corners of the photograph go
 *    quiet without dimming the words that live in them;
 *  - the grain sits OVER everything, low opacity, so the desk reads as one
 *    photograph rather than a UI laid on top of one.
 *
 * The fireflies are their own component: they need the wind, so they cannot live
 * in a layer that never changes.
 */
export function Grain() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_92%_at_70%_44%,transparent_38%,rgba(3,4,7,0.55)_100%)]" />
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
        <div className="grain absolute inset-0 opacity-[0.15] mix-blend-soft-light" />
      </div>
    </>
  );
}

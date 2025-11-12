export default function Header() {
  return (
    <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <img
        src="/fabricpop-logo.png"
        alt="FabricPop Logo"
        className="logo"
        style={{ margin: '0 auto 1rem' }}
      />
      <h1 className="gradient-text">
        FabricPop
      </h1>
      <p><strong>REEL Reviews, REAL People</strong></p>
      <p style={{ color: 'var(--pico-muted-color)' }}>
        The blockchain-verified review platform
      </p>
    </header>
  )
}

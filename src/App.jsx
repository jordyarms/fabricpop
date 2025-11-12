import { useState } from 'react'
import Header from './components/Header'
import WalletConnect from './components/WalletConnect'
import ReviewWorkflow from './components/ReviewWorkflow'

function App() {
  const [account, setAccount] = useState(null)

  return (
    <main className="container">
      <Header />

      <WalletConnect account={account} setAccount={setAccount} />

      {account && (
        <article>
          <ReviewWorkflow account={account} />
        </article>
      )}

      {!account && (
        <article>
          <hgroup>
            <h2>Welcome to FabricPop</h2>
            <p>Connect your wallet to start creating blockchain-verified reviews</p>
          </hgroup>
          <p>
            <strong>REEL Reviews, REAL People.</strong>
          </p>
          <p>
            Create verifiable reviews for movies, TV shows, and video games.
            All reviews are recorded on the blockchain for transparency and authenticity.
          </p>
          <ul>
            <li>🎬 Review movies and TV shows via TMDB</li>
            <li>🎮 Review video games via IGDB</li>
            <li>⭐ Flexible rating systems (stars, scores, grades)</li>
            <li>🔗 Link to your published reviews</li>
            <li>⛓️ Blockchain verification for authenticity</li>
          </ul>
        </article>
      )}

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--pico-muted-border-color)', textAlign: 'center' }}>
        <small>
          FabricPop — Built with ❤️ for the review community<br/>
          <a href="https://github.com/adamogallo/fabricpop" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </small>
      </footer>
    </main>
  )
}

export default App

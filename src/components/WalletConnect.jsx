import { useState } from 'react'
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp'

export default function WalletConnect({ account, setAccount }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const connectWallet = async () => {
    setLoading(true)
    setError(null)

    try {
      const extensions = await web3Enable('FabricPop')

      if (extensions.length === 0) {
        setError('No Polkadot wallet extension found. Please install Talisman or Polkadot.js.')
        setLoading(false)
        return
      }

      const accounts = await web3Accounts()

      if (accounts.length === 0) {
        setError('No accounts found in wallet.')
        setLoading(false)
        return
      }

      setAccount(accounts[0])
    } catch (err) {
      console.error('Connection error:', err)
      setError('Failed to connect wallet. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setError(null)
  }

  if (account) {
    return (
      <article style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Connected Wallet</strong>
            <p style={{ margin: '0.5rem 0 0', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>
              {account.address}
            </p>
            {account.meta?.name && (
              <p style={{ margin: '0.25rem 0 0', color: 'var(--pico-muted-color)' }}>
                {account.meta.name}
              </p>
            )}
          </div>
          <button onClick={disconnectWallet} className="secondary">
            Disconnect
          </button>
        </div>
      </article>
    )
  }

  return (
    <article style={{ marginBottom: '2rem' }}>
      <hgroup>
        <h3>Connect Your Wallet</h3>
        <p>Connect a Polkadot wallet to create blockchain-verified reviews</p>
      </hgroup>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'var(--pico-del-background)', color: 'var(--pico-del-color)', borderRadius: 'var(--pico-border-radius)' }}>
          {error}
          {error.includes('No Polkadot wallet') && (
            <p style={{ marginTop: '0.5rem' }}>
              Install: <a href="https://talisman.xyz" target="_blank" rel="noopener noreferrer">Talisman</a> or <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">Polkadot.js</a>
            </p>
          )}
        </div>
      )}

      <button onClick={connectWallet} disabled={loading} aria-busy={loading}>
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </article>
  )
}

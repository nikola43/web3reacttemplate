import './App.css';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { injected } from './blockchain/metamaskConnector';


function App() {
  const { active, account, library, activate, deactivate, chainId } =
    useWeb3React();

  useEffect(() => {
    const isWalletConnected = localStorage.getItem('isWalletConnected');
    const connector = localStorage.getItem('connector');
    if (isWalletConnected === 'true' && connector === 'injected') {
      activate(injected);
    }
  }, [active]);

  useEffect(() => {
    console.log({ chainId });
  }, [chainId]);

  async function connectMetamaks() {
    try {
      await activate(injected, undefined, true);
      localStorage.setItem("connector", "injected");
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }

  function getWalletAbreviation(walletAddress: string | null | undefined): string {
    if (walletAddress !== null && walletAddress !== undefined) {
      return walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
    }
    return ""
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", "false");
      localStorage.removeItem("connector");
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              News
            </Typography>
            <Button color="inherit" onClick={active ? disconnect : connectMetamaks}>        {active ? (
              <span>
                Connected <b> {getWalletAbreviation(account)}</b>
              </span>
            ) : (
              <span>Connect Wallet</span>
            )}</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}



export default App;

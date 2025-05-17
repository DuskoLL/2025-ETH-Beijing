import * as React from 'react';
import { Connector, useConnect } from 'wagmi';
import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function WalletOptions({ buttonStyle = 'default' }: { buttonStyle?: 'default' | 'navbar' }) {
  const { connectors, connect, status, error } = useConnect();
  const [open, setOpen] = React.useState(buttonStyle !== 'navbar');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (buttonStyle === 'navbar' && !open) {
    return (
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleOpen}
        sx={{
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
          '&:hover': {
            background: 'linear-gradient(90deg, #2b68c0, #00b3db)',
          }
        }}
      >
        连接钱包
      </Button>
    );
  }

  const walletContent = (
    <Box sx={{ width: '100%' }}>
      {buttonStyle === 'navbar' && (
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">选择钱包</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      {buttonStyle !== 'navbar' && (
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
          连接钱包
        </Typography>
      )}
      <Stack spacing={2} sx={{ p: 2 }}>
        {connectors.map((connector) => (
          <WalletOption
            key={connector.uid}
            connector={connector}
            onClick={() => {
              connect({ connector });
              if (buttonStyle === 'navbar') handleClose();
            }}
          />
        ))}
      </Stack>
      {status === 'pending' && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>连接中...</Typography>
      )}
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error.message}
        </Typography>
      )}
    </Box>
  );

  if (buttonStyle === 'navbar') {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          {walletContent}
        </DialogContent>
      </Dialog>
    );
  }

  return walletContent;
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const provider = await connector.getProvider();
        setReady(!!provider);
      } catch (error) {
        console.error('Error getting provider:', error);
        setReady(false);
      }
    })();
  }, [connector]);

  return (
    <Button
      variant="outlined"
      disabled={!ready}
      onClick={onClick}
      fullWidth
      sx={{
        p: 2,
        borderRadius: '12px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
      }}
    >
      {connector.name}
    </Button>
  );
}

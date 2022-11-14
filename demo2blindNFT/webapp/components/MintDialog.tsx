import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { MintDialogStatus } from '../constants';

const MintDialog = ({ isShowDialog, dialogStatus, setShowDialog}: { isShowDialog: boolean, dialogStatus: string, setShowDialog: () => void  }) => {
    
    const MintDialogTitle = {
        [MintDialogStatus.SUCCESS]: "Mint Succeeded",
        [MintDialogStatus.FAILURE]: "Mint Failed",
        [MintDialogStatus.CONNECT_WALLET_FAILED]: "Connect Wallet failed",
    }
    
    const MintDialogContent = {
        [MintDialogStatus.SUCCESS]: "Congratulations! You have successfully minted an NFT, click 'CONFIRM' to check it in your OpenSea collections.",
        [MintDialogStatus.FAILURE]: "Something went wrong, please try again.",
        [MintDialogStatus.CONNECT_WALLET_FAILED]: "Connect MetaMask failed, please check if your MetaMask extension is installed.",
    }

    const handleDialogClose = () => {
        setShowDialog(false);
      };
    
    const handleDialogConfirm = () => {
        (dialogStatus === MintDialogStatus.SUCCESS) && window.open("https://testnets.opensea.io/zh-CN/account?tab=collected","_blank");
        handleDialogClose();
    }

    return (
      <Dialog
        open={isShowDialog}
        onClose={handleDialogClose}
        aria-labelledby="dialog-mint"
        aria-describedby="results for dialog-mint"
      >
        <DialogTitle id="dialog-mint-title">
          {MintDialogTitle[dialogStatus]}
          {/* {MintDialogTitle[currentStatus]} */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-mint-description">
            {MintDialogContent[dialogStatus]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default MintDialog;

import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const MintDialog = ({ isShowDialog, isShowSuccess, setShowDialog}: { isShowDialog: boolean, isShowSuccess: boolean, setShowDialog: () => void  }) => {

    const MintDialogStatus = {
        SUCCESS: 'SUCCESS',
        FAILURE: 'FAILURE',
    }
    
    const MintDialogTitle = {
        [MintDialogStatus.SUCCESS]: "Mint Succeeded",
        [MintDialogStatus.FAILURE]: "Mint Failed",
    }
    
    const MintDialogContent = {
        [MintDialogStatus.SUCCESS]: "Congratulations! You have successfully minted an NFT, click 'CONFIRM' to check it in your OpenSea collections.",
        [MintDialogStatus.FAILURE]: "Something went wrong, please try again.",
    }

    const handleDialogClose = () => {
        setShowDialog(false);
      };
    
    const handleDialogConfirm = () => {
    isShowSuccess && window.open("https://testnets.opensea.io/zh-CN/collections","_blank");
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
          {isShowSuccess ? MintDialogTitle[MintDialogStatus.SUCCESS] : MintDialogTitle[MintDialogStatus.FAILURE]}
          {/* {MintDialogTitle[currentStatus]} */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-mint-description">
            {isShowSuccess ? MintDialogContent[MintDialogStatus.SUCCESS] : MintDialogContent[MintDialogStatus.FAILURE]}
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

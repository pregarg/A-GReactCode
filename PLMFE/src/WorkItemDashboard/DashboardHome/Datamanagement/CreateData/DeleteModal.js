import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function DeleteModal({
  openDialog,
  closeDialog,
  deleteFunc,
  id,
}) {
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do You Want To Delete This Table?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="outlined" onClick={closeDialog}>
            No
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => deleteFunc(id)}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

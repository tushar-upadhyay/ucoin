import React,{useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(props.open);
  const [clicked,updateClicked] = React.useState(false);
  useEffect(()=>{
    setOpen(props.open)
  })
    
  const handleClose = () => {
    if(props.handleClose){
      props.handleClose();
    }
    setOpen(false);
    props.history.replace('/login');
  };
  const handleResendLink = async()=>{
    if(!clicked){
    updateClicked(true)
    let result = await props.resendEmail();
    console.log(result);
    if(result=='sent'){
    updateClicked(false)
    setOpen(false);
    alert('Email Resent!')
    props.handleClose();
    }
    else{
      setOpen(false);
      props.handleClose();
      updateClicked(false);
      alert(result)
    }

  }
  }
  function renderLoading(){
    if(clicked){
      return <div>Resending...</div>
    }
    
  }
  function renderButtons(){
    if(props.resend){
      return (
        <React.Fragment>
        <Button onClick={handleClose} color="primary">
            Login
          </Button>
          <Button onClick={handleResendLink} color="primary">
            Resend Link?
          </Button>
          </React.Fragment>
      )
    }
    else{
      return (
        <Button onClick={handleClose} color="primary">
            Login
          </Button>
      )
    }
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.discription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {renderButtons()}
          {renderLoading()}
        </DialogActions>
      </Dialog>
    </div>
  );
}
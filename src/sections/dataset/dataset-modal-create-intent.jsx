import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createDataset, updateDataset } from 'src/services/dataset-service';

const DatasetModalCreateIntent = (props) => {
  const { handleAddIntent } = props;

  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (props.data) {
      setValue('intent', props.data.intent);
    }
  }, [props.data]);

  const onSubmit = async (data) => {
    handleAddIntent(data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    props.setOpenCreateModal(false);
  };

  return (
    <Dialog
      open={props.openCreateModal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create New Intent</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Controller
            name="intent"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[^\s]+$/,
                message: 'This field should not contain spaces',
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="intent"
                label="Intent"
                type="text"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

DatasetModalCreateIntent.propTypes = {
  openCreateModal: PropTypes.bool,
  setOpenCreateModal: PropTypes.func,
  refresh: PropTypes.func,
  data: PropTypes.object,
  handleAddIntent: PropTypes.func,
};

export default DatasetModalCreateIntent;
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 2 }}>
      <Typography variant='h6' sx={{ marginBottom: 2 }}>
        ¿Está seguro de que desea eliminar esta factura?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant='outlined' onClick={onClose}>
          Cancelar
        </Button>
        <Button variant='contained' color='error' onClick={onConfirm}>
          Eliminar
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default ConfirmDeleteModal;

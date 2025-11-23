import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const DeleteConfirmationModal = ({
  open,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmButtonColor = "error",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#040195",
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <Delete sx={{ color: "#FF4D4D" }} />
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          sx={{
            color: "#555",
            fontSize: "1rem",
            marginBottom: "0.5rem",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {message}
        </DialogContentText>
        {itemName && (
          <DialogContentText
            sx={{
              color: "#4D49FC",
              fontSize: "0.95rem",
              fontWeight: "600",
              marginTop: "0.75rem",
              padding: "0.75rem",
              backgroundColor: "#F0F0FF",
              borderRadius: "8px",
              borderLeft: "3px solid #4D49FC",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Item: <strong>{itemName}</strong>
          </DialogContentText>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          padding: "1.5rem",
          gap: 1,
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onCancel}
          disabled={isLoading}
          variant="outlined"
          sx={{
            color: "#666",
            borderColor: "#ccc",
            textTransform: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#999",
            },
            fontFamily: "Inter, sans-serif",
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          color={confirmButtonColor}
          sx={{
            textTransform: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            backgroundColor:
              confirmButtonColor === "error" ? "#FF4D4D" : undefined,
            "&:hover": {
              backgroundColor:
                confirmButtonColor === "error" ? "#E63939" : undefined,
            },
            "&:disabled": {
              backgroundColor: "#ccc",
              color: "#999",
            },
            fontFamily: "Inter, sans-serif",
          }}
        >
          {isLoading ? `${confirmButtonText}...` : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  itemName: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  confirmButtonColor: PropTypes.string,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
};

export default DeleteConfirmationModal;

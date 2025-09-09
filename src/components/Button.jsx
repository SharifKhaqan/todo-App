import { Button } from "@mui/material";

export default function CustomButton({ text, type = "button", onClick, disabled = false }) {
  return (
    <Button
      fullWidth
      variant="contained"
      type={type}
      onClick={onClick}
      disabled={disabled}   
      sx={{
        mt: 4,
        mb: 3,
        borderRadius: "12px",
        minHeight: "56px",
        fontSize: "18px",
        textTransform: "none",
        cursor: "pointer",
        py: 1,
        px: 4,
        backgroundColor: "#0B3B95",
      }}
    >
      {text}
    </Button>
  );
}

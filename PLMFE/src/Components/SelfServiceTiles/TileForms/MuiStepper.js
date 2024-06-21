import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { RxCross2 } from "react-icons/rx";
import { DialogTitle } from "@mui/material";

const steps = [
  "Starting File Read",
  "Checking Headers",
  "Checking Column Names",
  "Checking Values",
];

export default function MuiStepper({
  openStepper,
  onClose,
  currentStep,
  stepErrors,
}) {
  const isStepFailed = (stepIndex) => {
    return typeof stepErrors === "string" && stepIndex === currentStep;
  };

  return (
    <Dialog open={openStepper} onClose={onClose} maxWidth="lg">
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            ml: "auto",
          }}
        >
          <RxCross2 onClick={onClose} cursor="pointer" />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={currentStep}>
            {steps.map((label, index) => {
              const labelProps = {};
              if (isStepFailed(index)) {
                labelProps.optional = (
                  <Typography variant="caption" color="error">
                    {stepErrors}
                  </Typography>
                );

                labelProps.error = true;
              }

              return (
                <Step key={label}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

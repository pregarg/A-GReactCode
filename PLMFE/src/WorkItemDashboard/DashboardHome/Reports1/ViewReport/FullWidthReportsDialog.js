import * as React from "react";
import Dialog from "@mui/material/Dialog";

import { RxCross1 } from "react-icons/rx";

import Slide from "@mui/material/Slide";
import { Box, DialogContent } from "@mui/material";
import MaterialUiGrid from "../../../../Components/CommonComponents/MaterialUIGrid";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullWidthReportsDialog({
  handleClose,
  open,
  tableData,
  onlineTableColumns,
  ExportName,
}) {
  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box sx={{ ml: "auto", mr: 2, mt: 1 }}>
          <RxCross1 fontSize="26px" cursor="pointer" onClick={handleClose} />
        </Box>
        <DialogContent>
          <MaterialUiGrid
            data={tableData?.map((obj, index) => ({
              ...obj,
              repId: index + 1,
            }))}
            uniqueCol={"repId"}
            ExportName={ExportName}
            density="compact"
            columns={onlineTableColumns}
            handleCellClick={() => {}}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

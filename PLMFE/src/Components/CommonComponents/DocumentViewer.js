import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { memo } from "react";
import { IoClose } from "react-icons/io5";

const DocumentViewer = memo(function DocumentViewer({
  open,
  close,
  dialogViewData,
}) {
  const { url, fileType, fileName } = dialogViewData;
  const newDocs = {
    uri: url,
    fileType,
    fileName,
  };

  const docs = [newDocs];

  return (
    <Dialog open={open} onClose={close} maxWidth="lg" fullWidth>
      <DialogTitle>
        <IoClose
          style={{ cursor: "pointer", float: "right", fontSize: "25px" }}
          onClick={close}
        />
      </DialogTitle>
      <DialogContent>
        <DocViewer
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
              retainURLParams: false,
            },
            csvDelimiter: ",", // "," as default,
            pdfZoom: {
              defaultZoom: 1.1, // 1 as default,
              zoomJump: 0.2, // 0.1 as default,
            },
            pdfVerticalScrollByDefault: true, // false as default
          }}
          documents={docs}
          initialActiveDocument={docs[0]}
          pluginRenderers={DocViewerRenderers}
        />
      </DialogContent>
    </Dialog>
  );
});

export default DocumentViewer;

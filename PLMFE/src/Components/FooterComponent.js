import React from 'react'
import '../Components/FooterComponent.css'
import { useSelector } from 'react-redux';
import { Box, Typography } from "@mui/material";

export default function FooterComponent() {
  const headerFooterContent = useSelector(store => store.masterHeaderFooter);

  //console.log("headerFooterContent: ", headerFooterContent);
  let footerData = [];
  let footer = "";
  if (headerFooterContent !== undefined && headerFooterContent !== null && headerFooterContent.length > 0) {
    headerFooterContent[0].filter(data => data.contentType.toLowerCase() == "footer").map
      (val => footerData.push({ description: val.description }))
    //console.log("footerData: ", footerData);
    footer = footerData[0].description;
  }
  else {
    footer = "";
  }
  return (
    <>
      <footer className='footerStyle'>
        <div className="content-wrapper">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="subtitle1"></Typography>
          </Box>            </div>
      </footer>
    </>
  )
}

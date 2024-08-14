import React from "react";
import "./ViewReport.css";
import {
  Box,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Button } from "react-bootstrap";
import { MdClear } from "react-icons/md";
import useGetDBTables from "../../../../Components/CustomHooks/useGetDBTables";
import ReactDatePicker from "react-datepicker";
import { useSelector } from "react-redux";
function ViewReportForm(prop) {
  const mastersSelector = useSelector((masters) => masters);
  const [dropdownVals, setDropdownVals] = React.useState([]);
  const { extractDate, getDatePartOnly } = useGetDBTables();
  React.useEffect(() => {
    setDropdownVals([]);
  }, [prop?.reporName]);

  function ExtractGenricVals(resultArr, key) {
    return resultArr?.map((item) => item[key]);
  }
  let masterFields = prop?.ReportDef?.Report?.ReportInputFields["Field"]?.map(
    (item) => {
      if (item.Name === "UserName" && item?.MasterName?.length > 0) {
        let [masterName, masterKeyValue] = (item?.MasterName ?? "").split("~");
        item.DropDownValues = ExtractGenricVals(
          mastersSelector[masterName],
          masterKeyValue,
        )?.toString();
      } else if (item.Name === "STAGENAME" && item?.MasterName?.length > 0) {
        let [masterName, masterKeyValue] = (item?.MasterName ?? "").split("~");

        item.DropDownValues = ExtractGenricVals(
          mastersSelector[masterName][0],
          masterKeyValue,
        )?.toString();
      }
      return item;
    },
  );

  const handleChange = (event, index, name) => {
    const {
      target: { value },
    } = event;

    setDropdownVals((prevVals) => {
      const newVals = [...prevVals];
      newVals[index] = {
        name,
        value: typeof value === "string" ? value.split(",") : value,
      };
      return newVals;
    });
  };

  function MuiSelect(props) {
    const { dropdownVal, handleChange, handleClear } = props;

    return (
      <FormControl sx={{ m: 1, minWidth: "100%", p: 1 }} size="small">
        <InputLabel id={props.DisplayName}>{props.DisplayName}</InputLabel>
        <Select
          id={props.DisplayName}
          placeholder={props.DisplayName}
          value={dropdownVal || []}
          label={props.DisplayName}
          size="medium"
          multiple={props?.MultiSelection === "Y" ? true : false}
          onChange={handleChange}
          input={<OutlinedInput label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected?.length > 0 &&
                selected.map((value) => <Chip key={value} label={value} />)}
            </Box>
          )}
        >
          {props.DefaultDisplay === "Y" && (
            <MenuItem value={props.DefaultValue} key={props.DefaultValue}>
              <em>{props.DefaultValue}</em>
            </MenuItem>
          )}
          {props?.DropDownValues?.split(",")?.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {dropdownVal && dropdownVal.length > 0 && (
          <IconButton
            style={{
              position: "absolute",
              right: "35px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={handleClear}
          >
            <MdClear />
          </IconButton>
        )}
      </FormControl>
    );
  }
  const RenderDatePicker02 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder={props.name} />
      <label htmlFor="datePicker">{props.name}</label>
    </div>
  );
  function isValidDate(dateString) {
    const dateObject = new Date(dateString);
    return dateObject instanceof Date && !isNaN(dateObject.getTime());
  }
  return (
    <Grid item container spacing={2}>
      <Grid item md={12} display="flex">
        {masterFields.map((row, index) => (
          <Grid
            key={index}
            item
            md={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ml: 1,
            }}
          >
            {row.Type === "date" ? (
              <ReactDatePicker
                id="datePicker"
                className="form-control example-custom-input-provider"
                name={row.Name}
                selected={
                  dropdownVals[index]?.value
                    ? isValidDate(dropdownVals[index]?.value)
                      ? new Date(getDatePartOnly(dropdownVals[index]?.value))
                      : null
                    : null
                }
                onChange={(date) => {
                  if (date) {
                    let dateVal = extractDate(date);
                    handleChange(
                      { target: { value: dateVal } },
                      index,
                      row.Name,
                    );
                  } else {
                    handleChange({ target: { value: null } }, index, row.Name);
                  }
                }}
                isClearable
                dateFormat="MM/dd/yyyy"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                customInput={<RenderDatePicker02 name={row.Name} />}
              />
            ) : (
              <MuiSelect
                {...row}
                dropdownVal={dropdownVals?.[index]?.value || []}
                handleChange={(event) => handleChange(event, index, row.Name)}
                key={index}
                handleClear={(e) => handleChange(e, index, row.Name)}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <Grid
        item
        md={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
        }}
      >
        <Button
          onClick={() => {
            prop.submitForm(
              dropdownVals,
              prop.title,
              prop?.ReportDef?.Report?.ReportInputFields["Field"],
            );
          }}
        >
          Generate Report
        </Button>
      </Grid>
    </Grid>
  );
}

export default ViewReportForm;

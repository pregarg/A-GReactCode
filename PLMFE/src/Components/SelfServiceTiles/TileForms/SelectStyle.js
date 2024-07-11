export const selectStyle = {
  control: (provided) => ({
    ...provided,
    height: "58px",
    fontWeight: 300,
    color: 'hsl(0, 0%, 50%)'
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 200,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  container: (provided, state) => ({
    ...provided,
    marginTop: 0,
  }),
  valueContainer: (provided, state) => {
    if (state.getValue()?.length && state.getValue()[0].label && state.getValue()[0].value) {
      return {
        ...provided,
        position: "relative",
        top: 8,
        overflow: "visible",
        fontWeight: 300,
        color: 'hsl(0, 0%, 50%)'
      }
    }
    return {
      ...provided,
      overflow: "visible",
    }
  },
  placeholder: (provided, state) => {
    if (state.getValue()?.length && state.getValue()[0].label && state.getValue()[0].value) {
      return {
        ...provided,
        position: "absolute",
        top: -14,
        fontSize: 12,
        color: "#a1a3a5",
        fontWeight: 300,
        fontFamily: 'Open Sans, sans-serif'
    };
    }
    return {
      ...provided,
      position: "absolute",
      left: 0
    };
  },
  singleValue: (styles) => ({ ...styles, textAlign: 'left' }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
  }),
};
export const selectStyle = {
  control: (provided) => ({
    ...provided,
    height: "58px",
    fontWeight: 300,
    color: 'black'
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
        color: 'black'
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
        top: -10,
        fontSize: 12,
        color: "black",
        fontWeight: 300,
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
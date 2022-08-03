export const styles = {
  LoggedInMenu: {
    width: "90%",
    height: "90vh",
    backgroundColor: "rgba(23,22,44,255)",

    margin: "0 auto",
  },
  LoggedInMenuOptions: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  columns: {
    backgroundColor: "#2e2d41",

    minHeight: "90vh",
  },
  List: {
    overflow: "auto",
    backgroundColor: "rgba(23,22,44,255)",
    minHeight: "80vh",
    minWidth: "100%",
  },
  ContactName: {
    borderBottom: "2px solid rgba(255,255,255)",
    padding: "0.2rem",
    pointer: "cursor",
    textAlign: "left",
    fontSize: "1.3rem",
  },
  dropdown: {
    position: "relative",
    display: "inline-block",
  },
  dropdownContent: {
    display: "none",
    position: "absolute",

    minWidth: "160px",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    padding: "12px 16px",
    zIndex: "1",
  },

  dropdownContentHover: {
    display: "block",
    marginLeft: "-3rem",
    backgroundColor: "rgba(23,22,44,255)",
    position: "absolute",

    minWidth: "160px",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    padding: "12px 16px",
    zIndex: "1",
  },
};

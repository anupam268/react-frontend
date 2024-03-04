import React from "react";
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TextField from "@material-ui/core/TextField";
import TablePagination from "@material-ui/core/TablePagination";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "your_custom_color", // Replace with your custom color
    color: theme.palette.common.white,
  },
  filterInput: {
    marginLeft: theme.spacing(2),
  },
  pagination: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
  },
}));

function createData(name, calories, fat, carbs, protein, detail) {
  return { name, calories, fat, carbs, protein, detail };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0, "..."),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, "..."),
  createData("Eclair", 262, 16.0, 24, 6.0, "..."),
  createData("Cupcake", 305, 3.7, 67, 4.3, "..."),
  createData("Gingerbread", 356, 16.0, 49, 3.9, "..."),
].map((row, index) => ({ ...row, id: index, sort: row.name.toLowerCase() }));

const ExpandableTableRow = ({ children, expandComponent, ...otherProps }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      <TableRow
        {...otherProps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? "#f5f5f5" : "transparent", // Replace with your hover color
        }}
      >
        <TableCell padding="checkbox">
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell padding="checkbox" />
          {expandComponent}
        </TableRow>
      )}
    </>
  );
};

const SimpleTable = () => {
  const classes = useStyles();
  const [orderBy, setOrderBy] = React.useState("name");
  const [order, setOrder] = React.useState("asc");
  const [filter, setFilter] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2); // You can set your desired number of rows per page
  const [expandAll, setExpandAll] = React.useState(false);

  const headCells = [
    { id: "name", label: "Dessert (100g serving)" },
    { id: "calories", label: "Calories" },
    { id: "fat", label: "Fat (g)" },
    { id: "carbs", label: "Carbs (g)" },
    { id: "protein", label: "Protein (g)" },
  ];

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterChange = (event, property) => {
    setFilter({ ...filter, [property]: event.target.value });
  };

  const handleGlobalFilterChange = (event) => {
    setGlobalFilter(event.target.value);
  };

  const isRowMatchingGlobalFilter = (row) => {
    const rowValues = Object.values(row).join("").toLowerCase();
    return rowValues.includes(globalFilter.toLowerCase());
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const handleExpandAll = () => {
    setExpandAll((prevExpandAll) => !prevExpandAll);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableRow}>
              <TableCell colSpan={headCells.length + 1} align="right">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <TextField
                    label="Filter"
                    value={globalFilter}
                    onChange={handleGlobalFilterChange}
                    className={classes.filterInput}
                  />
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell padding="checkbox">
                <IconButton onClick={handleExpandAll}>
                  {expandAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  className={classes.tableCell}
                  key={headCell.id}
                  padding="checkbox"
                >
                  {headCell.id !== "protein" && (
                    <>
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                      {/* <TextField
                        label={`Filter ${headCell.label}`}
                        value={filter[headCell.id] || ""}
                        onChange={(e) => handleFilterChange(e, headCell.id)}
                      /> */}
                    </>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .filter((row) =>
                Object.keys(filter).every((key) =>
                  row[key]
                    .toString()
                    .toLowerCase()
                    .includes(filter[key].toLowerCase())
                )
              )
              .filter((row) => isRowMatchingGlobalFilter(row))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <ExpandableTableRow
                  key={row.name}
                  expandComponent={
                    <TableCell colSpan={headCells.length + 1}>
                      {row.detail}
                    </TableCell>
                  }
                  isExpanded={expandAll}
                >
                  {headCells.map((headCell) => (
                    <TableCell key={headCell.id} component="th" scope="row">
                      {row[headCell.id]}
                    </TableCell>
                  ))}
                </ExpandableTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={(event, newPage) => setPage(newPage)}
          onChangeRowsPerPage={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </ThemeProvider>
  );
};

export default SimpleTable;

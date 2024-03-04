import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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

import "./style.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  filterInput: {
    margin: theme.spacing(1),
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

  return (
    <>
      <TableRow {...otherProps}>
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

export default function SimpleTable() {
  const classes = useStyles();
  const [orderBy, setOrderBy] = React.useState("name");
  const [order, setOrder] = React.useState("asc");
  const [filter, setFilter] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

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

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={`${classes.noWrapHeaderRow}`}>
            <TableCell colSpan={headCells.length + 1}>
              <TextField
                label="Global Filter"
                variant="outlined"
                className={classes.filterInput}
                value={globalFilter}
                id="globalFilterInput"
                onChange={handleGlobalFilterChange}
              />
            </TableCell>
          </TableRow>
          <TableRow className={`${classes.noWrapHeaderRow}`}>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                padding="checkbox"
                className={`${classes.tableHeadCell}`}
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
                    <TextField
                      label={`Filter ${headCell.label}`}
                      variant="outlined"
                      className={`${classes.filterInput} columnFilterInput`}
                      value={filter[headCell.id] || ""}
                      onChange={(e) => handleFilterChange(e, headCell.id)}
                    />
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
            .map((row) => (
              <ExpandableTableRow
                key={row.name}
                expandComponent={
                  <TableCell colSpan={headCells.length + 1}>
                    {row.detail}
                  </TableCell>
                }
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
    </Paper>
  );
}

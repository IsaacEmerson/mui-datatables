import React from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Popover from './Popover';
import TableFilter from './TableFilter';
import TableViewCol from './TableViewCol';
import TableSearch from './TableSearch';
import SearchIcon from '@material-ui/icons/Search';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import PrintIcon from '@material-ui/icons/Print';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import FilterIcon from '@material-ui/icons/FilterList';
import ReactToPrint from 'react-to-print';
import styled from '../styled';
import { createCSVDownload } from '../utils';

export const defaultToolbarStyles = (theme, props) => ({
  root: {},
  paperHeader: {
    width: '100%',
    color: 'white',
    padding: '25px',
    marginTop: '-35px',
    marginBottom: '30px',
    webkitBoxShadow: '0px 5px 20px -1px rgba(106,27,154,0.4)',
    mozBoxShadow: '0px 5px 20px -1px rgba(106,27,154,0.4)',
    boxShadow: '0px 5px 20px -1px rgba(106,27,154,0.4)',
    display: 'flex',
    direction: 'row',
    alignItems: 'center',
  },
  left: {
    flex: '1 1 auto',
  },
  iconWhite: { color: 'white' },
  actions: {
    flex: '1 1 auto',
    textAlign: 'right',
  },
  titleRoot: { marginLeft: 5 },
  titleText: { color: 'white' },
  icon: {
    '&:hover': {
      color: '',
    },
  },
  iconActive: {
    color: theme.palette.primary.main,
  },
  filterPaper: {
    maxWidth: '50%',
  },
  searchIcon: {
    display: 'inline-flex',
    marginTop: '10px',
    marginRight: '8px',
  },
  ...(props.options.responsive ? { ...responsiveToolbarStyles(theme) } : {}),
});

export const responsiveToolbarStyles = theme => ({
  [theme.breakpoints.down('sm')]: {
    titleRoot: { marginLeft: 5 },
    titleText: {
      color: 'white',
      fontSize: '16px',
    },
    spacer: {
      display: 'none',
    },
    left: {
      // flex: "1 1 40%",
      padding: '8px 0px',
    },
    actions: {
      // flex: "1 1 60%",
      textAlign: 'right',
    },
  },
  [theme.breakpoints.down('xs')]: {
    root: {
      display: 'block',
    },
    left: {
      padding: '8px 0px 0px 0px',
    },
    titleText: {
      textAlign: 'center',
    },
    actions: {
      textAlign: 'center',
    },
  },
  '@media screen and (max-width: 480px)': {},
});

class TableToolbar extends React.Component {
  state = {
    iconActive: null,
    showSearch: Boolean(this.props.searchText || this.props.options.searchText),
    searchText: this.props.searchText || null,
  };

  componentDidUpdate(prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      this.setState({ searchText: this.props.searchText });
    }
  }

  handleCSVDownload = () => {
    const { data, columns, options } = this.props;
    createCSVDownload(columns, data, options);
  };

  setActiveIcon = iconName => {
    this.setState(() => ({
      showSearch: this.isSearchShown(iconName),
      iconActive: iconName,
    }));
  };

  isSearchShown = iconName => {
    let nextVal = false;
    if (this.state.showSearch) {
      if (this.state.searchText) {
        nextVal = true;
      } else {
        const { onSearchClose } = this.props.options;
        if (onSearchClose) onSearchClose();
        nextVal = false;
      }
    } else if (iconName === 'search') {
      nextVal = this.showSearch();
    }
    return nextVal;
  };

  getActiveIcon = (styles, iconName) => {
    return this.state.iconActive !== iconName ? styles.icon : styles.iconActive;
  };

  showSearch = () => {
    !!this.props.options.onSearchOpen && this.props.options.onSearchOpen();
    this.props.setTableAction('onSearchOpen');
    return true;
  };

  hideSearch = () => {
    const { onSearchClose } = this.props.options;

    if (onSearchClose) onSearchClose();
    this.props.searchTextUpdate(null);

    this.setState(() => ({
      iconActive: null,
      showSearch: false,
      searchText: null,
    }));

    this.searchButton.focus();
  };

  handleSearch = value => {
    this.setState({ searchText: value });
    this.props.searchTextUpdate(value);
  };

  render() {
    const {
      data,
      options,
      classes,
      columns,
      filterData,
      filterList,
      filterUpdate,
      resetFilters,
      toggleViewColumn,
      title,
      color,
      tableRef,
    } = this.props;

    const { search, downloadCsv, print, viewColumns, filterTable } = options.textLabels.toolbar;
    const { showSearch, searchText } = this.state;

    return (
      <Toolbar className={classes.root} role={'toolbar'} aria-label={'Table Toolbar'}>
        <Paper className={classes.paperHeader} style={{ backgroundColor: color || '#6A1B9A' }}>
          <div className={classes.left}>
            {showSearch === true ? (
              <TableSearch
                searchText={searchText}
                onSearch={this.handleSearch}
                onHide={this.hideSearch}
                options={options}
              />
            ) : typeof title !== 'string' ? (
              title
            ) : (
              <div className={classes.titleRoot} aria-hidden={'true'}>
                <Typography variant="h6" className={classes.titleText}>
                  {title}
                </Typography>
              </div>
            )}
          </div>
          <div className={classes.actions}>
            {options.search && (
              <Tooltip title={search} disableFocusListener>
                <IconButton
                  aria-label={search}
                  buttonRef={el => (this.searchButton = el)}
                  classes={{ root: this.getActiveIcon(classes, 'search') }}
                  onClick={this.setActiveIcon.bind(null, 'search')}>
                  <SearchIcon className={classes.iconWhite} />
                </IconButton>
              </Tooltip>
            )}
            {options.download && (
              <Tooltip title={downloadCsv}>
                <IconButton aria-label={downloadCsv} classes={{ root: classes.icon }} onClick={this.handleCSVDownload}>
                  <DownloadIcon className={classes.iconWhite} />
                </IconButton>
              </Tooltip>
            )}
            {options.print && (
              <span>
                <ReactToPrint
                  trigger={() => (
                    <Tooltip title={print}>
                      <IconButton aria-label={print} classes={{ root: classes.icon }}>
                        <PrintIcon className={classes.iconWhite} />
                      </IconButton>
                    </Tooltip>
                  )}
                  content={() => this.props.tableRef()}
                />
              </span>
            )}
            {options.viewColumns && (
              <Popover
                refExit={this.setActiveIcon.bind(null)}
                trigger={
                  <Tooltip title={viewColumns} disableFocusListener>
                    <IconButton
                      aria-label={viewColumns}
                      classes={{ root: this.getActiveIcon(classes, 'viewcolumns') }}
                      onClick={this.setActiveIcon.bind(null, 'viewcolumns')}>
                      <ViewColumnIcon className={classes.iconWhite} />
                    </IconButton>
                  </Tooltip>
                }
                content={
                  <TableViewCol data={data} columns={columns} options={options} onColumnUpdate={toggleViewColumn} />
                }
              />
            )}
            {options.filter && (
              <Popover
                refExit={this.setActiveIcon.bind(null)}
                classes={{ paper: classes.filterPaper }}
                trigger={
                  <Tooltip title={filterTable} disableFocusListener>
                    <IconButton
                      aria-label={filterTable}
                      classes={{ root: this.getActiveIcon(classes, 'filter') }}
                      onClick={this.setActiveIcon.bind(null, 'filter')}>
                      <FilterIcon className={classes.iconWhite} />
                    </IconButton>
                  </Tooltip>
                }
                content={
                  <TableFilter
                    columns={columns}
                    options={options}
                    filterList={filterList}
                    filterData={filterData}
                    onFilterUpdate={filterUpdate}
                    onFilterReset={resetFilters}
                  />
                }
              />
            )}
            {options.customToolbar && options.customToolbar()}
          </div>
        </Paper>
      </Toolbar>
    );
  }
}

export default styled(TableToolbar)(defaultToolbarStyles, { name: 'MUIDataTableToolbar' });

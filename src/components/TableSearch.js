import React from 'react';
import Grow from '@material-ui/core/Grow';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/core/styles';

const defaultSearchStyles = theme => ({
  main: {
    display: 'flex',
    flex: '1 0 auto',
  },
  searchIcon: {
    color: 'white',
    marginTop: '10px',
    marginRight: '8px',
  },

  clearIcon: {
    color: 'white',
  },
  searchInput: {
    flex: '1 0',
    position: 'relative',
    backgroundColor: 'transparent',
    color: 'white',
    borderBottom: '1px solid white',
    fontSize: 16,
    width: 'auto',
    padding: '6px 0px',
    marginTop: '-16px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: 'white',
      color: 'white',
    },
  },
});

class TableSearch extends React.Component {
  handleTextChange = event => {
    const { onSearchChange } = this.props.options;

    if (onSearchChange) {
      onSearchChange(event.target.value);
    }

    this.props.onSearch(event.target.value);
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown = event => {
    if (event.keyCode === 27) {
      this.props.onHide();
    }
  };

  render() {
    const { classes, options, onHide, initialSearchText } = this.props;

    return (
      <Grow appear in={true} timeout={300}>
        <div className={classes.main} ref={el => (this.rootRef = el)}>
          <SearchIcon className={classes.searchIcon} />
          <InputBase
            id="search-input"
            classes={{
              input: classes.searchInput,
            }}
            // InputProps={{
            //   'aria-label': options.textLabels.toolbar.search,
            // }}
            defaultValue={initialSearchText}
            onChange={this.handleTextChange}
            fullWidth={true}
            inputRef={el => (this.searchField = el)}
          />
          <IconButton onClick={onHide}>
            <ClearIcon className={classes.clearIcon} />
          </IconButton>
        </div>
      </Grow>
    );
  }
}

export default withStyles(defaultSearchStyles, { name: 'MUIDataTableSearch' })(TableSearch);

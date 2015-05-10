var React = require('react'),
  // KeyCode = require('./utils/key-code'),
  KeyCode = require('material-ui').Utils.KeyCode,
  // Classable = require('./mixins/classable'),
  Classable = require('material-ui').Mixins.Classable,
  // WindowListenable = require('./mixins/window-listenable'),
  WindowListenable = require('material-ui').Mixins.WindowListenable,
  // Overlay = require('./overlay'),
  Overlay = require('material-ui').Overlay,
  Paper = require('material-ui').Paper,
  // Paper = require('./paper'),
  // Menu = require('./menu/menu');
  Menu = require('./menu');

var LeftNav = React.createClass({

  mixins: [Classable, WindowListenable],

  propTypes: {
    docked: React.PropTypes.bool,
    header: React.PropTypes.element,
    onChange: React.PropTypes.func,
    menuItems: React.PropTypes.array.isRequired,
    selectedIndex: React.PropTypes.number,
    onNavOpen: React.PropTypes.func,
    onNavClose: React.PropTypes.func
  },

  windowListeners: {
    'keyup': '_onWindowKeyUp'
  },

  getDefaultProps: function() {
    return {
      docked: true
    };
  },

  getInitialState: function() {
    return {
      open: this.props.docked
    };
  },

  toggle: function() {
    this.setState({ open: !this.state.open });
    return this;
  },

  close: function() {
    this.setState({ open: false });
    if (this.props.onNavClose) this.props.onNavClose();
    return this;
  },

  open: function() {
    this.setState({ open: true });
    if (this.props.onNavOpen) this.props.onNavOpen();
    return this;
  },

  render: function() {
    var classes = this.getClasses('mui-left-nav', {
        'mui-closed': !this.state.open
      }),
      selectedIndex = this.props.selectedIndex,
      overlay;

    if (!this.props.docked) overlay = <Overlay show={this.state.open} onTouchTap={this._onOverlayTouchTap} />;

    return (
      <div className={classes}>

        {overlay}
        <Paper
          ref="clickAwayableElement"
          className="mui-left-nav-menu"
          zDepth={2}
          rounded={false}>
          
          {this.props.header}
          <Menu 
            ref="menuItems"
            zDepth={0}
            menuItems={this.props.menuItems}
            selectedIndex={selectedIndex}
            onItemClick={this._onMenuItemClick} />

        </Paper>
      </div>
    );
  },

  _onMenuItemClick: function(e, key, payload) {
    if (this.props.onChange && this.props.selectedIndex !== key) {
      this.props.onChange(e, key, payload);
    }
    if (!this.props.docked) this.close();
  },

  _onOverlayTouchTap: function() {
    this.close();
  },

  _onWindowKeyUp: function(e) {
    if (e.keyCode == KeyCode.ESC &&
        !this.props.docked &&
        this.state.open) {
      this.close();
    }
  }

});

module.exports = LeftNav;

var React = require('react');
var Transitions = require('material-ui').Styles.Transitions;
var StylePropable = require('material-ui').Mixins.StylePropable;
var Colors = require('material-ui').Styles.Colors;
var InkBar = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    position: React.PropTypes.string
  },

  mixins: [StylePropable],

  getTheme: function() {
    return this.context.muiTheme.palette;
  },

  render: function() {

    var styles = this.mergeStyles({
      left: this.props.left,
      width: this.props.width,
      bottom: '0',
      display: 'block',
      backgroundColor: 'yellow',
      height: '2px',
      marginTop: '-2px',
      position: 'relative',
      transition: Transitions.easeOut('1s', 'left')
    });

    return (
      <div style={styles}>
        &nbsp;
      </div>
    );
  }

});

module.exports = InkBar;

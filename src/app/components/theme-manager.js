var Colors = require('material-ui/styles/colors');
var Spacing = require('material-ui/styles/spacing');
var ColorManipulator = require('material-ui/utils/colorManipulator');

// https://github.com/callemall/material-ui/pull/2933/files
// official api has changed
import {merge} from 'lodash';

var Types = {
	LIGHT: require('./light-theme'),
	// DARK: require('./themes/dark-theme')
};

var ThemeManager = function() {
	return {
		types: Types,
		template: Types.LIGHT,

		spacing: Spacing,
		contentFontFamily: 'Roboto, sans-serif',

		palette: Types.LIGHT.getPalette(),
		component: Types.LIGHT.getComponentThemes(Types.LIGHT.getPalette()),

		getCurrentTheme: function() {
			return this;
		},

		// Component gets updated to reflect palette changes.
		setTheme: function(newTheme) {
			this.setPalette(newTheme.getPalette());
			this.setComponentThemes(newTheme.getComponentThemes(newTheme.getPalette()));
		},

		setPalette: function(newPalette) {
			this.palette = merge({}, this.palette, newPalette);
			this.component = merge({}, this.component, this.template.getComponentThemes(this.palette));
		},

		setComponentThemes: function(overrides) {
			this.component = merge({}, this.component, overrides);
		}
	};
};

module.exports = ThemeManager;

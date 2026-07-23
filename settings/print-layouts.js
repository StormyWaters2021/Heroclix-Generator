export const PRINT_SETTINGS = {
  page: {
	  widthInches: 8.5,
	  heightInches: 11,
	  renderDpi: 600,
	  jpegQuality: 1
	},
  bleedInches: 0.25,
  modes: {
    max: {
      normal: {
        columns: 5,
        rows: 6,
        tokenDiameterInches: 1.5,
        gapXInches: 0.1,
        gapYInches: 0.1
      },
      tight: {
        columns: 5,
        rows: 7,
        tokenDiameterInches: 1.5,
        gapXInches: 0,
        gapYInches: 0
      },
      bleed: {
        columns: 4,
        rows: 5,
        tokenDiameterInches: 1.5,
        footprintInches: 2
      }
    },
    avery8293: {
      columns: 4,
      rows: 5,
      tokenDiameterInches: 1.5,
      firstCenterXInches: 1.25,
      firstCenterYInches: 1.5,
      centerSpacingXInches: 2,
      centerSpacingYInches: 2
    }
  }
};

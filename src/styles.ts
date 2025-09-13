import { makeStyles } from '@rn-vui/themed';

export const COLORS = {
  light: {
    primary: '#4b4f7b',
    secondary: '#3C5562',
    background: '#F4F4FB',
    black: '#000000',
    white: '#FFFFFF',
    grey0: '#4B4F7A',
    grey1: '#323965',
    success: '#187841',
    successBackground: '#2BD473',
    warning: '#FBD300',
    warningBackground: '#FFEA79',
    error: '#FF0303',
    errorBackground: '#EE898F'
  },
  dark: {
    primary: '#F4F4FB',
    secondary: '#3C5562',
    background: '#4b4f7b',
    black: '#000000',
    white: '#FFFFFF',
    grey0: '#DEDBFD',
    grey1: '#BCBAEE',
    success: '#187841',
    successBackground: '#2BD473',
    warning: '#FBD300',
    warningBackground: '#FFEA79',
    error: '#FF0303',
    errorBackground: '#EE898F'
  }
};

export const useGlobalStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primary: {
    color: theme.colors.primary
  },
  secondary: {
    color: theme.colors.secondary
  },
  background: {
    color: theme.colors.background
  },
  black: {
    color: theme.colors.black
  },
  containerSuccess: {
    borderColor: theme.colors.success,
    backgroundColor: COLORS.light.successBackground
  },
  containerWarning: {
    borderColor: theme.colors.warning,
    backgroundColor: COLORS.light.warningBackground
  },
  containerError: {
    borderWidth: 3,
    borderColor: theme.colors.error,
    backgroundColor: COLORS.light.errorBackground
  },
  textCenter: {
    textAlign: 'center'
  },
  textRight: {
    textAlign: 'right'
  },
  textLeft: {
    textAlign: 'left'
  },
  bold: {
    fontWeight: 900
  },
  buttonPrimary: {
    backgroundColor: theme.colors.background
  },
  buttonError: {
    backgroundColor: theme.colors.error
  },
  buttonLarge: {
    minWidth: 350,
    height: 70,
  },
  buttonMedium: {
    minWidth: 100,
  },
  textExtraLarge: {
    fontSize: 48,
    fontWeight: 900
  },
  textLarge: {
    fontSize: 32,
    fontWeight: 900
  },
  textMedium: {
    fontSize: 24
  },
  textSmall: {
    fontSize: 18
  },
  dialog: {
    backgroundColor: theme.colors.primary,
    minWidth: 375
  },
  input: {
    color: theme.colors.white
  }
}));

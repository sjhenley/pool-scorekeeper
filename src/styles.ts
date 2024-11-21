import { makeStyles } from '@rneui/themed';

export const COLORS = {
  light: {
    primary: '#4b4f7b',
    secondary: '#3C5562',
    background: '#F4F4FB',
    grey0: '#4B4F7A',
    grey1: '#323965'
  },
  dark: {
    primary: '#F4F4FB',
    secondary: '#3C5562',
    background: '#4b4f7b',
    grey0: '#DEDBFD',
    grey1: '#BCBAEE'
  }
};

export const useGlobalStyles = makeStyles((theme) => ({
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
  textCenter: {
    textAlign: 'center'
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
  buttonPrimaryText: {
    color: theme.colors.background,
    fontSize: 32,
    fontWeight: 'bold'
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

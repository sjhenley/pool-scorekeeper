import { makeStyles } from '@rneui/themed';

export const COLORS = {
  light: {
    primary: '#4b4f7b',
    secondary: '#3C5562',
    background: '#F4F4FB',
    black: '#1A1A1A',
    white: '#FFFFFF'
  },
  dark: {
    primary: '#F4F4FB',
    secondary: '#3C5562',
    background: '#4b4f7b',
    black: '#1A1A1A',
    white: '#FFFFFF'
  }
};

export const TYPOGRAPHY = {
  heading: { fontSize: 36, fontWeight: '600' },
  subheading: { fontSize: 28, fontWeight: '500' },
  body: { fontSize: 18, fontWeight: '400' }
};

export const useGlobalStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textCenter: {
    textAlign: 'center'
  },
  buttonPrimary: {
    minWidth: 200,
    fontSize: 36,
  },
  buttonPrimaryText: {
    color: theme.colors.background,
    fontSize: 32,
    fontWeight: 'bold'
  },
  buttonLarge: {
    minWidth: 350,
    height: 70,
  }
}));

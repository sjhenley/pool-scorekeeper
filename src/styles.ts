import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#1AF0C1',
  secondary: '#E0561F',
  tertiary: '#BBC9C6',
  black: '#1A1A1A',
  white: '#FFFFFF'
};

export const TYPOGRAPHY = {
  heading: { fontSize: 36, fontWeight: '600' },
  subheading: { fontSize: 28, fontWeight: '500' },
  body: { fontSize: 18, fontWeight: '400' }
};

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textCenter: {
    textAlign: 'center'
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    color: COLORS.black,
    minWidth: 200,
    fontSize: 36
  }
});

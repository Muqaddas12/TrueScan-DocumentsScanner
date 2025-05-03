import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store'; // adjust if needed

export default function Layout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}

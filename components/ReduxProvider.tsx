'use client';
import { Provider } from 'react-redux';
import { store } from '../lib/store/store';
import { Toaster } from 'react-hot-toast';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', fontFamily: 'inherit', fontSize: '14px' },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
      }} />
    </Provider>
  );
}

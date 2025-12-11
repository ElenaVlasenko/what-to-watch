import ReactDOM from 'react-dom/client';
import App from './app/app';
import { Provider } from 'react-redux';
import store from './store/store';
import { StrictMode } from 'react';
import { fetchFilmsAction, fetchPromoAction } from './store/films-slice';
import { checkAuthAction } from './store/user-slice';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

store.dispatch(fetchFilmsAction());
store.dispatch(fetchPromoAction());
store.dispatch(checkAuthAction());

root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App/>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);


import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ptBR } from 'date-fns/locale';
import { QueryClient, QueryClientProvider } from 'react-query';
import themeColor from './styles/colors';
import LoaderProvider from './context/LoaderContext';
import NotificationProvider from './context/NotificationContext';
import { RouteComponent, routes } from './routes';
import { GlobalStyle } from './styles/global';
import { AuthProvider } from './context/AuthContext';
import { LoaderContext } from './context/LoadDashContext';
import { LoaderDashboard } from './components/Main/Loader/index';
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from './services/queryClient';

const ThemeColor = createMuiTheme(themeColor);

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
      <MuiThemeProvider theme={ThemeColor}>
        <ThemeProvider theme={ThemeColor}>
          <LoaderContext>
            <LoaderDashboard>
              <NotificationProvider>
                <LoaderProvider>
                  <Router>
                    <AuthProvider>
                      <Switch>
                        {routes.map((route) => (
                          <RouteComponent key={route.path} {...route} />
                        ))}
                      </Switch>
                    </AuthProvider>
                  </Router>
                  <GlobalStyle />
                </LoaderProvider>
              </NotificationProvider>
            </LoaderDashboard>
          </LoaderContext>
        </ThemeProvider>
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
    <ReactQueryDevtools/>
  </QueryClientProvider>
);

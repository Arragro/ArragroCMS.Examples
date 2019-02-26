import '@arragro/cms-management/dist/main.css'
import './scss/site.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { ConnectedRouter } from 'connected-react-router'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import { JssProvider } from 'react-jss'
import { create } from 'jss'

import { Redux, utils, configureStore, App, Components } from '@arragro/cms-management'
import * as ComponentExtentionTypes from './componentExtentionTypes'
import { CssBaseline, MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { ArragroCMSAdminFieldControlExtender } from './ArragroCMSAdminFieldControlExtender'

const initialState = (window as any).initialReduxState as Redux.ReduxModel.StoreState
const store = configureStore(utils.History, true, initialState)
const rootEl = document.getElementById('react-app')
ComponentExtentionTypes.extendContentTypeMap()
ComponentExtentionTypes.extendConfigurationTypeMap()

const generateClassName = createGenerateClassName()
const jss = create(jssPreset())

const theme = createMuiTheme({
    palette: {
        primary: { main: '#f5f5f5' },
        secondary: {
            main: '#00A98F',
            light: '#e6fffb',
            contrastText: '#FFF'
        }
    },
    shape: {
        borderRadius: 0
    }
})

const render = (Component: any) => {
    ReactDOM.render(
        <Provider store={store}>
            <Components.FieldProvider.FieldContextProvider value={{ adminFieldControlExtender: new ArragroCMSAdminFieldControlExtender(), renderFieldControlExtender: new Components.DefaultRenderFieldControlExtender() }}>
                <IntlProvider>
                    <ConnectedRouter history={utils.History}>
                        <JssProvider jss={jss} generateClassName={generateClassName}>
                            <utils.Aux>
                                <CssBaseline />
                                <MuiThemeProvider theme={theme}>
                                    <Component />
                                </MuiThemeProvider>
                            </utils.Aux>
                        </JssProvider>
                    </ConnectedRouter>
                </IntlProvider>
            </Components.FieldProvider.FieldContextProvider>
        </Provider>,
        rootEl
    )
}

render(App)

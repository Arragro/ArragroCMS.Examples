// import '@arragro/cms-management/dist/main.css'
import './scss/site.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { ConnectedRouter } from 'connected-react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { JssProvider } from 'react-jss'
import { create } from 'jss'

async function configureStore () {
    const store = await import('@arragro/cms-management/dist/src/redux/store')
    return store.configureStore
}

import { utils } from '@arragro/cms-management'

import App from '@arragro/cms-management/dist/src/asyncApp'
import { FieldContextProvider } from '@arragro/cms-management/dist/src/components/Field/FieldProvider'
import { DefaultRenderFieldControlExtender } from '@arragro/cms-management/dist/src/components'

import * as ComponentExtentionTypes from './componentExtentionTypes'
import { ArragroCMSAdminFieldControlExtender } from './ArragroCMSAdminFieldControlExtender'

const render = async () => {
    const initialState = (window as any).initialReduxState
    const store = (await configureStore())(utils.History, true, initialState)
    const rootEl = document.getElementById('react-app')
    ComponentExtentionTypes.extendContentTypeMap()
    ComponentExtentionTypes.extendConfigurationTypeMap()

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

    ReactDOM.render(
        <Provider store={store}>
            <FieldContextProvider value={{ adminFieldControlExtender: new ArragroCMSAdminFieldControlExtender(), renderFieldControlExtender: new DefaultRenderFieldControlExtender() }}>
                <IntlProvider locale='en'>
                    <ConnectedRouter history={utils.History}>
                        <React.Fragment>
                            <CssBaseline />
                            <MuiThemeProvider theme={theme}>
                                <App />
                            </MuiThemeProvider>
                        </React.Fragment>
                    </ConnectedRouter>
                </IntlProvider>
            </FieldContextProvider>
        </Provider>,
        rootEl
    )
}

render().catch(x => console.error(x))

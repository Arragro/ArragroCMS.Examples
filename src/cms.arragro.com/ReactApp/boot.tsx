// import '@arragro/cms-management/dist/main.css'
import './scss/site.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { ConnectedRouter } from 'connected-react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

async function configureStore () {
    const store = await import('@arragro/cms-management/dist/src/redux/store')
    return store.configureStore
}

import { utils } from '@arragro/cms-management'

import App from '@arragro/cms-management/dist/src/asyncApp'
import { FieldContextProvider } from '@arragro/cms-management/dist/src/components/DynamicFields/FieldProvider'
import { DefaultRenderFieldControlExtender, DefaultAdminFieldControlExtender } from '@arragro/cms-management/dist/src/components'
import Assemblies from '@arragro/cms-management/dist/src/components/DynamicFields/Assemblies'
import { AccountProvider } from '@arragro/cms-management/dist/src/store/AccountStore'

const render = async () => {
    const logging = true
    const initialState = (window as any).initialReduxState
    const store = (await configureStore())(utils.history, logging, initialState)
    const rootEl = document.getElementById('react-app')

    const theme = createMuiTheme({
        palette: {
            primary: { main: 'rgba(0, 0, 0, 0.54)' },
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
            <FieldContextProvider
                value={{
                    assemblies: Assemblies,
                    adminFieldControlExtender: new DefaultAdminFieldControlExtender(),
                    renderFieldControlExtender: new DefaultRenderFieldControlExtender()
                }}>
                <IntlProvider locale='en'>
                    <CssBaseline />
                    <MuiThemeProvider theme={theme}>
                        <AccountProvider logging={logging}>
                            <App />
                        </AccountProvider>
                    </MuiThemeProvider>
                </IntlProvider>
            </FieldContextProvider>
        </Provider>,
        rootEl
    )
}

render().catch(x => console.error(x))

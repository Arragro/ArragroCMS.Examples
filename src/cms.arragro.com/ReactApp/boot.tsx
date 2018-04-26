﻿import '../wwwroot/less/site.less'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { ConnectedRouter } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import { AppContainer } from 'react-hot-loader'

import { Redux } from 'arragrocms-management'
import * as ComponentExtentionTypes from './componentExtentionTypes'
import App from './app'

// prepare store
const initialState = (window as any).initialReduxState as Redux.ReduxModel.StoreState
const history = createBrowserHistory()
const store = Redux.configureStore(history, true, initialState)
const rootEl = document.getElementById('react-app')
ComponentExtentionTypes.extendContentTypeMap()
ComponentExtentionTypes.extendConfigurationTypeMap()

const render = (Component: any) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <IntlProvider>
                    <ConnectedRouter history={history}>
                        <Component />
                    </ConnectedRouter>
                </IntlProvider>
            </Provider>
        </AppContainer>,
        rootEl
    )
}

render(App)

// Hot Module Replacement API
declare let module: { hot: any }

if (module.hot) {
    module.hot.accept('./app', () => {
        render(App)
    })
}


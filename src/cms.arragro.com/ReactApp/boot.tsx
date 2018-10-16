/// <reference types="node" />
import 'node_modules/arragrocms-management/dist/main.css'
import './scss/site.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { ConnectedRouter } from 'react-router-redux'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import { JssProvider } from 'react-jss'
import { create } from 'jss'

import { Redux, utils, configureStore, App } from 'arragrocms-management'
import * as ComponentExtentionTypes from './componentExtentionTypes'

const initialState = (window as any).initialReduxState as Redux.ReduxModel.StoreState
const store = configureStore(utils.History, true, initialState)
const rootEl = document.getElementById('react-app')
ComponentExtentionTypes.extendContentTypeMap()
ComponentExtentionTypes.extendConfigurationTypeMap()

const generateClassName = createGenerateClassName()
const jss = create(jssPreset())

const render = (Component: any) => {
    ReactDOM.render(
        <Provider store={store}>
            <IntlProvider>
                <ConnectedRouter history={utils.History}>
                    <JssProvider jss={jss} generateClassName={generateClassName}>
                        <Component />
                    </JssProvider>
                </ConnectedRouter>
            </IntlProvider>
        </Provider>,
        rootEl
    )
}

render(App)

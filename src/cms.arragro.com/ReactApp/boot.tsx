import 'bootstrap/dist/css/bootstrap.min.css'
import 'arragrocms-management/dist/main.css'

import '../wwwroot/less/site.less'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { browserHistory, Router } from 'react-router'

import { extendContentTypeMap, extendConfigurationTypeMap } from './componentExtentionTypes'

import { configureStore, Routes } from 'arragrocms-management'

let store = configureStore(browserHistory, true)
let routes = new Routes()

extendContentTypeMap()
extendConfigurationTypeMap()

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale={navigator.language}>
            <Router history={browserHistory} children={routes.buildRoutes()} />
        </IntlProvider>
    </Provider>,
    document.getElementById('react-app')
)

declare module 'react-router-navigation-prompt' {
    import * as React from 'react'
    import { match } from 'react-router'

    export interface INavigationPromptProps {
        afterCancel?: () => void
        afterConfirm?: () => void
        beforeCancel?: () => void
        beforeConfirm?: () => void
        children: any
        renderIfNotActive: boolean
        when: (currentLocation: Location, nextLocation: Location) => boolean | boolean
    }

    export default class NavigationPrompt extends React.Component<INavigationPromptProps, any> {}
}
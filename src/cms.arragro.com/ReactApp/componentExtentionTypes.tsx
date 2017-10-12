import * as React from 'react'

import { Interfaces, Components } from 'arragrocms-management'
import MarkdownConfiguration from './CustomComponents/ConfigurationTypes/MarkdownConfiguration'
import MarkdownPage from './CustomComponents/PageTypes/MarkdownPage'
import MarkdownPost from './CustomComponents/PostTypes/MarkdownPost'

const PAGETYPES_MARKDOWN = 'arragro.com.ContentTypes.Pages.MarkdownPage'
const CONFIGURATIONTYPES_MARKDOWN = 'arragro.com.ContentTypes.Configuration.MarkdownConfiguration'

const POSTTYPES_MARKDOWN = 'arragro.com.ContentTypes.Posts.MarkdownPage'

export function extendContentTypeMap (): void {

    Components.componentTypeMap[PAGETYPES_MARKDOWN] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <MarkdownPage ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }
    
    Components.componentTypeMap[POSTTYPES_MARKDOWN] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <MarkdownPost ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }
}

export function extendConfigurationTypeMap (): void {

    Components.componentTypeMap[CONFIGURATIONTYPES_MARKDOWN] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <MarkdownConfiguration ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }

}

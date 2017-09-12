﻿import * as React from 'react'

import { Interfaces, componentTypeMap } from 'arragrocms-management'
import MarkdownConfiguration from './CustomComponents/ConfigurationTypes/MarkdownConfiguration'
import MarkdownPage from './CustomComponents/PageTypes/MarkdownPage'

const PAGETYPES_MARKDOWN = 'CMS_Test.PageTypes.MarkdownPage'
const CONFIGURATIONTYPES_MARKDOWN = 'CMS_Test.PageTypes.MarkdownConfiguration'

export function extendPageTypeMap (): void {

    componentTypeMap[PAGETYPES_MARKDOWN] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <MarkdownPage ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }

}

export function extendConfigurationTypeMap (): void {

    componentTypeMap[CONFIGURATIONTYPES_MARKDOWN] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <MarkdownConfiguration ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }

}

import * as React from 'react'

import { Interfaces, Components } from 'arragrocms-management'
import MarkdownConfiguration from './CustomComponents/ConfigurationTypes/MarkdownConfiguration'
import MarkdownPage from './CustomComponents/PageTypes/MarkdownPage'
import LandingPage from './CustomComponents/PageTypes/LandingPage'
import TileBulletPage from './CustomComponents/PageTypes/TileBulletPage'
import RedirectPage from './CustomComponents/PageTypes/RedirectPage'
import ContactPage from './CustomComponents/PageTypes/ContactPage'

import MarkdownPost from './CustomComponents/PostTypes/MarkdownPost'

const CONFIGURATIONTYPES_MARKDOWN = 'arragro.com.ContentTypes.Configuration.MarkdownConfiguration'

const PAGETYPES_MARKDOWN = 'arragro.com.ContentTypes.Pages.MarkdownPage'
const PAGETYPES_LANDINGPAGE = 'arragro.com.ContentTypes.Pages.LandingPage'
const PAGETYPES_TILEBULLETPAGE = 'arragro.com.ContentTypes.Pages.TileBulletPage'
const PAGETYPES_REDIRECTPAGE = 'arragro.com.ContentTypes.Pages.RedirectPage'
const PAGETYPES_CONTACTPAGE = 'arragro.com.ContentTypes.Pages.ContactPage'

const POSTTYPES_MARKDOWN = 'arragro.com.ContentTypes.Posts.MarkdownPage'

export function extendContentTypeMap (): void {

    Components.componentTypeMap[PAGETYPES_MARKDOWN] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <MarkdownPage ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }

    Components.componentTypeMap[PAGETYPES_LANDINGPAGE] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <LandingPage ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }

    Components.componentTypeMap[PAGETYPES_TILEBULLETPAGE] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <TileBulletPage ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }

    Components.componentTypeMap[PAGETYPES_REDIRECTPAGE] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <RedirectPage ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
    }

    Components.componentTypeMap[PAGETYPES_CONTACTPAGE] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <ContactPage ref={pageType.ref} contentData={pageType.contentData} culture={pageType.culture} onChange={pageType.onChange} />
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

﻿import * as React from 'react'

import { Interfaces } from '@arragro/cms-management'
import { ComponentTypesExtender } from '@arragro/cms-management/dist/src/components'
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

    ComponentTypesExtender.componentTypeMap[PAGETYPES_MARKDOWN] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <MarkdownPage {...pageType} />
    }

    ComponentTypesExtender.componentTypeMap[PAGETYPES_LANDINGPAGE] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <LandingPage {...pageType} />
    }

    ComponentTypesExtender.componentTypeMap[PAGETYPES_TILEBULLETPAGE] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <TileBulletPage {...pageType} />
    }

    ComponentTypesExtender.componentTypeMap[PAGETYPES_REDIRECTPAGE] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <RedirectPage {...pageType} />
    }

    ComponentTypesExtender.componentTypeMap[PAGETYPES_CONTACTPAGE] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <ContactPage {...pageType} />
    }

    ComponentTypesExtender.componentTypeMap[POSTTYPES_MARKDOWN] = (pageType: Interfaces.IComponentType): JSX.Element => {
        return <MarkdownPost {...pageType} />
    }
}

export function extendConfigurationTypeMap (): void {

    ComponentTypesExtender.configurationTypeMap[CONFIGURATIONTYPES_MARKDOWN] = (pageType: Interfaces.IConfigurationType): JSX.Element => {
        return <MarkdownConfiguration {...pageType} />
    }

}

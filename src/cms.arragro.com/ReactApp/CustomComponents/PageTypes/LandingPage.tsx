﻿import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components } from 'arragrocms-management'

import { ITile, ICloudBannerText, ISvgIconLink } from '../interfaces'

import SortableTiles from '../Components/Tiles/SortableTiles'
import SortableCloudBannerTexts from '../Components/CloudBannerTexts/SortableCloudBannerTexts'
import SortableSvgIcons from '../Components/SvgIconLinks/SortableSvgIcons'
import MarkdownEditor from '../MarkdownEditor'

const { Input, Checkbox } = FRC

const landingPageHelper = {
    newTile: (): ITile => {
        return {
            name: '',
            svgBased: false,
            imageUrl: '',
            imageAlt: '',
            markdown: '',
            hasLink: false,
            linkText: '',
            href: '',
            cssClass: ''
        }
    },

    newTiles: (): Array<ITile> => {
        return new Array<ITile>()
    },

    newCloudBannerText: (): ICloudBannerText => {
        return {
            markdown: ''
        }
    },

    newCloudBannerTexts: (): Array<ICloudBannerText> => {
        return new Array<ICloudBannerText>()
    },

    newSvgIconLink: (): ISvgIconLink => {
        return {
            title: '',
            svg: '',
            href: '',
            markdown: ''
        }
    }
}


export interface ILandingPageState {
    title: string
    startingClouds: Array<ITile>
    infiniteClouds: Array<ITile>
    cloudBannerTexts: Array<ICloudBannerText>
    markdownIntro: string
    svgIconLinksServices: Array<ISvgIconLink>
    whatWeveDones: Array<ITile>
    technologyClouds: Array<ITile>
    technologyMarkdown: string
    markdownOutro: string
    hasContactForm: boolean
}


export default class LandingPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, ILandingPageState> {
    sortableStartingClouds: SortableTiles | null = null
    sortableInfiniteClouds: SortableTiles | null = null
    sortableCloudBannerTexts: SortableCloudBannerTexts | null = null
    sortableSvgIcons: SortableSvgIcons | null = null
    sortableTechnologyClouds: SortableTiles | null = null
    sortableWhatWeveDones: SortableTiles | null = null

    constructor(props: Interfaces.IComponentTypeBaseProps) {
        super(props)
    }

    public render() {
        
        const pageData = (this.props.contentData.contentJson as any)[this.props.culture] as ILandingPageState
        const landingPage = {
            title: pageData.title === undefined ? '' : pageData.title,
            startingClouds: pageData.startingClouds === undefined ?
                landingPageHelper.newTiles() :
                pageData.startingClouds,
            infiniteClouds: pageData.infiniteClouds === undefined ?
                landingPageHelper.newTiles() :
                pageData.infiniteClouds,
            cloudBannerTexts: pageData.cloudBannerTexts === undefined ?
                landingPageHelper.newCloudBannerTexts() :
                pageData.cloudBannerTexts,
            markdownIntro: pageData.markdownIntro === undefined ?
                '' :
                pageData.markdownIntro,
            svgIconLinksServices: pageData.svgIconLinksServices === undefined ?
                [] :
                pageData.svgIconLinksServices,
            whatWeveDones: pageData.whatWeveDones === undefined ?
                landingPageHelper.newTiles() :
                pageData.whatWeveDones,
            technologyClouds: pageData.technologyClouds === undefined ?
                landingPageHelper.newTiles() :
                pageData.technologyClouds,
            technologyMarkdown: pageData.technologyMarkdown === undefined ?
                '' :
                pageData.technologyMarkdown,
            markdownOutro: pageData.markdownOutro === undefined ?
                '' :
                pageData.markdownOutro,
            hasContactForm: pageData.hasContactForm === undefined ?
                false :
                pageData.hasContactForm
        }

        return (
            <div className='row no-gutters col-12'>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='title'
                        label='Title'
                        required
                        onChange={this.onChange}
                        value={landingPage.title}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 col-lg-6 no-gutters'>
                    <SortableTiles
                        ref={x => this.sortableStartingClouds = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='startingClouds'
                        label='Starting Clouds'
                        clouds={landingPage.startingClouds}
                        newItem={landingPageHelper.newTile()}
                        onChange={this.onChange}
                        maxClouds={4}
                        linkIsMandatory={false}
                        useMarkdown={false}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 col-lg-6 no-gutters'>
                    <SortableTiles
                        ref={x => this.sortableInfiniteClouds = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='infiniteClouds'
                        label='Infinite Clouds'
                        clouds={landingPage.infiniteClouds}
                        newItem={landingPageHelper.newTile()}
                        onChange={this.onChange}
                        maxClouds={8}
                        linkIsMandatory={false}
                        useMarkdown={false}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 col-lg-6 no-gutters'>
                    <SortableCloudBannerTexts
                        ref={x => this.sortableCloudBannerTexts = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='cloudBannerTexts'
                        cloudBannerTexts={landingPage.cloudBannerTexts}
                        newItem={landingPageHelper.newCloudBannerText()}
                        onChange={this.onChange}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters'>
                    <MarkdownEditor
                        contentDataUrlRouteId={this.props.contentData.urlRouteId}
                        name='markdownIntro'
                        label='Introduction'
                        value={landingPage.markdownIntro}
                        onChange={this.onChange}
                        showAssetPicker={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 col-lg-6 no-gutters'>
                    <SortableSvgIcons
                        ref={x => this.sortableSvgIcons = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='svgIconLinksServices'
                        svgIconLinksServices={landingPage.svgIconLinksServices}
                        newItem={landingPageHelper.newSvgIconLink()}
                        onChange={this.onChange}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 col-lg-6 no-gutters'>
                    <SortableTiles
                        ref={x => this.sortableWhatWeveDones = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='whatWeveDones'
                        label="What We've Done Tiles"
                        clouds={landingPage.whatWeveDones}
                        newItem={landingPageHelper.newTile()}
                        onChange={this.onChange}
                        maxClouds={4}
                        linkIsMandatory={true}
                        useMarkdown={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 col-lg-6 no-gutters'>
                    <SortableTiles
                        ref={x => this.sortableTechnologyClouds = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='technologyClouds'
                        label='Technology Clouds'
                        clouds={landingPage.technologyClouds}
                        newItem={landingPageHelper.newTile()}
                        onChange={this.onChange}
                        maxClouds={5}
                        linkIsMandatory={false}
                        useMarkdown={false}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters'>
                    <MarkdownEditor
                        contentDataUrlRouteId={this.props.contentData.urlRouteId}
                        name='technologyMarkdown'
                        label='Technology Markdown'
                        value={landingPage.technologyMarkdown}
                        onChange={this.onChange}
                        showAssetPicker={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters'>
                    <MarkdownEditor
                        contentDataUrlRouteId={this.props.contentData.urlRouteId}
                        name='markdownOutro'
                        label='Outro'
                        value={landingPage.markdownOutro}
                        onChange={this.onChange}
                        showAssetPicker={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters'>
                    <Checkbox
                        name='hasContactForm'
                        label='Has Contact Form'
                        onChange={this.onChange}
                        value={landingPage.hasContactForm}
                    />
                </div>
            </div>
        )
    }
}

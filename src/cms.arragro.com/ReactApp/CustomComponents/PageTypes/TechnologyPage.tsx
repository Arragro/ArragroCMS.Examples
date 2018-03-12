﻿import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components, htmlHelper } from 'arragrocms-management'

import { ITile, ICloudBannerText, ISvgIconLink } from '../interfaces'

import SortableTiles from '../Components/Tiles/SortableTiles'
import SortableCloudBannerTexts from '../Components/CloudBannerTexts/SortableCloudBannerTexts'
import SortableSvgIcons from '../Components/SvgIconLinks/SortableSvgIcons'
import MarkdownEditor from '../MarkdownEditor'

const { Input, Textarea } = FRC

const technologyPageHelper = {
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
    }
}


export interface ITechnologyPageState {
    title: string
    introMarkdown: string
    technologySections: Array<ITile>
}


export default class TechnologyPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, ITechnologyPageState> {
    constructor(props) {
        super(props)
    }

    sortableTechnologySections: SortableTiles

    public render() {
        
        const pageData = this.props.contentData.contentJson[this.props.culture] as ITechnologyPageState
        const technologyPage = {
            title: pageData.title === undefined ? '' : pageData.title,
            introMarkdown: pageData.introMarkdown === undefined ? '' : pageData.introMarkdown,
            technologySections: pageData.technologySections === undefined ?
                technologyPageHelper.newTiles() :
                pageData.technologySections
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
                        value={technologyPage.title}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters'>
                    <MarkdownEditor
                        contentDataUrlRouteId={this.props.contentData.urlRouteId}
                        name='introMarkdown'
                        label='Outro'
                        value={technologyPage.introMarkdown}
                        onChange={this.onChange}
                        showAssetPicker={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters full-width-buttons'>
                    <SortableTiles
                        ref={x => this.sortableTechnologySections = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='technologySections'
                        label='Technology Sections  '
                        clouds={technologyPage.technologySections}
                        newItem={technologyPageHelper.newTile()}
                        onChange={this.onChange}
                        maxClouds={4}
                        linkIsMandatory={false}
                        useMarkdown={true}
                    />
                </div>
            </div>
        )
    }
}
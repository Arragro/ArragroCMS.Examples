import * as React from 'react'
import * as Formsy from 'formsy-react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components } from 'arragrocms-management'

import { ITile } from '../interfaces'

import SortableTiles from '../Components/Tiles/SortableTiles'
import MarkdownEditor from '../MarkdownEditor'

const { Input, Checkbox } = FRC

const tileBulletPageHelper = {
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

Formsy.addValidationRule('isCol', (values: any, value: string) => {
    const int = parseInt(value);
    console.log(int)
    console.log(values)
    if (typeof int !== 'number') {
        return false;
    }
    return int <= 12;
});


export interface ITileBulletPageState {
    title: string
    introMarkdown: string
    cloudTileBullets: boolean
    tileBullets: Array<ITile>
    leftColumns: number
    rightColumns: number
}


export default class TileBulletPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, ITileBulletPageState> {
    sortableTechnologySections: SortableTiles | null = null

    constructor(props: Interfaces.IComponentTypeBaseProps) {
        super(props)
    }

    public render() {
        
        const pageData = (this.props.contentData.contentJson as any)[this.props.culture] as ITileBulletPageState
        const tileBulletPage = {
            title: pageData.title === undefined ? '' : pageData.title,
            introMarkdown: pageData.introMarkdown === undefined ? '' : pageData.introMarkdown,
            cloudTileBullets: pageData.cloudTileBullets === undefined ? false : pageData.cloudTileBullets,
            tileBullets: pageData.tileBullets === undefined ?
                tileBulletPageHelper.newTiles() :
                pageData.tileBullets,
            leftColumns: pageData.leftColumns === undefined ? '4' : pageData.leftColumns,
            rightColumns: pageData.rightColumns === undefined ? '8' : pageData.rightColumns,
        }

        return (
            <div className='row col-12'>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='title'
                        label='Title'
                        required
                        onChange={this.onChange}
                        value={tileBulletPage.title}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters'>
                    <MarkdownEditor
                        contentDataUrlRouteId={this.props.contentData.urlRouteId}
                        name='introMarkdown'
                        label='Intro'
                        value={tileBulletPage.introMarkdown}
                        onChange={this.onChange}
                        showAssetPicker={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-lg-2'>
                    <Checkbox
                        type='checkbox'
                        name='cloudTileBullets'
                        label='Use Clouds for the Bullets'
                        onChange={this.onChange}
                        value={tileBulletPage.cloudTileBullets}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 col-lg-6 no-gutters full-width-buttons'>
                    <SortableTiles
                        ref={x => this.sortableTechnologySections = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='tileBullets'
                        label='Tile Bullets'
                        clouds={tileBulletPage.tileBullets}
                        newItem={tileBulletPageHelper.newTile()}
                        onChange={this.onChange}
                        maxClouds={10}
                        linkIsMandatory={false}
                        useMarkdown={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-6 col-lg-3'>
                    <Input
                        type='number'
                        name='leftColumns'
                        label='Left Columns'
                        required
                        validations={{
                            isCol: 0
                        }}
                        validationErrors={{
                            isCol: 'Please supply a number <= 12'
                        }}
                        onChange={this.onChange}
                        value={tileBulletPage.leftColumns}
                    />
                </div>
                <div className='col-6 col-lg-3'>
                    <Input
                        type='number'
                        name='rightColumns'
                        label='Right Columns'
                        required
                        validations={{
                            isCol: 0
                        }}
                        validationErrors={{
                            isCol: 'Please supply a number <= 12'
                        }}
                        onChange={this.onChange}
                        value={tileBulletPage.rightColumns}

                    />
                </div>
            </div>
        )
    }
}

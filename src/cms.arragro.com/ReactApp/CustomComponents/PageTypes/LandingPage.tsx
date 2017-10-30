import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components, htmlHelper } from 'arragrocms-management'

import { ICarousel, ISvgIconLink } from '../interfaces'

import SortableCarousel from '../Components/Carousel/SortableCarousel'
import SortableSvgIcons from '../Components/SvgIconLinks/SortableSvgIcons'

const { Input, Textarea } = FRC

const landingPageHelper = {
    newCarousel: (): ICarousel => {
        return {
            name: '',
            imageUrl: '',
            imageAlt: '',
            hasLink: false,
            linkText: '',
            href:''
        }
    },

    newRandomCarousel: (): Array<ICarousel> => {
        return new Array<ICarousel>()
    },

    newSvgIconLink: (): ISvgIconLink => {
        return {
            title: '',
            svg: '',
            href: ''
        }
    }
}


export interface ILandingPageState {
    title: string
    carousels: Array<ICarousel>
    svgIconLinks: Array<ISvgIconLink>
}


export default class LandingPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, ILandingPageState> {
    constructor(props) {
        super(props)
    }

    sortableCarousel: SortableCarousel
    sortableSvgIcons: SortableSvgIcons

    public render() {
        let source = '# This is a header\n\nAnd this is a paragraph'
        
        const pageData = this.props.contentData.contentJson[this.props.culture] as ILandingPageState
        const landingPage = {
            title: pageData.title === undefined ? '' : pageData.title,
            carousels: pageData.carousels === undefined ?
                    landingPageHelper.newRandomCarousel() :
                    pageData.carousels,
            svgIconLinks: pageData.svgIconLinks === undefined ?
                [] :
                pageData.svgIconLinks,
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
                <div className='col-12 no-gutters full-width-buttons'>
                    <SortableCarousel
                        ref={x => this.sortableCarousel = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='carousels'
                        carousels={landingPage.carousels}
                        newItem={landingPageHelper.newCarousel()}
                        onChange={this.onChange}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters full-width-buttons'>
                    <SortableSvgIcons
                        ref={x => this.sortableSvgIcons = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='svgIconLinks'
                        svgIconLinks={landingPage.svgIconLinks}
                        newItem={landingPageHelper.newSvgIconLink()}
                        onChange={this.onChange}
                    />
                </div>
                <hr className='col-12' />
            </div>
        )
    }
}
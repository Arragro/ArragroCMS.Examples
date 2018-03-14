import * as React from 'react'
import * as Formsy from 'formsy-react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components, htmlHelper, validationRules } from 'arragrocms-management'

import { ITile, ICloudBannerText, ISvgIconLink } from '../interfaces'

import SortableTiles from '../Components/Tiles/SortableTiles'
import SortableCloudBannerTexts from '../Components/CloudBannerTexts/SortableCloudBannerTexts'
import SortableSvgIcons from '../Components/SvgIconLinks/SortableSvgIcons'
import MarkdownEditor from '../MarkdownEditor'

const { Input} = FRC

export interface IRedirectPageState {
    redirect: string
}

validationRules.LoadCustomValidationRules()

export default class RedirectPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, IRedirectPageState> {
    constructor(props) {
        super(props)
    }

    sortableTechnologySections: SortableTiles

    public render() {
        
        const pageData = this.props.contentData.contentJson[this.props.culture] as IRedirectPageState
        const tileBulletPage = {
            redirect: pageData.redirect === undefined ? '' : pageData.redirect
        }

        return (
            <div className='row no-gutters col-12'>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='redirect'
                        label='Redirect'
                        validations={{
                            isValidUrl: 0
                        }}
                        validationErrors={{
                            isValidUrl: 'Please supply a valid Url'
                        }}
                        required
                        onChange={this.onChange}
                        value={tileBulletPage.redirect}
                    />
                </div>
            </div>
        )
    }
}
import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components, utils } from 'arragrocms-management'


import SortableTiles from '../Components/Tiles/SortableTiles'

const { Input} = FRC

export interface IRedirectPageState {
    redirectUrl: string
}

utils.LoadCustomValidationRules()

export default class RedirectPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, IRedirectPageState> {
    sortableTechnologySections: SortableTiles | null = null

    constructor(props: Interfaces.IComponentTypeBaseProps) {
        super(props)
    }

    public render() {
        
        const pageData = (this.props.contentData.contentJson as any)[this.props.culture] as IRedirectPageState
        const tileBulletPage = {
            redirectUrl: pageData.redirectUrl === undefined ? '' : pageData.redirectUrl
        }

        return (
            <div className='row no-gutters col-12'>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='redirectUrl'
                        label='Redirect Url'
                        validations={{
                            isValidUrl: 0
                        }}
                        validationErrors={{
                            isValidUrl: 'Please supply a valid Url'
                        }}
                        required
                        onChange={this.onChange}
                        value={tileBulletPage.redirectUrl}
                    />
                </div>
            </div>
        )
    }
}

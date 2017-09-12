import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, ComponentTypeBase } from 'arragrocms-management'
import MarkdownEditor from '../MarkdownEditor'

const { Input, Textarea } = FRC

export interface IMarkdownConfigurationState {
    testData: string
    version: number
}


export default class MarkdownConfiguration extends ComponentTypeBase<Interfaces.IComponentTypeBaseProps, IMarkdownConfigurationState> {
    constructor (props) {
        super(props)

        if (this.props.contentData) {
            if (this.props.contentData.configurationJson) {
                const configurationJson = this.props.contentData.configurationJson as any
                const testData = configurationJson.testData !== undefined ? configurationJson.testData : ''
                const version = configurationJson.version !== undefined ? configurationJson.version : -1
                this.state = {
                    testData: testData,
                    version: version,
                }
            } else {
                this.state = this.defaultStandardPage
            }
        }
    }

    testData: any

    defaultStandardPage: IMarkdownConfigurationState = {
        testData: '',
        version: -1,
    }

    public getModel () {
        return {
            testData: this.testData.getValue()
        }
    }

    public render () {
        return (
            <div className='row no-gutters col-12'>
                <div className='col-lg-6'>
                    <Input
                        ref={(x) => this.testData = x}
                        type='text'
                        name='testData'
                        label='Test Data'
                        required
                        onChange={this.onChange}
                        value={this.state.testData}
                    />
                </div>
            </div>
        )
    }
}
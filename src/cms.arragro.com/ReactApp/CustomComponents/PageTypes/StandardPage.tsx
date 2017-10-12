import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components } from 'arragrocms-management'

const { Input, Textarea} = FRC

export interface IStandardPageState {
    title: string
    body: string
    version: number
}


export default class StandardPage extends Components.ComponentTypeBase<Interfaces.IComponentTypeBaseProps, IStandardPageState> {
    constructor (props) {
        super(props)
        
        if (this.props.contentData) {
            if (this.props.contentData.contentJson &&
                this.props.contentData.contentJson[this.props.culture] !== undefined) {
                this.state = {
                    title: this.props.contentData.contentJson[this.props.culture].title,
                    body: this.props.contentData.contentJson[this.props.culture].body,
                    version: this.props.contentData.contentJson[this.props.culture].version
                }
            } else {
                this.state = this.defaultStandardPage
            }
        }
    }

    title: any
    body: any

    defaultStandardPage: IStandardPageState = {
        title: '',
        body: '',
        version: -1
    }

    public getModel () {
        return {
            title: this.title.getValue(),
            body: this.body.getValue()
        }
    }

    public render () {
        let source = '# This is a header\n\nAnd this is a paragraph'
        let options = {
        }
        return (
            <div className='col-md-6'>
                <Input
                    ref={(x) => this.title = x}
                    type='text'
                    name='title'
                    label='Title'
                    required
                    onChange={this.onChange}
                    value={this.state.title}
                />
                <Textarea
                    ref={(x) => this.body = x}
                    name='body'
                    label='Body'
                    onChange={this.onChange}
                    value={this.state.body}
                />
            </div>
        )
    }
}
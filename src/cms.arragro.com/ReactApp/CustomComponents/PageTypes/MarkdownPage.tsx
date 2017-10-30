import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components } from 'arragrocms-management'
import MarkdownEditor from '../MarkdownEditor'

const { Input, Textarea} = FRC

export interface IMarkdownPageState {
    title: string
    markdown: string
    version: number
}


export default class MarkdownPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, IMarkdownPageState> {
    constructor (props) {
        super(props)
        
        if (this.props.contentData) {
            if (this.props.contentData.contentJson &&
                this.props.contentData.contentJson[this.props.culture] !== undefined) {
                this.state = {
                    title: this.props.contentData.contentJson[this.props.culture].title,
                    markdown: this.props.contentData.contentJson[this.props.culture].markdown,
                    version: this.props.contentData.contentJson[this.props.culture].version
                }
            } else {
                this.state = this.defaultStandardPage
            }
        }
    }

    title: any
    body: any

    defaultStandardPage: IMarkdownPageState = {
        title: '',
        markdown: '',
        version: -1,
    }

    public render () {
        let source = '# This is a header\n\nAnd this is a paragraph'
        let options = {
        }
        return (
            <div className='row no-gutters col-12'>
                <div className='col-lg-6'>
                    <Input
                        ref={(x) => this.title = x}
                        type='text'
                        name='title'
                        label='Title'
                        required
                        onChange={this.onChange}
                        value={this.state.title}
                    />
                </div>
                <div className='col-12 no-gutters'>
                    <MarkdownEditor 
                        contentDataUrlRouteId={this.props.contentData.urlRouteId} 
                        name='markdown'
                        label='Content'
                        value={this.state.markdown} 
                        onChange={this.onChange} 
                        showAssetPicker={true}
                    />
                </div>
            </div>
        )
    }
}
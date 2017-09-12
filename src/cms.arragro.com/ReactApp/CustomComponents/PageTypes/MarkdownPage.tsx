import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, ComponentTypeBase } from 'arragrocms-management'
import MarkdownEditor from '../MarkdownEditor'

const { Input, Textarea} = FRC

export interface IMarkdownPageState {
    title: string
    markdown: string
    version: number
}


export default class MarkdownPage extends ComponentTypeBase<Interfaces.IComponentTypeBaseProps, IMarkdownPageState> {
    constructor (props) {
        super(props)
        
        if (this.props.contentData) {
            if (this.props.contentData.pageJson &&
                this.props.contentData.pageJson[this.props.culture] !== undefined) {
                this.state = {
                    title: this.props.contentData.pageJson[this.props.culture].title,
                    markdown: this.props.contentData.pageJson[this.props.culture].markdown,
                    version: this.props.contentData.pageJson[this.props.culture].version
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

    public getModel () {
        return {
            title: this.title.getValue(),
            markdown: this.state.markdown
        }
    }

    onMarkdownEditorChange = (markdown) => {
        this.setState({
            ...this.state,
            markdown
        }, () => this.onChange('markdown', markdown))
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
                    <MarkdownEditor contentDataUrlRouteId={this.props.contentData.urlRouteId} value={this.state.markdown} onChange={this.onMarkdownEditorChange.bind(this)} />
                </div>
            </div>
        )
    }
}
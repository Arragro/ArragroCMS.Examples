import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components } from 'arragrocms-management'
import MarkdownEditor from '../MarkdownEditor'

const { Input } = FRC

export interface IMarkdownPostState {
    title: string
    markdown: string
    version: number
}


export default class MarkdownPost extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, IMarkdownPostState> {
    constructor (props: Interfaces.IComponentTypeBaseProps) {
        super(props)
        
        if (this.props.contentData) {
            const data = (this.props.contentData.contentJson as any)[this.props.culture]
            if (this.props.contentData.contentJson &&
                data) {
                this.state = {
                    title: data.title,
                    markdown: data.markdown,
                    version: data.version
                }
            } else {
                this.state = this.defaultStandardPage
            }
        }
    }

    componentWillReceiveProps(nextProps: Interfaces.IComponentTypeBaseProps) {
        if (this.props.culture !== nextProps.culture) {
            const pageData = (this.props.contentData.contentJson as any)[nextProps.culture] as IMarkdownPostState
            this.setState({
                ...this.state,
                markdown: pageData.markdown === undefined ? '' : pageData.markdown
            })
        }
    }

    title: any
    body: any

    defaultStandardPage: IMarkdownPostState = {
        title: '',
        markdown: '',
        version: -1,
    }

    onMarkdownEditorChange = (markdown: string) => {
        this.setState({
            ...this.state,
            markdown
        }, () => this.onChange('markdown', markdown))
    }

    public render () {
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
                        onChange={this.onMarkdownEditorChange.bind(this)} 
                        showAssetPicker={true}
                    />
                </div>
            </div>
        )
    }
}

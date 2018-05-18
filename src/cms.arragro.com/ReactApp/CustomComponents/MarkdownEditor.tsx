import * as React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import * as ReactMarkdown from 'react-markdown'
import * as Formsy from 'formsy-react'
import { Interfaces, Components, utils } from 'arragrocms-management'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/display/autorefresh'

export interface IMarkdownEditorProps {
    contentData: Interfaces.IContentData
    name: string
    label: string
    value: string
    showAssetPicker: boolean
    options?: any
    onChange(name: string, value: string): void
}

class MarkdownEditor extends React.Component<IMarkdownEditorProps & any> {
    assetModal: Components.AssetModal | null = null
    codeMirror: any = null

    constructor(props: IMarkdownEditorProps & any) {
        super(props)

        this.state = {
            showImageAssetModal: false
        }

        this.onChange = this.onChange.bind(this)
    }

    closeClick = () => {
        if (this.assetModal !== null) {
            this.assetModal.toggle()
        }
    }

    selectClick = (asset: Interfaces.IAsset) => {
        let cursor = this.codeMirror.editor.getCursor()
        this.codeMirror.editor.replaceRange(`![${asset.alt}](${window.location.origin}/${asset.url})`, cursor, cursor)
        this.setState({
            ...this.state,
            showImageAssetModal: false
        })
    }

    showImageAssetModal = () => {
        if (this.assetModal !== null) {
            this.assetModal.toggle()
        }
    }

    onChange(editor: any, metadata: any, value: any) {
        this.props.onChange(this.props.name, value)
        this.props.setValue(value)
    }

    isValid() {
        return false
    }

    render() {
        const options = {
            ...this.props.options,
            lineNumbers: true,
            readOnly: false,
            mode: 'markdown',
            theme: 'eclipse',
            autofocus: false,
            lineWrapping: true,
            autoRefresh: true
        }

        const { contentData } = this.props
        const markdownClass = this.props.showAssetPicker ? 'col-6 pt-4 mt-3' : 'col-6'
        const styleIssue = { border: '1px solid red' }
        const style = (this.props.showRequired() && this.props.isFormSubmitted() ? styleIssue : this.props.showError() ? styleIssue : {})
        const mimeTypeFilter = 'image/jpeg,image/png,image/pjpeg'
        const dropzoneAccept = 'image/jpeg,image/png,image/pjpeg'

        console.log(contentData)

        return (
            <div className='row no-gutters'>
                <div className='form-group col-12'>
                    <label className="control-label">{this.props.label}</label>
                </div>
                <div className='col-6 full-width-buttons' style={style}>
                    <Components.AssetModal
                        ref={(x: Components.AssetModal | null) => this.assetModal = x}
                        contentData={contentData}              
                        mimeTypeFilter={mimeTypeFilter}
                        selectClick={this.selectClick}
                        closeClick={this.closeClick}
                        dropzoneAccept={dropzoneAccept}
                        maxSize={10485760}
                        showResize={true}
                    />
                    {utils.HtmlHelper.renderButton('btn-primary', this.showImageAssetModal.bind(this), '', 'Select Image', this.props.showAssetPicker, false)}
                    <CodeMirror 
                        ref={(x) => this.codeMirror = x} 
                        value={this.props.value} 
                        options={options} 
                        onChange={this.onChange}                         
                        onBeforeChange={this.onChange} />
                </div>
                <div className={markdownClass}>
                    <ReactMarkdown source={this.props.value} escapeHtml={false} />
                </div>
            </div>
        )
    }
}

var markdownEditor = Formsy.withFormsy(MarkdownEditor)

export default markdownEditor

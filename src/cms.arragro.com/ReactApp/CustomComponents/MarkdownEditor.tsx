import * as React from 'react'
import CodeMirror from 'react-codemirror2'
import ReactMarkdown from 'react-markdown'
import * as Formsy from 'formsy-react'
import { Interfaces, Components, htmlHelper } from 'arragrocms-management'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/markdown/markdown'

export interface IMarkdownEditorProps {
    contentDataUrlRouteId: string
    name: string
    label: string
    value: string
    showAssetPicker: boolean
    options?: any
    onChange(name, value)
}

export interface IMarkdownEditorState {
    showImageAssetModal: boolean
}

class MarkdownEditor extends React.Component<IMarkdownEditorProps & any, IMarkdownEditorState> {
    constructor(props) {
        super(props)

        this.state = {
            showImageAssetModal: false
        }

        this.onChange = this.onChange.bind(this)
    }

    assetModal: Components.AssetModal
    codeMirror: any

    closeClick = () => {
        this.setState({
            ...this.state,
            showImageAssetModal: false
        })
    }

    selectClick = (asset: Interfaces.IAsset) => {
        let cursor = this.codeMirror.editor.getCursor()
        this.codeMirror.editor.replaceRange(`![${asset.alt}](${window.location.origin}/${asset.url})`, cursor, cursor)
        this.setState({
            ...this.state,
            showImageAssetModal: false
        })
    }

    getImageAssetModal = (show: boolean) => {
        if (show) {
            const mimeTypeFilter = 'image/jpeg,image/png,image/pjpeg'
            const dropzoneAccept = 'image/jpeg,image/png,image/pjpeg'
            return <Components.AssetModal
                ref={(x) => this.assetModal = x}
                contentUrlRouteId={this.props.contentDataUrlRouteId}                
                mimeTypeFilter={mimeTypeFilter}
                selectClick={this.selectClick}
                closeClick={this.closeClick}
                dropzoneAccept={dropzoneAccept}
                maxSize={10485760}
                showResize={true}
            />
        } else {
            return null
        }
    }

    showImageAssetModal = () => {
        this.setState({
            ...this.state,
            showImageAssetModal: true
        }, () => {
            this.assetModal.toggle()
        })
    }

    onChange(editor, metadata, value) {
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
            lineWrapping: true
        }

        const markdownClass = this.props.showAssetPicker ? 'col-6 pt-4 mt-3' : 'col-6'
        const styleIssue = { border: '1px solid red' }
        const style = (this.props.showRequired() && this.props.isFormSubmitted() ? styleIssue : this.props.showError() ? styleIssue : {})

        return (
            <div className='row no-gutters'>
                <div className='form-group col-12'>
                    <label className="control-label">{this.props.label}</label>
                </div>
                <div className='col-6 full-width-buttons' style={style}>
                    {this.getImageAssetModal(this.state.showImageAssetModal)}
                    {htmlHelper.renderButton('btn-primary', this.showImageAssetModal.bind(this), '', 'Select Image', this.props.showAssetPicker, false)}
                    <CodeMirror ref={(x) => this.codeMirror = x} value={this.props.value} options={options} onChange={this.onChange} autoScrollCursorOnSet={false} />
                </div>
                <div className={markdownClass}>
                    <ReactMarkdown source={this.props.value} escapeHtml={false} />
                </div>
            </div>
        )
    }
}

var markdownEditor = Formsy.HOC(MarkdownEditor)

export default markdownEditor

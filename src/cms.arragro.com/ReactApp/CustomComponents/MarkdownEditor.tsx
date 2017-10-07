import * as React from 'react'
import CodeMirror from 'react-codemirror2'
import ReactMarkdown from 'react-markdown'
import { Interfaces, Components, htmlHelper } from 'arragrocms-management'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/markdown/markdown'

export interface IMarkdownEditorProps {
    contentDataUrlRouteId: string
    value: string
    onChange(value)
}

export interface IMarkdownEditorState {
    showImageAssetModal: boolean
}

export default class MarkdownEditor extends React.Component<IMarkdownEditorProps, IMarkdownEditorState> {
    constructor (props) {
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
        let cursor = this.codeMirror.getCodeMirror().getCursor()
        this.codeMirror.getCodeMirror().replaceRange(`![${asset.alt}](${window.location.origin}/${asset.url})`, cursor, cursor)
        this.setState({
            ...this.state,
            showImageAssetModal: false
        })
    }

    getImageAssetModal = (show: boolean) => {
        if (show) {
            const mimeTypeFilter = 'image/*'
            const dropzoneAccept = 'image/*'
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
        this.props.onChange(value)
    }

    render () {
        const options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'markdown',
            theme: 'eclipse',
            lineWrapping: true
        }

        return (
            <div className='d-flex col-12 no-gutters'>
                <div className='col-6 full-width-buttons'>
                    {this.getImageAssetModal(this.state.showImageAssetModal)}
                    {htmlHelper.renderButton('btn-primary', this.showImageAssetModal.bind(this), '', 'Select Image', true, false)}
                    <CodeMirror ref={(x) => this.codeMirror = x} value={this.props.value} options={options} onChange={this.onChange} />
                </div>
                <div className='col-6 pt-4 mt-3'>
                    <ReactMarkdown source={this.props.value} escapeHtml={false} />
                </div>
            </div>
        )
    }
}
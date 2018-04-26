import * as React from 'react'

export default React.__Addons.update

declare module 'react' {
    interface UpdateSpecCommand {
        $set?: any
        $merge?: {}
        $apply?(value: any): any
    }

    interface UpdateSpecPath {
        [key: string]: UpdateSpec
    }

    type UpdateSpec = UpdateSpecCommand | UpdateSpecPath

    interface UpdateArraySpec extends UpdateSpecCommand {
        $push?: any[]
        $unshift?: any[]
        $splice?: any[][]
    }

    namespace __Addons {
        export function update (value: any[], spec: UpdateArraySpec): any[]
        export function update (value: {}, spec: UpdateSpec): any
    }
}


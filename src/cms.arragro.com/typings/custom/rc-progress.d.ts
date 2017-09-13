import * as React from 'react';

declare module "rc-progress" {

    interface IProgressProps {    
        prefixCls?: string;
        strokeWidth: string;
        trailWidth?: string;
        strokeColor: string;
        trailColor: string;
        strokeLinecap?: string;
        percent: number;
        style?: any;
        className?: string;
    }
    
    
    export const Line: React.ClassicComponentClass<IProgressProps>;
    export const Circle: React.ClassicComponentClass<IProgressProps>;
}

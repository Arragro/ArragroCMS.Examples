import 'yup'

declare module 'yup' {
    interface StringSchema {
        numberTest(required: boolean, positive: boolean): StringSchema
        decimalTest(required: boolean, positive: boolean): StringSchema
        moreThanCustom(ref: any, msg: any): StringSchema
        lessThanCustom(ref: any, msg: any): StringSchema
        equalTo(ref: any, msg: any): StringSchema
    }
    interface DateSchema {
        moreThanCustom(ref: any, msg: any): DateSchema
        lessThanCustom(ref: any, msg: any): DateSchema
    }
    interface ObjectSchema<T> {
        uniqueProperty(property: string, message: string, item: Array<any>, caseSensitive?: boolean): ObjectSchema<T>
    }
}

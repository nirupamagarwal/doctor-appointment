/* jshint node:true */
"use strict"
var Regex = {
    number: /^[0-9]*$/,
    email: /^([A-Za-z0-9_\-\.\!\#\$\%\^\&\Z*\(\)\{\}\|\:\;\?\><\`\~\=\+\{\}<\>'\''])+\@(([A-Za-z0-9-])+\.){1,20}([A-Za-z]{2,6})$/,
    phone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    dateTime: /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9][0-9][0-9][0-9]/g
};


function validateSchema(inputs, schema) {
    return new Promise(function (fulfill, reject) {
        try {
            let { error } = schema.validate(inputs);
            if (error) throw error.details ? { "schemaError": true, "message": error.details[0].message.replace(/['"]+/g, '') } : "";
            else fulfill(true);
        } catch (ex) {
            reject(ex);
            return;
        }
    });
}

function validateSchemaReturnError(inputs, schema) {
    return new Promise(function (fulfill, reject) {
        try {
            let { error } = schema.validate(inputs);
            if (error){
                error =  error.details ? { "schemaError": true, "message": error} : "";
                fulfill(error);
                }
            else fulfill(true);
        } catch (ex) {
            reject(ex);
            return;
        }
    });
}

export default {
    validateSchema,
    validateSchemaReturnError,
    Regex
  };
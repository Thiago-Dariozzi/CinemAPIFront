import React from 'react';
import FieldInput from './FieldInput';
const FieldBody = (props) => (
    <>
        {props.field.type !== "checkbox" && <label className="form-label">{props.field.label}</label>}
        <FieldInput {...props} />
        {props.touched && props.error && <p className="form-error-text">{props.error}</p>}
    </>
);

export default FieldBody;

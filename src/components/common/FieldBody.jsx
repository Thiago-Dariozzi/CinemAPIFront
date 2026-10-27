import { useId } from 'react';
import FieldInput from './FieldInput';

const FieldBody = (props) => {
    const id = useId();
    const isCheckbox = props.field.type === "checkbox";

    return (
        <>
            {!isCheckbox && <label className="form-label" htmlFor={id}>{props.field.label}</label>}
            <FieldInput {...props} id={isCheckbox ? undefined : id} />
            {props.touched && props.error && <p className="form-error-text">{props.error}</p>}
        </>
    );
};

export default FieldBody;

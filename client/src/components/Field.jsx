import { forwardRef, useId } from 'react';
import s from './Field.module.css';

export const Field = forwardRef(function Field(
  { label, hint, error, type = 'text', className, as = 'input', children, ...rest },
  ref
) {
  const id = useId();
  const Tag = as;
  return (
    <div className={`${s.field} ${error ? s.errored : ''} ${className || ''}`}>
      <label htmlFor={id} className={s.label}>{label}</label>
      {as === 'select' ? (
        <select id={id} ref={ref} className={s.input} {...rest}>{children}</select>
      ) : as === 'textarea' ? (
        <textarea id={id} ref={ref} className={s.input} rows={3} {...rest} />
      ) : (
        <input id={id} ref={ref} type={type} className={s.input} {...rest} />
      )}
      {(hint || error) && (
        <p className={`${s.hint} ${error ? s.hintError : ''}`}>{error || hint}</p>
      )}
    </div>
  );
});

export default Field;

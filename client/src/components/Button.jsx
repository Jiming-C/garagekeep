import s from './Button.module.css';

export default function Button({ children, variant = 'solid', as: As = 'button', className, ...rest }) {
  const cls = `${s.btn} ${s[variant] || ''} ${className || ''}`;
  return <As className={cls} {...rest}>{children}</As>;
}

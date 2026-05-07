import s from './Skeleton.module.css';

export default function Skeleton({ height = 16, width = '100%', className, style }) {
  return (
    <span
      className={`${s.skel} ${className || ''}`}
      style={{ height, width, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={s.card}>
      <div className={s.photo} />
      <div className={s.body}>
        <Skeleton height={28} width="60%" />
        <Skeleton height={14} width="40%" />
        <div className={s.spacer} />
        <Skeleton height={14} width="100%" />
        <Skeleton height={14} width="100%" />
        <Skeleton height={14} width="80%" />
      </div>
    </div>
  );
}

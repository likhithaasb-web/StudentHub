import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#6366f1',
  bgColor = 'rgba(99, 102, 241, 0.12)',
  linkTo,
}) => {
  const content = (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: linkTo ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {value}
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            backgroundColor: bgColor,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>{subtitle}</span>
        {linkTo && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: color, fontWeight: 600 }}>
            View <ArrowUpRight size={14} />
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} style={{ textDecoration: 'none', color: 'inherit' }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default StatCard;

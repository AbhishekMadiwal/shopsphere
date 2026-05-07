import { Clock, Loader, Truck, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  Pending:    { color: '#FF9500', bg: 'rgba(255,149,0,0.1)',  icon: Clock },
  Processing: { color: '#5AC8FA', bg: 'rgba(90,200,250,0.1)',  icon: Loader },
  Shipped:    { color: '#007AFF', bg: 'rgba(0,122,255,0.1)',   icon: Truck },
  Delivered:  { color: '#34C759', bg: 'rgba(52,199,89,0.1)',   icon: CheckCircle },
  Cancelled:  { color: '#FF3B30', bg: 'rgba(255,59,48,0.1)',   icon: XCircle },
};

const OrderStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { color: '#999', bg: 'rgba(0,0,0,0.05)', icon: Clock };
  const Icon = config.icon;

  return (
    <span
      className="d-inline-flex align-items-center gap-1"
      style={{
        background: config.bg,
        color: config.color,
        fontSize: '0.75rem',
        fontWeight: 700,
        padding: '0.3em 0.75em',
        borderRadius: '50px',
        letterSpacing: '0.02em',
      }}
    >
      <Icon size={13} />
      {status}
    </span>
  );
};

export default OrderStatusBadge;

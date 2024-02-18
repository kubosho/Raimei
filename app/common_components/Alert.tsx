import classNames from 'classnames';
import { CheckmarkSvg } from '../assets/components/CheckmarkSvg';
import { CrossSvg } from '../assets/components/CrossSvg';
import { ExclamationSvg } from '../assets/components/ExclamationSvg';
import { ThunderSvg } from '../assets/components/ThunderSvg';

export interface AlertState {
  message: string;
  type: 'error' | 'info' | 'success' | 'warning';
  description?: string;
}

interface Props extends AlertState {
  onClose: () => void;
}

function Icon({ type }: Pick<Props, 'type'>): JSX.Element {
  switch (type) {
    case 'error': {
      return <CrossSvg alt="Error" className="h-4 fill-red-500 w-4" />;
    }
    case 'info': {
      return <ThunderSvg alt="Info" className="h-4 fill-blue-500 w-4" />;
    }
    case 'success': {
      return <CheckmarkSvg alt="Success" className="h-4 fill-green-500 w-4" />;
    }
    case 'warning': {
      return <ExclamationSvg alt="Warning" className="h-4 fill-yellow-500 w-4" />;
    }
    default: {
      return <></>;
    }
  }
}

export default function Alert({ description, message, onClose, type }: Props): JSX.Element {
  return (
    <div
      className={classNames('border-2 flex items-center text-slate-900 px-4 py-2 rounded', {
        'bg-red-100 border-red-500': type === 'error',
        'bg-blue-100 border-blue-500': type === 'info',
        'bg-green-100 border-green-500': type === 'success',
        'bg-yellow-100 border-yellow-500': type === 'warning',
      })}
      role="alert"
    >
      <Icon type={type} />
      <div className="ml-1">
        <p className="font-bold">{message}</p>
        {description != null && <p>{description}</p>}
      </div>
      <button type="button" className="ml-2 p-1" onClick={onClose}>
        <CrossSvg alt="Close" className="fill-slate-900 h-4 w-4" />
      </button>
    </div>
  );
}

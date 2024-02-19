import svgPath from '../images/exclamation.svg';

interface Props {
  alt: string;
  className?: string;
}

export const ExclamationSvg = ({ alt, className }: Props): JSX.Element => (
  <svg
    aria-hidden="false"
    aria-label={alt}
    className={className ?? ''}
    focusable="false"
    height="100%"
    role="img"
    width="100%"
  >
    <use xlinkHref={`${svgPath}#svg-body`}></use>
  </svg>
);

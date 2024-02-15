interface Props {
  onClick: () => void;
}

export default function SubmitButton({ onClick }: Props) {
  return (
    <button type="button" className="border-2 border-yellow-500 px-4 py-1 rounded" onClick={onClick}>
      Submit
    </button>
  );
}

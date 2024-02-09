interface Props {
  onClick: () => void;
}

export default function SubmitButton({ onClick }: Props) {
  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      Submit
    </button>
  );
}

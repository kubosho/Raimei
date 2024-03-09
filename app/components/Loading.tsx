export default function Loading(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin border-b-2 border-t-2 border-yellow-500 h-32 rounded-full w-32"></div>
    </div>
  );
}

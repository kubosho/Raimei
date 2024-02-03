export default function TitleEditor() {
  return (
    <>
      <label className="sr-only text-gray-900" htmlFor="entry-title">
        Entry title
      </label>
      <input
        type="text"
        name="entry-title"
        id="entry-title"
        defaultValue=""
        className="focus:outline-none leading-relaxed placeholder-gray-500 text-2xl"
        placeholder="Write the title"
      />
    </>
  );
}

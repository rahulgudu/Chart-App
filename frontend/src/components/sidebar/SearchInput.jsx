import { AiOutlineSearch } from "react-icons/ai";
const SearchInput = () => {
  return (
    <form className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered rounded-full"
      />
      <button type="submit" className="btn btn-circle bg-purple-500 text-white">
        <AiOutlineSearch />
      </button>
    </form>
  );
};

export default SearchInput;

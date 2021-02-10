import Link from "next/link";
export default function AddMark() {
  return (
    <button>
      <Link href="/add-mark">
        <a>Add</a>
      </Link>
    </button>
  );
}

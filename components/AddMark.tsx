import Link from "next/link";
import Button from "./Button";
export default function AddMark() {
  return (
    <Button>
      <Link href="/add-mark">
        <a>New</a>
      </Link>
    </Button>
  );
}

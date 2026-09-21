import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="lf-footer">
      <p>
        © {year} Invocation Inc. Not medical advice.
      </p>
      <p>
        <Link href="/privacy">Privacy</Link>
        {" · "}
        <Link href="/terms">Terms</Link>
      </p>
    </footer>
  );
}

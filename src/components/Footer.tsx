import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="lf-footer">
      <p>
        © {year} Invocation Inc. Not therapy. Not medical advice.
      </p>
      <p className="lf-imprint-line">
        <img
          src="/img/invocation-logo.png"
          alt="Invocation Inc"
          width={84}
          height={20}
          className="lf-imprint-logo-sm"
        />
        <span>
          An{" "}
          <a href="https://invocationinc.com/">
            Invocation Inc
          </a>{" "}
          publication
        </span>
      </p>
      <p>
        <Link href="/privacy">Privacy</Link>
        {" · "}
        <Link href="/terms">Terms</Link>
      </p>
    </footer>
  );
}

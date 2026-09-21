import Link from "next/link";
import { bookProduct } from "@/lib/products";

export function Header() {
  return (
    <header className="lf-site-header">
      <a
        href="https://invocationinc.com/"
        aria-label="Invocation Inc"
        className="lf-imprint-mark"
      >
        <img
          src="/img/invocation-logo.png"
          alt="Invocation Inc"
          width={130}
          height={30}
          className="lf-imprint-logo"
        />
      </a>
      <Link href="/#offer">
        Get the {bookProduct.shortName} — {bookProduct.priceDisplay}
      </Link>
    </header>
  );
}

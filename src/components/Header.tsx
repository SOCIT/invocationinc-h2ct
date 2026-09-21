import Link from "next/link";
import { bookProduct } from "@/lib/products";

export function Header() {
  return (
    <header className="lf-site-header">
      <div>Invocation Inc · Human Performance Engineers</div>
      <Link href="/#offer">
        Get the {bookProduct.shortName} — {bookProduct.priceDisplay}
      </Link>
    </header>
  );
}

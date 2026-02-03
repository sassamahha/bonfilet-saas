import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex justify-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            BONFILET
          </Link>
        </div>
      </div>
    </header>
  );
}


import Link from "next/link";
import { List } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bottom-0 left-0 w-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-center space-x-8 my-4">
                    <Link href="/terms" className="hover:text-gray-600 text-xs md:text-base">利用規約</Link>
                    <Link href="/privacy" className="hover:text-gray-600 text-xs md:text-base">プライバシーポリシー</Link>
                    <Link href="/contact" className="hover:text-gray-600 text-xs md:text-base">お問い合わせ</Link>
                    <Link href="/cookie" className="hover:text-gray-600 text-xs md:text-base">Cookieポリシー</Link>
                </div>
                <p className="text-center text-gray-500">2025 ツリキタ[TSURIKITA]</p>
            </div>
        </footer>
    );
}
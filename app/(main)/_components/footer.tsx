import Link from "next/link";
import { List } from "lucide-react";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 w-full p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-center space-x-8 mb-4">
                    <Link href="/terms" className="hover:text-gray-600">利用規約</Link>
                    <Link href="/privacy" className="hover:text-gray-600">プライバシーポリシー</Link>
                    <Link href="/contact" className="hover:text-gray-600">お問い合わせ</Link>
                    <Link href="/cookie" className="hover:text-gray-600">Cookieポリシー</Link>
                </div>
                <p className="text-center text-gray-500">2025 ツリキタ[TSURIKITA]</p>
            </div>
        </footer>
    );
}
import { RefreshCcw } from "lucide-react";
import Header from "./_components/header";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>
    <Header />
    {children}
    </div>;
}
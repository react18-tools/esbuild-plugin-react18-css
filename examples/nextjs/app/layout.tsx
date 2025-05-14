import { Inter } from "next/font/google";
import { SharedRootLayout } from "shared-ui";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SharedRootLayout className={inter.className}>{children}</SharedRootLayout>
      </body>
    </html>
  );
}
